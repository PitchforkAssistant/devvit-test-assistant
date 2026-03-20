import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";
import {getExtendedDevvit} from "devvit-helpers";

import {resultForm} from "../main.js";

const form: Form = {
    fields: [
        {
            type: "string",
            name: "username",
            label: "Username",
            helpText: "This should be the username of the user whose subreddit karma you wish to fetch.",
        },
    ],
    title: "Get Subreddit Karma Form",
    acceptLabel: "Fetch",
    cancelLabel: "Cancel",
};

export type GetSubredditKarmaFormSubmitData = {
    username?: string;
}

const formHandler: FormOnSubmitEventHandler<GetSubredditKarmaFormSubmitData> = async (event: FormOnSubmitEvent<GetSubredditKarmaFormSubmitData>, context: Context) => {
    const usernameInput = event.values.username?.trim();
    if (!usernameInput) {
        context.ui.showToast({text: "ERROR: You must provide a username to fetch subreddit karma.", appearance: "neutral"});
        return;
    }

    try {
        const subKarmaResponse = await getExtendedDevvit().redditAPIPlugins.Users.GetUserKarmaForSubreddit({
            username: usernameInput,
            subredditId: context.subredditId,
        }, context.metadata);

        context.ui.showForm(resultForm, {
            fields: [
                {
                    type: "group",
                    label: `Subreddit Karma for u/${usernameInput}`,
                    fields: [
                        {
                            type: "string",
                            name: "postKarma",
                            label: "Post Karma",
                            disabled: true,
                            defaultValue: String(subKarmaResponse.fromPosts),
                        },
                        {
                            type: "string",
                            name: "commentKarma",
                            label: "Comment Karma",
                            disabled: true,
                            defaultValue: String(subKarmaResponse.fromComments),
                        },
                    ],
                },
            ],
        });
    } catch (error) {
        context.ui.showToast({text: `ERROR: Failed to fetch subreddit karma for user ${usernameInput}. ${String(error)}`, appearance: "neutral"});
        console.error(`Failed to fetch subreddit karma for user ${usernameInput}:`, error);
    }
};

export const getSubredditKarmaForm: FormKey = Devvit.createForm(form, formHandler);
