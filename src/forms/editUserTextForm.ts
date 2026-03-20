import {RunAs} from "@devvit/protos";
import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";
import {isCommentId, isLinkId} from "@devvit/public-api/types/tid.js";
import {getExtendedDevvit} from "devvit-helpers";

const form: Form = {
    fields: [
        {
            type: "string",
            name: "id",
            label: "Target ID",
            helpText: "This should be the ID of the comment or text post you wish to edit.",
        },
        {
            type: "paragraph",
            name: "text",
            label: "Text",
            helpText: "The new content of the item you wish to edit.",
        },
    ],
    title: "Edit User Text Page",
    acceptLabel: "Make Edit",
    cancelLabel: "Cancel",
};

export type EditUserTextFormSubmitData = {
    id?: string;
    text?: string;
}

const formHandler: FormOnSubmitEventHandler<EditUserTextFormSubmitData> = async (event: FormOnSubmitEvent<EditUserTextFormSubmitData>, context: Context) => {
    const idInput = event.values.id?.trim();
    if (!idInput) {
        context.ui.showToast({text: "ERROR: You must provide a target ID to edit user text.", appearance: "neutral"});
        return;
    }

    const newText = event.values.text ?? "";
    if (!(typeof newText === "string")) {
        context.ui.showToast({text: "ERROR: You must provide new text to edit user text.", appearance: "neutral"});
        return;
    }

    if (isCommentId(idInput) || isLinkId(idInput)) {
        try {
            const rawCommentData = await getExtendedDevvit().redditAPIPlugins.LinksAndComments.EditUserText({runAs: RunAs.USER, text: newText, thingId: idInput}, context.metadata);
            context.ui.navigateTo(`https://sh.reddit.com/${rawCommentData.json?.data?.things?.[0].data?.permalink ?? `/r/${await context.reddit.getCurrentSubredditName()}/${idInput}`}`);
        } catch (error) {
            context.ui.showToast({text: `ERROR: Failed to edit comment with ID ${idInput}. ${String(error)}`, appearance: "neutral"});
            console.error(`Failed to edit comment with ID ${idInput}:`, error);
        }
    } else {
        context.ui.showToast({text: `ERROR: Invalid target ID provided. ${idInput} is not a valid comment or text post ID. (Did you include the t1_ or t3_ prefix?)`, appearance: "neutral"});
    }
};

export const editUserTextForm: FormKey = Devvit.createForm(form, formHandler);
