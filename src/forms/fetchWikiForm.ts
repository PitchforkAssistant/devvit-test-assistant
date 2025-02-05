import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";

import {resultForm} from "../main.js";
import {getWikiPath} from "../utils/wikiPath.js";

const form: Form = {
    fields: [
        {
            type: "string",
            name: "wikiPath",
            label: "Wiki Path",
            helpText: "This should be a relative path to the wiki page you wish to fetch, such as /page or /page/nestedpage. Please omit the /r/subreddit/wiki/ prefix and the rest of the URL.",
        },
    ],
    title: "Fetch Wiki Page",
    acceptLabel: "Fetch",
    cancelLabel: "Cancel",
};

export type FetchWikiFormSubmitData = {
    wikiPath?: string;
}

const formHandler: FormOnSubmitEventHandler<FetchWikiFormSubmitData> = async (event: FormOnSubmitEvent<FetchWikiFormSubmitData>, context: Context) => {
    const wikiPathInput = event.values.wikiPath?.trim();
    if (!wikiPathInput) {
        context.ui.showToast({text: "ERROR: You must provide a wiki path to fetch a wiki page.", appearance: "neutral"});
        return;
    }

    const wikiPath = getWikiPath(wikiPathInput);
    if (!wikiPath) {
        context.ui.showToast({text: `ERROR: Invalid wiki path provided. ${wikiPathInput} is not a valid wiki path. Wiki paths must be lowercase and may only contain letters, numbers, underscores, hyphens, and slashes. They must not start or end with a slash, and must not start with "wiki/".`, appearance: "neutral"});
        return;
    }

    try {
        const fetchedWikiPage = await context.reddit.getWikiPage(context.subredditName ?? "", wikiPath.path);
        context.ui.showToast({text: `Successfully fetched wiki page at ${fetchedWikiPage.name}`, appearance: "success"});
        console.log(fetchedWikiPage);
        context.ui.showForm(resultForm, {
            fields: [
                {
                    type: "paragraph",
                    name: "wikiPage",
                    label: fetchedWikiPage.name,
                    defaultValue: JSON.stringify(fetchedWikiPage, null, 4),
                    helpText: "The fetched wiki page object.",
                },
            ],
        });
    } catch (error) {
        context.ui.showToast({text: `ERROR: Failed to get wiki page at ${wikiPath.path}.`, appearance: "neutral"});
        console.error(error);
        context.ui.showForm(resultForm, {
            fields: [
                {
                    type: "paragraph",
                    name: "wikiPage",
                    label: wikiPath.path,
                    defaultValue: String(error),
                    helpText: "Error resulting from getWikiPage.",
                    disabled: true,
                },
            ],
        });
    }
};

export const fetchWikiForm: FormKey = Devvit.createForm(form, formHandler);
