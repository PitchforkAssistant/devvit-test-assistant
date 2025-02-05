import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {createWikiForm} from "../main.js";

export async function createWikiButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(createWikiForm);
}

export const createWikiButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Create Wiki Page",
    onPress: createWikiButtonPressed,
});
