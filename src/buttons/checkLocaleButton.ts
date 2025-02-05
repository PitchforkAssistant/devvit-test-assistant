import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {resultForm} from "../main.js";

export async function localeButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    console.log("context.uiEnvironment", context.uiEnvironment);
    context.ui.showForm(resultForm, {
        fields: [
            {
                type: "string",
                name: "locale",
                label: "Locale",
                defaultValue: context.uiEnvironment?.locale ?? "",
                helpText: "context.uiEnvironment.locale",
            },
            {
                type: "string",
                name: "timezone",
                label: "Timezone",
                defaultValue: context.uiEnvironment?.timezone ?? "",
                helpText: "context.uiEnvironment.timezone",
            },
        ],
    });
}

export const checkLocaleButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Check Locale",
    description: "Shows your device locale and timezone provided to the Devvit app.",
    onPress: localeButtonPressed,
});
