import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {evilForm} from "../main.js";

export async function evilButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(evilForm);
}

export const evilButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Super Evil Test Button",
    onPress: evilButtonPressed,
});
