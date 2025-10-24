import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";

import {resultForm} from "../main.js";
import {getWikiPath} from "../utils/wikiPath.js";

const form: Form = {
    fields: [
        {
            type: "string",
            name: "wikiPath",
            label: "Wiki Path",
            helpText: "This should be a relative path to the wiki page you wish to edit, such as /page or /page/nestedpage. Please omit the /r/subreddit/wiki/ prefix and the rest of the URL.",
        },
        {
            type: "paragraph",
            name: "wikiContent",
            label: "Wiki Content",
            helpText: "The new content of the wiki page you wish to edit.",
        },
        {
            type: "paragraph",
            name: "wikiEditReason",
            label: "Edit Reason",
            helpText: "This will be used as the wiki edit reason.",
        },
    ],
    title: "Edit Wiki Page",
    acceptLabel: "Edit",
    cancelLabel: "Cancel",
};

export type EditWikiFormSubmitData = {
    wikiPath?: string;
    wikiContent?: string;
    wikiEditReason?: string;
}

const formHandler: FormOnSubmitEventHandler<EditWikiFormSubmitData> = async (event: FormOnSubmitEvent<EditWikiFormSubmitData>, context: Context) => {
    const wikiPathInput = event.values.wikiPath?.trim();
    if (!wikiPathInput) {
        context.ui.showToast({text: "ERROR: You must provide a wiki path to edit a wiki page.", appearance: "neutral"});
        return;
    }

    const wikiContent = event.values.wikiContent ?? "";

    const wikiPath = getWikiPath(wikiPathInput);
    if (!wikiPath) {
        context.ui.showToast({text: `ERROR: Invalid wiki path provided. ${wikiPathInput} is not a valid wiki path. Wiki paths must be lowercase and may only contain letters, numbers, underscores, hyphens, and slashes. They must not start or end with a slash, and must not start with "wiki/".`, appearance: "neutral"});
        return;
    }

    try {
        const newWikiPage = await context.reddit.updateWikiPage({content: wikiContent, page: wikiPath.path, subredditName: context.subredditName ?? "", reason: event.values.wikiEditReason ?? undefined});
        context.ui.showToast({text: `Successfully edited wiki page at ${newWikiPage.name}`, appearance: "success"});
        context.ui.showForm(resultForm, {
            fields: [
                {
                    type: "paragraph",
                    name: "wikiPage",
                    label: newWikiPage.name,
                    defaultValue: JSON.stringify(newWikiPage, null, 4),
                    helpText: "The edited wiki page object.",
                },
            ],
        });
    } catch (error) {
        context.ui.showToast({text: String(error), appearance: "neutral"});
        console.error(error);
        context.ui.showForm(resultForm, {
            fields: [
                {
                    type: "paragraph",
                    name: "wikiPage",
                    label: wikiPath.path,
                    defaultValue: String(error),
                    helpText: "Error resulting from editWikiPage.",
                    disabled: true,
                },
            ],
        });
    }
};

export const editWikiForm: FormKey = Devvit.createForm(form, formHandler);
