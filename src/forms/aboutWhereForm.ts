import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";

import {resultForm} from "../main.js";
import {getExtendedDevvit} from "../utils/rawData.js";
import {stringifyJSON} from "../utils/stringifyJSON.js";

/** one of "banned", "muted", "wikibanned", "contributors", "wikicontributors", or "moderators" */

const form: Form = {
    fields: [
        {
            type: "string",
            name: "username",
            label: "Username",
            helpText: "Username of the user to get the notes for.",
        },
        {
            type: "select",
            name: "where",
            label: "Where",
            helpText: "The type of notes to retrieve.",
            options: [
                {label: "Banned", value: "banned"},
                {label: "Muted", value: "muted"},
                {label: "Wiki Banned", value: "wikibanned"},
                {label: "Contributors", value: "contributors"},
                {label: "Wiki Contributors", value: "wikicontributors"},
                {label: "Moderators", value: "moderators"},
            ],
        },
    ],
    title: "Get User Notes",
    description: "Retrieve notes for a specific user.",
    acceptLabel: "Get Notes",
    cancelLabel: "Cancel",
};

export type GetAboutWhereFormSubmitData = {
    username?: string;
    where?: ["banned" | "muted" | "wikibanned" | "contributors" | "wikicontributors" | "moderators"];
}

const formHandler: FormOnSubmitEventHandler<GetAboutWhereFormSubmitData> = async (event: FormOnSubmitEvent<GetAboutWhereFormSubmitData>, context: Context) => {
    console.log("Get about where form submitted:", event, context);
    const username = event.values.username?.trim();
    const subredditName = context.subredditName ?? await context.reddit.getCurrentSubredditName();

    const protosWhere = await getExtendedDevvit().redditAPIPlugins.Subreddits.AboutWhere({user: username ?? undefined, where: event.values.where?.[0] ?? "", limit: 100, subreddit: subredditName}, context.metadata);

    Object.defineProperties(protosWhere, {toJSON: {value: undefined}});

    let publicWhere: unknown;
    switch (event.values.where?.[0]) {
    case "banned": {
        publicWhere = await context.reddit.getBannedUsers({username, limit: 100, subredditName}).get(100);
        break;
    }
    case "muted": {
        publicWhere = await context.reddit.getMutedUsers({username, limit: 100, subredditName}).get(100);
        break;
    }
    case "wikibanned": {
        publicWhere = await context.reddit.getBannedWikiContributors({username, limit: 100, subredditName}).get(100);
        break;
    }
    case "contributors": {
        publicWhere = await context.reddit.getApprovedUsers({username, limit: 100, subredditName}).get(100);
        break;
    }
    case "wikicontributors": {
        publicWhere = await context.reddit.getWikiContributors({username, limit: 100, subredditName}).get(100);
        break;
    }
    case "moderators": {
        const mods = await context.reddit.getModerators({username, limit: 100, subredditName}).get(100);
        mods.forEach(mod => {
            for (const [sub, perms] of mod.modPermissions) {
                console.log(` ${mod.username} ${sub}: ${perms.join(", ")}`);
            }
        });
        publicWhere = mods;
        break;
    }
    default:
        context.ui.showToast({text: "ERROR: You must select a valid 'where' option.", appearance: "neutral"});
        return;
    }

    Object.defineProperties(publicWhere, {toJSON: {value: undefined}});

    context.ui.showForm(resultForm, {
        fields: [
            {
                type: "paragraph",
                name: "Public",
                label: "Public Where Result",
                defaultValue: stringifyJSON(publicWhere) ?? "undefined",
                lineHeight: 10,
                disabled: true,
            },
            {
                type: "paragraph",
                name: "Protos",
                label: "Protos Where Result",
                defaultValue: stringifyJSON(protosWhere) ?? "undefined",
                lineHeight: 10,
                disabled: true,
            },
        ],
    });
};

export const aboutWhereForm: FormKey = Devvit.createForm(form, formHandler);
