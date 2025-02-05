import {PostReport} from "@devvit/protos";
import {Devvit, TriggerContext} from "@devvit/public-api";
import {onAnyTriggerConsoleLog} from "devvit-helpers";

/**
 * The "PostReport" trigger fires every time a post is reported
 */

export async function onPostReport (event: PostReport, context: TriggerContext) {
    if (event.post?.id) {
        const post = await context.reddit.getPostById(event.post?.id);
        console.log(post);
    }
    return onAnyTriggerConsoleLog(event, context);
}

export const postReportTrigger = Devvit.addTrigger({
    event: "PostReport",
    onEvent: onPostReport,
});
