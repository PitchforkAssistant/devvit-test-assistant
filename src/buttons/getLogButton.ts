import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {resultForm} from "../main.js";
import {getExtendedDevvit} from "../utils/rawData.js";
import {stringifyJSON} from "../utils/stringifyJSON.js";

export async function onPress (event: MenuItemOnPressEvent, context: Context) {
    const subredditName = context.subredditName ?? await context.reddit.getCurrentSubredditName();

    const publicLog = await context.reddit.getModerationLog({subredditName, limit: 100}).get(100);

    const protosLog = await getExtendedDevvit().redditAPIPlugins.Moderation.AboutLog({subreddit: subredditName, limit: 100}, context.metadata);

    Object.defineProperties(publicLog, {toJSON: {value: undefined}});
    Object.defineProperties(protosLog, {toJSON: {value: undefined}});

    context.ui.showForm(resultForm, {
        fields: [
            {
                type: "paragraph",
                name: "Public",
                label: "Public Mod Log Result",
                defaultValue: stringifyJSON(publicLog) ?? "undefined",
                lineHeight: 10,
                disabled: true,
            },
            {
                type: "paragraph",
                name: "Protos",
                label: "Protos Mod Log Result",
                defaultValue: stringifyJSON(protosLog) ?? "undefined",
                lineHeight: 10,
                disabled: true,
            },
        ],
    });
}

export const getLogButton = Devvit.addMenuItem({
    location: ["subreddit"],
    label: "Get Mod Log",
    description: "Both the public API result and the protos result for comparison.",
    onPress,
});
