import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {addModForm} from "../main.js";

export async function addModButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(addModForm);
}

export const addModButton = Devvit.addMenuItem({
    location: "subreddit",
    forUserType: "moderator",
    label: "Add Moderator",
    onPress: addModButtonPressed,
});
