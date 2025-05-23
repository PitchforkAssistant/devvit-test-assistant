import {CommonSubmitPostOptions, Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler, SubmitPostOptions} from "@devvit/public-api";
import {isLinkId} from "@devvit/shared-types/tid.js";

import {rawSubmit, RawSubmitPostOptions} from "../utils/rawSubmit.js";

export type PostType = "text" | "richtext" | "link" | "media" | "crosspost";
export type MediaPostKind = "image" | "video" | "videogif";

const form: Form = {
    fields: [
        {
            type: "select",
            name: "type",
            label: "Type",
            helpText: "This is the type of post that will be created.",
            options: [
                {label: "Text", value: "text"},
                {label: "Rich Text", value: "richtext"},
                {label: "Link", value: "link"},
                {label: "Media", value: "media"},
                {label: "Crosspost", value: "crosspost"},
            ],
            defaultValue: ["text"],
        },
        {
            type: "select",
            name: "runAs",
            label: "Run As",
            helpText: "The post will be submitted with the selected run context.",
            options: [
                {label: "App", value: "APP"},
                {label: "User", value: "USER"},
            ],
            defaultValue: ["APP"],
        },
        {
            type: "group",
            label: "General Post Options",
            helpText: "These options apply to all post types.",
            fields: [
                {
                    type: "string",
                    name: "title",
                    label: "Title",
                    helpText: "The title of the post.",
                    defaultValue: "test post, please ignore",
                    required: true,
                },
                {
                    type: "boolean",
                    name: "sendreplies",
                    label: "Send Replies",
                    helpText: "Whether to send replies to the post.",
                    defaultValue: true,
                },
                {
                    type: "boolean",
                    name: "nsfw",
                    label: "NSFW",
                    helpText: "Whether the post is NSFW.",
                    defaultValue: false,
                },
                {
                    type: "boolean",
                    name: "spoiler",
                    label: "Spoiler",
                    helpText: "Whether the post is a spoiler.",
                    defaultValue: false,
                },
                {
                    type: "string",
                    name: "flairId",
                    label: "Flair ID",
                    helpText: "The ID of the flair to use.",
                },
                {
                    type: "string",
                    name: "flairText",
                    label: "Flair Text",
                    helpText: "The text of the flair to use.",
                },
            ],
        },
        {
            type: "group",
            label: "Text Post Options",
            helpText: "These options only apply to text and rich text posts.",
            fields: [
                {
                    type: "paragraph",
                    name: "text",
                    label: "Text",
                    helpText: "The text of the post. If you chose rich text, this should be a JSON string.",
                },
            ],
        },
        {
            type: "group",
            label: "Link Post Options",
            helpText: "These options only apply to link posts.",
            fields: [
                {
                    type: "string",
                    name: "url",
                    label: "URL",
                    helpText: "The URL of the post.",
                },
            ],
        },
        {
            type: "group",
            label: "Media Post Options",
            helpText: "These options only apply to media posts.",
            fields: [
                {
                    type: "select",
                    name: "kind",
                    label: "Kind",
                    helpText: "The kind of media post.",
                    options: [
                        {label: "Image", value: "image"},
                        {label: "Video", value: "video"},
                        {label: "Video GIF", value: "videogif"},
                    ],
                    defaultValue: ["image"],
                },
                {
                    type: "string",
                    name: "videoPosterUrl",
                    label: "Video Poster URL",
                    helpText: "The URL of the video poster.",
                },
                {
                    type: "string",
                    name: "imageUrls",
                    label: "Image URLs",
                    helpText: "The URLs of the images, separated by commas.",
                },
            ],
        },
        {
            type: "group",
            label: "Crosspost Option",
            helpText: "This option only applies to crossposts.",
            fields: [
                {
                    type: "string",
                    name: "crosspostFullname",
                    label: "Crosspost ID",
                    helpText: "The full ID of the post to crosspost (e.g. t3_123456).",
                },
                {
                    type: "string",
                    name: "crosspostTarget",
                    label: "Subreddit Name",
                    helpText: "This is where you want to crosspost to go to, do not include the r/ prefix.",
                },
            ],
        },
    ],
    title: "Create Test Post Form",
    description: "This is a form for creating a test post.",
    acceptLabel: "Submit",
    cancelLabel: "Cancel",
};

