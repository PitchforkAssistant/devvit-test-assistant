import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";
import {fetchThingForm} from "../main.js";

export async function fetchThingButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(fetchThingForm);
}

export const fetchThingButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Fetch Thing",
    description: "Allows you to fetch the data for a post, comment, or subreddit.",
    onPress: fetchThingButtonPressed,
});
