import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {graphQlForm} from "../main.js";

export async function graphQlButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(graphQlForm);
}

export const graphQlButton = Devvit.addMenuItem({
    location: "subreddit",
    forUserType: "moderator",
    label: "GraphQL Test Button",
    onPress: graphQlButtonPressed,
});
