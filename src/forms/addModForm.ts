import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";
import {getExtendedDevvit} from "devvit-helpers";

const form: Form = {
    fields: [
        {
            type: "string",
            name: "username",
            label: "Username",
            helpText: "Username of the user to make a moderator.",
        },
        {
            type: "string",
            name: "subreddit",
            label: "Subreddit",
            helpText: "Subreddit name of where to make the user a moderator.",
        },
    ],
    title: "Add a Moderator",
    description: "This user will be added as a moderator with no permissions.",
    acceptLabel: "Add Moderator",
    cancelLabel: "Cancel",
};

export type AddModFormSubmitData = {
    username?: string;
    subreddit?: string;
}

const formHandler: FormOnSubmitEventHandler<AddModFormSubmitData> = async (event: FormOnSubmitEvent<AddModFormSubmitData>, context: Context) => {
    console.log("Add mod form submitted:", event, context);
    const username = event.values.username?.trim();
    if (!username) {
        context.ui.showToast({text: "ERROR: You must provide a username.", appearance: "neutral"});
        return;
    }

    const subreddit = event.values.subreddit?.trim();
    if (!subreddit) {
        context.ui.showToast({text: "ERROR: This form can only be used in a subreddit context.", appearance: "neutral"});
        return;
    }

    const extendedDevvit = getExtendedDevvit();
    if (!extendedDevvit) {
        context.ui.showToast({text: "ERROR: Functionality is not available.", appearance: "neutral"});
        return;
    }

    try {
        await extendedDevvit.redditAPIPlugins.Users.Friend({
            name: username,
            type: "moderator_invite",
            subreddit,
            note: "Added by Test Devvit App",
            permissions: "",
        });
    } catch (error) {
        console.error("Error adding moderator: ", error);
        context.ui.showToast({text: `ERROR: Could not add ${username} as a moderator.`, appearance: "neutral"});
    }
};

export const addModForm: FormKey = Devvit.createForm(form, formHandler);
