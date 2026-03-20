import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {getUserNotesForm} from "../main.js";

export async function getUserNotesButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(getUserNotesForm);
}

export const getUserNotesButton = Devvit.addMenuItem({
    location: "subreddit",
    forUserType: "moderator",
    label: "Get User Notes",
    onPress: getUserNotesButtonPressed,
});
