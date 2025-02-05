import * as protos from "@devvit/protos";
import {UserAboutResponse} from "@devvit/protos/types/devvit/plugin/redditapi/users/users_msg.js";
import {Devvit} from "@devvit/public-api";

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
};

export function getExtendedDevvit (): ExtendedDevvit {
    return Devvit as ExtendedDevvit; // The Devvit object already has the extended properties, they are simply not reflected in the public type definition.
}

export async function getRawUserData (username: string, metadata: protos.Metadata): Promise<UserAboutResponse | undefined> {
    try {
        return getExtendedDevvit().redditAPIPlugins.Users.UserAbout({username}, metadata);
    } catch {
        return undefined;
    }
}

export async function getRawListingData (postOrCommentIds: string[], metadata: protos.Metadata): Promise<protos.Listing | undefined> {
    try {
        return getExtendedDevvit().redditAPIPlugins.LinksAndComments.Info({subreddits: [], thingIds: postOrCommentIds}, metadata);
    } catch {
        return undefined;
    }
}

export async function getRawPostData (thingIds: string[], metadata: protos.Metadata): Promise<protos.Listing | undefined> {
    return getRawListingData(thingIds, metadata);
}

export async function getRawCommentData (thingIds: string[], metadata: protos.Metadata): Promise<protos.Listing | undefined> {
    return getRawListingData(thingIds, metadata);
}

export async function getRawSubredditData (subredditName: string, metadata: protos.Metadata): Promise<protos.SubredditAboutResponse | undefined> {
    try {
        return getExtendedDevvit().redditAPIPlugins.Subreddits.SubredditAbout({subreddit: subredditName}, metadata);
    } catch {
        return undefined;
    }
}
