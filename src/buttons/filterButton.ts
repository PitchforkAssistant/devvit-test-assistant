import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {filterForm} from "../main.js";

export async function onPress (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(filterForm);
}

export const filterButton = Devvit.addMenuItem({
    location: ["post", "comment"],
    label: "Filter Item",
    description: "Filter this item to the modqueue.",
    forUserType: "moderator",
    onPress,
});
