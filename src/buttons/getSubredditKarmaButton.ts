import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {getSubredditKarmaForm} from "../main.js";

export async function getSubredditKarmaButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(getSubredditKarmaForm);
}

export const getSubredditKarmaButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Get Subreddit Karma",
    description: "Allows you to get the karma a user has in the subreddit.",
    onPress: getSubredditKarmaButtonPressed,
});
