import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {resultForm} from "../main.js";

export async function onPress (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(resultForm, {
        fields: [
            {
                type: "paragraph",
                name: "debug",
                label: "Debug",
                defaultValue: JSON.stringify(context.debug, null, 2) ?? "",
                helpText: "context.debug",
                lineHeight: 10,
                disabled: true,
            },
            {
                type: "paragraph",
                name: "metadata",
                label: "Metadata",
                defaultValue: JSON.stringify(context.debug.metadata, null, 2) ?? "",
                helpText: "context.debug.metadata",
                lineHeight: 10,
                disabled: true,
            },
            {
                type: "string",
                name: "metadateProps",
                label: "Metadata Prop Names",
                defaultValue: Object.getOwnPropertyNames(Object.getPrototypeOf(context.debug.metadata)).join(", "), // Just Object.keys() doesn't return class methods
                helpText: "Object.getOwnPropertyNames(Object.getPrototypeOf(context.debug.metadata))",
                lineHeight: 10,
                disabled: true,
            },
        ],
    });
}

export const checkDebugButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "View Debug Data",
    onPress,
});
