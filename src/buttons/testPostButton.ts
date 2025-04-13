import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {testPostForm} from "../main.js";

export async function testPostButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(testPostForm);
}

export const testPostButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Create Test Post",
    onPress: testPostButtonPressed,
});
