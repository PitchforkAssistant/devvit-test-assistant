import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {editUserTextForm} from "../main.js";

export async function editUserTextButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(editUserTextForm);
}

export const editUserTextButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Edit User Text",
    description: "Allows you to attempt to edit the text of your own posts or comments.",
    onPress: editUserTextButtonPressed,
});
