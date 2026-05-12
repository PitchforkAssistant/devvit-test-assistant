import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {aboutWhereForm} from "../main.js";

export async function onPress (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(aboutWhereForm);
}

export const aboutWhereButton = Devvit.addMenuItem({
    location: ["subreddit"],
    label: "Get the /about/where endpoint data for the subreddit",
    description: "This means mods, bans, contributors, and more.",
    onPress,
});