export type TestPostFormSubmitData = {
    type?: [PostType];
    runAs?: ["APP" | "USER"];

    // General Post Options
    title?: string;
    sendreplies?: boolean;
    nsfw?: boolean;
    spoiler?: boolean;
    flairId?: string;
    flairText?: string;

    // Text Post Options
    text?: string;
    richText?: string;

    // Link Post Options
    url?: string;

    // Media Post Options
    kind?: [MediaPostKind];
    videoPosterUrl?: string;
    imageUrls?: string;

    // Crosspost Option
    crosspostFullname?: string;
    crosspostTarget?: string;
}

export async function postWithToast (context: Context, postOptions: RawSubmitPostOptions) {
    try {
        const postId = await rawSubmit(postOptions, context.debug.metadata);
        context.ui.navigateTo(`https://reddit.com/r/${postOptions.subredditName}/comments/${postId.substring(3)}`);
        return;
    } catch (error) {
        console.error("Error submitting post:", error);
        context.ui.showToast({text: `ERROR: Failed to create post: ${error instanceof Error ? `${error.name}\n\n${error.message}\n\n${error.stack}` : String(error)}`, appearance: "neutral"});
    }
}

const formHandler: FormOnSubmitEventHandler<TestPostFormSubmitData> = async (event: FormOnSubmitEvent<TestPostFormSubmitData>, context: Context) => {
    const subredditName = context.subredditName ?? "";
    if (!subredditName) {
        context.ui.showToast({text: "ERROR: Subreddit name missing from submit context.", appearance: "neutral"});
        return;
    }

    const postType = event.values.type?.[0];
    if (!postType) {
        context.ui.showToast({text: "ERROR: You must provide a post type.", appearance: "neutral"});
        return;
    }

    const title = event.values.title?.trim();
    if (!title) {
        context.ui.showToast({text: "ERROR: You must provide a title.", appearance: "neutral"});
        return;
    }

    const commonPostData: CommonSubmitPostOptions & {subredditName: string} = {
        title,
        subredditName,
        sendreplies: event.values.sendreplies,
        nsfw: event.values.nsfw,
        spoiler: event.values.spoiler,
        flairId: event.values.flairId,
        flairText: event.values.flairText,
        runAs: event.values.runAs?.[0],
    };

    if (postType === "text") {
        await postWithToast(context, {
            text: event.values.text ?? "",
            ...commonPostData,
        });
    }

    if (postType === "richtext") {
        try {
            const richtext = JSON.parse(event.values.text ?? "") as object;
            await postWithToast(context, {
                richtext,
                ...commonPostData,
            });
        } catch (e) {
            context.ui.showToast({text: `ERROR: Failed to create richtext post: ${String(e)}`, appearance: "neutral"});
            return;
        }
    }

    if (postType === "link") {
        const url = event.values.url?.trim();
        if (!url) {
            context.ui.showToast({text: "ERROR: You must provide a URL.", appearance: "neutral"});
            return;
        }

        await postWithToast(context, {
            url,
            ...commonPostData,
        });
    }

    if (postType === "media") {
        const kind = event.values.kind?.[0];
        if (!kind) {
            context.ui.showToast({text: "ERROR: You must provide a media kind.", appearance: "neutral"});
            return;
        }

        const imageUrls: string[] = (event.values.imageUrls ?? "").trim().split(",");
        const videoPosterUrl = kind !== "image" ? event.values.videoPosterUrl?.trim() : undefined;
        await postWithToast(context, {
            kind,
            imageUrls,
            videoPosterUrl,
            ...commonPostData,
        } as SubmitPostOptions);
    }

    if (postType === "crosspost") {
        const crosspostFullname = event.values.crosspostFullname?.trim();
        if (!crosspostFullname || !isLinkId(crosspostFullname)) {
            context.ui.showToast({text: "ERROR: You must provide a crosspost ID, remeber to include the t3_ prefix!", appearance: "neutral"});
            return;
        }

        await postWithToast(context, {
            ...commonPostData,
            kind: "crosspost",
            text: "",
            crosspostFullname,
            subredditName: event.values.crosspostTarget?.trim() ?? subredditName,
        });
    }
};

export const testPostForm: FormKey = Devvit.createForm(form, formHandler);
