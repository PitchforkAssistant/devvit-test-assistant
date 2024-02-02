import {Devvit} from "@devvit/public-api";
import {DevvitExtensions} from "./extensions/extensions.js";

// Enable any Devvit features you might need.
Devvit.configure({
    redditAPI: true,
    kvStore: true,
    media: false,
    http: true,
    redis: true,
});

DevvitExtensions.addTrigger({
    event: "AppCommentReply",
    onEvent: (event, context) => {
        console.log("AppCommentReply event received");
        console.log(event);
        console.log(JSON.stringify(context));
    },
});

DevvitExtensions.addTrigger({
    event: "StickyCommentReply",
    onEvent: (event, context) => {
        console.log("StickyCommentReply event received");
        console.log(event);
        console.log(JSON.stringify(context));
    },
});

export default Devvit;
