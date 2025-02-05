import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";

import {resultForm} from "../main.js";
import {getWikiPath} from "../utils/wikiPath.js";

const form: Form = {
    fields: [
        {
            type: "string",
            name: "wikiPath",
            label: "Wiki Path",
            helpText: "This should be a relative path to the wiki page you wish to create, such as /page or /page/nestedpage. Please omit the /r/subreddit/wiki/ prefix and the rest of the URL.",
        },
        {
            type: "paragraph",
            name: "wikiContent",
            label: "Wiki Content",
            helpText: "The content of the wiki page you wish to create. You can leave this blank.",
        },
    ],
    title: "Create Wiki Page",
    acceptLabel: "Create",
    cancelLabel: "Cancel",
};

export type CreateWikiFormSubmitData = {
    wikiPath?: string;
    wikiContent?: string;
}

const formHandler: FormOnSubmitEventHandler<CreateWikiFormSubmitData> = async (event: FormOnSubmitEvent<CreateWikiFormSubmitData>, context: Context) => {
    const wikiPathInput = event.values.wikiPath?.trim();
    if (!wikiPathInput) {
        context.ui.showToast({text: "ERROR: You must provide a wiki path to create a wiki page.", appearance: "neutral"});
        return;
    }

    const wikiContent = event.values.wikiContent ?? "";

    const wikiPath = getWikiPath(wikiPathInput);
    if (!wikiPath) {
        context.ui.showToast({text: `ERROR: Invalid wiki path provided. ${wikiPathInput} is not a valid wiki path. Wiki paths must be lowercase and may only contain letters, numbers, underscores, hyphens, and slashes. They must not start or end with a slash, and must not start with "wiki/".`, appearance: "neutral"});
        return;
    }

    try {
        const newWikiPage = await context.reddit.createWikiPage({content: wikiContent, page: wikiPath.path, subredditName: context.subredditName ?? ""});
        context.ui.showToast({text: `Successfully created wiki page at ${newWikiPage.name}`, appearance: "success"});
        context.ui.showForm(resultForm, {
            fields: [
                {
                    type: "paragraph",
                    name: "wikiPage",
                    label: newWikiPage.name,
                    defaultValue: JSON.stringify(newWikiPage, null, 4),
                    helpText: "The created wiki page object.",
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
                    helpText: "Error resulting from createWikiPage.",
                    disabled: true,
                },
            ],
        });
    }
};

export const createWikiForm: FormKey = Devvit.createForm(form, formHandler);
