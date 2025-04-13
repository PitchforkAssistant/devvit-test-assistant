import * as protos from "@devvit/protos";
import {UserAboutResponse} from "@devvit/protos/types/devvit/plugin/redditapi/users/users_msg.js";
import {Devvit, GetSubredditUsersByTypeOptions, ListingFetchOptions} from "@devvit/public-api";

export type RedditAPIPlugins = {
    NewModmail: protos.NewModmail;
    Widgets: protos.Widgets;
    ModNote: protos.ModNote;
    LinksAndComments: protos.LinksAndComments;
    Moderation: protos.Moderation;
    GraphQL: protos.GraphQL;
    Listings: protos.Listings;
    Flair: protos.Flair;
    Wiki: protos.Wiki;
    Users: protos.Users;
    PrivateMessages: protos.PrivateMessages;
    Subreddits: protos.Subreddits;
}

export type ExtendedDevvit = typeof Devvit & {
    redditAPIPlugins: RedditAPIPlugins
    modLogPlugin: protos.Modlog
    schedulerPlugin: protos.Scheduler
    kvStorePlugin: protos.KVStore
    redisPlugin: protos.RedisAPI
    mediaPlugin: protos.MediaService
    settingsPlugin: protos.Settings
    realtimePlugin: protos.Realtime
    userActionsPlugin: protos.UserActions
};

export function getExtendedDevvit (): ExtendedDevvit {
    return Devvit as ExtendedDevvit; // The Devvit object already has the extended properties, they are simply not reflected in the public type definition.
}

export async function getRawUserData (username: string, metadata: protos.Metadata): Promise<UserAboutResponse> {
    return getExtendedDevvit().redditAPIPlugins.Users.UserAbout({username}, metadata);
}

export async function getRawListingData (postOrCommentIds: string[], metadata: protos.Metadata): Promise<protos.Listing> {
    return getExtendedDevvit().redditAPIPlugins.LinksAndComments.Info({subreddits: [], thingIds: postOrCommentIds}, metadata);
}

export async function getRawPostData (thingIds: string[], metadata: protos.Metadata): Promise<protos.Listing> {
    return getRawListingData(thingIds, metadata);
}

export async function getRawCommentData (thingIds: string[], metadata: protos.Metadata): Promise<protos.Listing> {
    return getRawListingData(thingIds, metadata);
}

export async function getRawSubredditData (subredditName: string, metadata: protos.Metadata): Promise<protos.SubredditAboutResponse> {
    return getExtendedDevvit().redditAPIPlugins.Subreddits.SubredditAbout({subreddit: subredditName}, metadata);
}

export async function setVote (id: string, dir: 1 | 0 | -1, metadata: protos.Metadata): Promise<void> {
    await getExtendedDevvit().redditAPIPlugins.LinksAndComments.Vote({id, dir}, metadata);
}

export async function getRawUserWhereData (userWhereRequest: GetSubredditUsersByTypeOptions, fetchOptions: ListingFetchOptions, metadata: protos.Metadata): Promise<protos.Listing> {
    return getExtendedDevvit().redditAPIPlugins.Subreddits.AboutWhere({
        where: userWhereRequest.type,
        subreddit: userWhereRequest.subredditName,
        user: userWhereRequest.username,
        ...fetchOptions,
    }, metadata);
}
