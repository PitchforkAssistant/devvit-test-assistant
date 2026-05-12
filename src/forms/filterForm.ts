import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";
import {getExtendedDevvit} from "devvit-helpers";

const form: Form = {
    fields: [
        {
            type: "boolean",
            name: "keep",
            label: "Keep visible",
            helpText: "Check this box to keep the item  visiblein the subreddit.",
        },
        {
            type: "string",
            name: "reason",
            label: "Reason",
            helpText: "Provide the reason shown to mods when they view the item in their modqueue.",
        },
    ],
    title: "Filter Item",
    acceptLabel: "Filter",
    cancelLabel: "Cancel",
};

export type FilterItemFormSubmitData = {
    keep?: boolean;
    reason?: string;
}

const formHandler: FormOnSubmitEventHandler<FilterItemFormSubmitData> = async (event: FormOnSubmitEvent<FilterItemFormSubmitData>, context: Context) => {
    const keep = event.values.keep ?? false;
    const reason = event.values.reason?.trim() ?? "";

    const thingId = context.commentId || context.postId;
    if (!thingId) {
        context.ui.showToast("ERROR: No post or comment ID found in context.");
        return;
    }

    const EDevvit = getExtendedDevvit();
    try {
        await EDevvit.redditAPIPlugins.Moderation.Filter({
            id: thingId,
            keep,
            reason,
        }, context.metadata);
        context.ui.showToast("Item filtered successfully.");
    } catch (error) {
        context.ui.showToast(`Error filtering item: ${error instanceof Error ? error.message : String(error)}`);
        console.error("Error filtering item:", error);
        return;
    }
};

export const filterForm: FormKey = Devvit.createForm(form, formHandler);
