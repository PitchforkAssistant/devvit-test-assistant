import {Comment, Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler, Post, SubredditInfo, User} from "@devvit/public-api";

import {resultForm} from "../main.js";

const form: Form = {
    fields: [
        {
            type: "string",
            name: "thingId",
            label: "Thing ID",
            helpText: "This should be the ID of the thing you wish to fetch, such as a user, post, comment, or subreddit.",
        },
        {
            type: "select",
            name: "thingType",
            label: "Thing Type",
            helpText: "If your ID is not the full name of the thing (e.g. prefixed with t1_, t2_, t3_, t5_), you must specify the type of thing you are fetching.",
            defaultValue: [""],
            options: [
                {label: "", value: ""},
                {label: "Comment", value: "t1"},
                {label: "User", value: "t2"},
                {label: "Post", value: "t3"},
                {label: "Subreddit", value: "t5"},
            ],
            multiSelect: false,
        },
    ],
    title: "Fetch Wiki Page",
    acceptLabel: "Fetch",
    cancelLabel: "Cancel",
};

export type FetchThingFormSubmitData = {
    thingId?: string;
    thingType?: ["" | "t1" | "t2" | "t3" | "t5"];
}

const formHandler: FormOnSubmitEventHandler<FetchThingFormSubmitData> = async (event: FormOnSubmitEvent<FetchThingFormSubmitData>, context: Context) => {
    let thingId = event.values.thingId?.trim();
    if (!thingId) {
        context.ui.showToast({text: "ERROR: You must provide a thing ID.", appearance: "neutral"});
        return;
    }

    let thingType = event.values.thingType?.[0].trim();
    if (!thingId.startsWith("t1_") && !thingId.startsWith("t2_") && !thingId.startsWith("t3_") && !thingId.startsWith("t5_")) {
        if (!thingType) {
            context.ui.showToast({text: "ERROR: You must select the content type!", appearance: "neutral"});
            return;
        } else {
            thingId = `${thingType}_${thingId}`;
        }
    } else {
        thingType = thingId.substring(0, 2);
    }

    let result: Comment | User | Post | SubredditInfo | undefined = undefined;
    let resultString = "";
    try {
        switch (thingType) {
        case "t1":
            context.ui.showToast(`Fetching comment ${thingId}`);
            result = await context.reddit.getCommentById(thingId);
            break;
        case "t2":
            context.ui.showToast(`Fetching user ${thingId}`);
            result = await context.reddit.getUserById(thingId);
            break;
        case "t3":
            context.ui.showToast(`Fetching post ${thingId}`);
            result = await context.reddit.getPostById(thingId);
            break;
        case "t5":
            context.ui.showToast(`Fetching subreddit ${thingId}`);
            result = await context.reddit.getSubredditInfoById(thingId);
            break;
        default:
            context.ui.showToast(`ERROR: Invalid thing type ${thingType}`);
            resultString = `ERROR: Invalid thing type ${thingType} with ID ${thingId}`;
            return;
        }
    } catch (e) {
        resultString = `ERROR: ${String(e)}`;
    }
    if (!result) {
        resultString = "undefined";
    } else {
        // Deleting the toJSON method to ensure all properties are displayed, not just the ones returned by toJSON.
        Object.defineProperties(result, {toJSON: {value: undefined}});
        resultString = JSON.stringify(result, Object.keys(result), 4);
    }

    context.ui.showForm(resultForm, {
        fields: [
            {
                type: "paragraph",
                name: "thing",
                label: thingId,
                defaultValue: resultString,
                helpText: `Data returned by Devvit for ${thingId}.`,
                disabled: true,
            },
            {
                type: "paragraph",
                name: "thingKeys",
                label: "Keys",
                helpText: "These are the properties contained in the fetched object, these may include the names of functions and other non-JSON serializable data.",
                defaultValue: Object.getOwnPropertyNames(Object.getPrototypeOf(result)).join(", "), // Just Object.keys() doesn't return class methods
                disabled: true,
            },
        ],
    });
};

export const fetchThingForm: FormKey = Devvit.createForm(form, formHandler);
