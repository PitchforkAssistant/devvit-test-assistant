import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {uploadImageForm} from "../main.js";

export async function uploadImageButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(uploadImageForm);
}

export const uploadImageButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Upload Image",
    onPress: uploadImageButtonPressed,
});
