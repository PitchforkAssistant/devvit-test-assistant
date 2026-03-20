import {Context, Devvit, JSONObject, MenuItemOnPressEvent} from "@devvit/public-api";

import {ResultFormData} from "../forms/resultForm.js";
import {resultForm} from "../main.js";

export async function onPress (event: MenuItemOnPressEvent, context: Context) {
    const removalReasons = await context.reddit.getSubredditRemovalReasons(context.subredditName ?? await context.reddit.getCurrentSubredditName());
    const formData: ResultFormData = {
        title: "Fetched Removal Reasons",
    };
    formData.fields = [];
    for (const removalReason of removalReasons) {
        formData.fields.push({
            type: "group",
            label: removalReason.title,
            fields: [
                {
                    type: "string",
                    name: `id${removalReason.id}`,
                    label: "Removal Reason ID",
                    defaultValue: removalReason.id,
                },
                {
                    type: "paragraph",
                    name: `removalReasonMessage${removalReason.id}`,
                    label: "Removal Reason Message",
                    lineHeight: 3,
                    defaultValue: removalReason.message,
                },
            ],
        });
    }
    context.ui.showForm(resultForm, formData as JSONObject);
}

export const removalReasonMessageButton = Devvit.addMenuItem({
    location: ["subreddit", "post", "comment"],
    label: "Get Removal Reasons",
    forUserType: "moderator",
    onPress,
});
