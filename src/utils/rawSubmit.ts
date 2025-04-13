
import {Block, Metadata, SubmitRequest, SubmitResponse} from "@devvit/protos";
import {RunAs, SubmitPostOptions} from "@devvit/public-api";
import {richtextToString} from "@devvit/public-api/apis/reddit/helpers/richtextToString.js";
import {getCustomPostRichTextFallback} from "@devvit/public-api/apis/reddit/helpers/textFallbackToRichtext.js";
import {BlocksReconciler} from "@devvit/public-api/devvit/internals/blocks/BlocksReconciler.js";
import {assertNonNull} from "@devvit/shared-types/NonNull.js";
import {fromByteArray} from "base64-js";

import {getExtendedDevvit} from "../utils/rawData.js";

export async function rawSubmit (options: SubmitPostOptions, metadata: Metadata | undefined): Promise<string> {
    const {runAs = "APP"} = options;
    const runAsType = RunAs[runAs];
    const client =
      runAsType === RunAs.USER
          ? getExtendedDevvit().userActionsPlugin
          : getExtendedDevvit().redditAPIPlugins.LinksAndComments;

    let response: SubmitResponse;

    if ("preview" in options) {
        assertNonNull(metadata, "Missing metadata in `SubmitPostOptions`");
        if (runAsType === RunAs.USER) {
            assertNonNull(
                options.userGeneratedContent,
                "userGeneratedContent must be set in `SubmitPostOptions` when RunAs=USER for experience posts"
            );
        }
        const reconciler = new BlocksReconciler(
            () => options.preview,
            undefined,
            {},
            metadata,
            undefined
        );
        const previewBlock = await reconciler.buildBlocksUI();
        const encodedCached = Block.encode(previewBlock).finish();

        const {textFallback, ...sanitizedOptions} = options;
        const richtextFallback = textFallback ? getCustomPostRichTextFallback(textFallback) : "";

        const submitRequest: SubmitRequest = {
            kind: "custom",
            sr: options.subredditName,
            richtextJson: fromByteArray(encodedCached),
            richtextFallback,
            ...sanitizedOptions,
            runAs: runAsType,
        };

        response = await client.SubmitCustomPost(submitRequest, metadata);
    } else {
        response = await client.Submit(
            {
                kind: "kind" in options ? options.kind : "url" in options ? "link" : "self",
                sr: options.subredditName,
                richtextJson: "richtext" in options ? richtextToString(options.richtext) : undefined,
                ...options,
                runAs: runAsType,
            },
            metadata
        );
    }

    // Post Id might not be present as image/video post creation can happen asynchronously
    const isAllowedMediaType =
      "kind" in options && ["image", "video", "videogif"].includes(options.kind);
    if (isAllowedMediaType && !response.json?.data?.id) {
        if (options.kind === "image" && "imageUrls" in options) {
            throw new Error(`Image post type with ${String(options.imageUrls)} is being created asynchronously and should be updated in the subreddit soon.`);
        } else if ("videoPosterUrl" in options) {
            throw new Error(`Post of ${options.kind} type with ${options.videoPosterUrl} is being created asynchronously and should be updated in the subreddit soon.`);
        }
    }

    if (!response.json?.data?.id || response.json?.errors?.length) {
        throw new Error(`failed to submit post - either post ID is empty or request failed with errors: ${JSON.stringify(response.json?.errors)}`);
    }

    return `t3_${response.json.data.id}`;
}
