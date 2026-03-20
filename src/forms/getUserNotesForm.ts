import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";
import {getExtendedDevvit} from "devvit-helpers";

import {resultForm} from "../main.js";

const form: Form = {
    fields: [
        {
            type: "string",
            name: "username",
            label: "Username",
            helpText: "Username of the user to get the notes for.",
        },
    ],
    title: "Get User Notes",
    description: "Retrieve notes for a specific user.",
    acceptLabel: "Get Notes",
    cancelLabel: "Cancel",
};

export type GetUserNotesFormSubmitData = {
    username?: string;
}

const formHandler: FormOnSubmitEventHandler<GetUserNotesFormSubmitData> = async (event: FormOnSubmitEvent<GetUserNotesFormSubmitData>, context: Context) => {
    console.log("Get user notes form submitted:", event, context);
    const username = event.values.username?.trim();
    if (!username) {
        context.ui.showToast({text: "ERROR: You must provide a username.", appearance: "neutral"});
        return;
    }

    const subredditName = context.subredditName ?? await context.reddit.getCurrentSubredditName();

    const publicNotes = await context.reddit.getModNotes({user: username, subreddit: subredditName}).all();

    const protosNotes = await getExtendedDevvit().redditAPIPlugins.ModNote.GetNotes({user: username, subreddit: subredditName, limit: 100}, context.metadata);

    context.ui.showForm(resultForm, {
        fields: [
            {
                type: "paragraph",
                name: "thing",
                label: "Public Client Notes",
                defaultValue: JSON.stringify(publicNotes, null, 3),
                lineHeight: 10,
                disabled: true,
            },
            {
                type: "paragraph",
                name: "thing",
                label: "Protos Notes",
                defaultValue: JSON.stringify(protosNotes, null, 3),
                lineHeight: 10,
                disabled: true,
            },
        ],
    });
};

export const getUserNotesForm: FormKey = Devvit.createForm(form, formHandler);
