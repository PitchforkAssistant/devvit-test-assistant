
// import {AppInfoService, AppInfoServiceDefinition} from "@devvit/protos/types/devvit/gateway/app_info/v1alpha/app_info.js";
// import {SubredditMetadataResolver, SubredditMetadataResolverDefinition} from "@devvit/protos/types/devvit/gateway/resolvers.js";
import {Context, Devvit, MenuItemOnPressEvent} from "@devvit/public-api";

import {setFlairForm} from "../main.js";

export async function setFlairButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(setFlairForm, {username: context.username ?? await context.reddit.getCurrentUsername() ?? "", subredditName: context.subredditName ?? await context.reddit.getCurrentSubredditName()});
}

export const setFlairButton = Devvit.addMenuItem({
    location: "subreddit",
    label: "Set Flair (Post/User)",
    onPress: setFlairButtonPressed,
    forUserType: "moderator",
});
