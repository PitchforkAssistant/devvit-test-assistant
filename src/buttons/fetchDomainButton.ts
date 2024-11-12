import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";
import {fetchDomainForm} from "../main.js";

export async function fetchDomainButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(fetchDomainForm);
}

export const fetchDomainButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Check Domain Allowlist",
    onPress: fetchDomainButtonPressed,
});
