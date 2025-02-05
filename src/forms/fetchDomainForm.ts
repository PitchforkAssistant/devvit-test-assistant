import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";

import {resultForm} from "../main.js";

const form: Form = {
    fields: [
        {
            type: "string",
            name: "fetchLink",
            label: "Fetch Link",
            helpText: "The app will test whether the domain is allowed by submitting a GET request to the link provided. The link must be a valid URL.",
        },
    ],
    title: "Domain Checker",
    acceptLabel: "Fetch",
    cancelLabel: "Cancel",
};

export type FetchDomainFormSubmitData = {
    fetchLink?: string;
}

const formHandler: FormOnSubmitEventHandler<FetchDomainFormSubmitData> = async (event: FormOnSubmitEvent<FetchDomainFormSubmitData>, context: Context) => {
    const fetchLink = event.values.fetchLink?.trim();
    if (!fetchLink) {
        context.ui.showToast({text: "ERROR: You must provide a link to test fetching it.", appearance: "neutral"});
        return;
    }

    try {
        const response = await fetch(fetchLink);
        context.ui.showToast({text: `${new URL(response.url).hostname} is allowed!`, appearance: "success"});
        context.ui.showForm(resultForm, {
            fields: [
                {
                    type: "paragraph",
                    name: "wikiPage",
                    label: "fetchLink",
                    defaultValue: String(await response.text()),
                    helpText: "Response from fetch.",
                    disabled: true,
                },
            ],
        });
    } catch (error) {
        if (String(error).includes("PERMISSION_DENIED: HTTP request to domain")) {
            context.ui.showToast({text: `${new URL(fetchLink).hostname} is not allowed!`, appearance: "success"});
        } else {
            context.ui.showToast({text: `${new URL(fetchLink).hostname} might be allowed.`, appearance: "neutral"});
        }
        console.error(error);
        context.ui.showForm(resultForm, {
            fields: [
                {
                    type: "paragraph",
                    name: "wikiPage",
                    label: fetchLink,
                    defaultValue: String(error),
                    helpText: "Error resulting from fetch.",
                    disabled: true,
                },
            ],
        });
    }
};

export const fetchDomainForm: FormKey = Devvit.createForm(form, formHandler);
