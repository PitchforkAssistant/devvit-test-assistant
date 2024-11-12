import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";
import {fetchWikiForm} from "../main.js";

export async function fetchWikiButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(fetchWikiForm);
}

export const fetchWikiButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Fetch Wiki Page",
    onPress: fetchWikiButtonPressed,
});
