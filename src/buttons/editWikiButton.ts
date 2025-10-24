import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {editWikiForm} from "../main.js";

export async function editWikiButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(editWikiForm);
}

export const editWikiButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Edit Wiki Page",
    onPress: editWikiButtonPressed,
});
