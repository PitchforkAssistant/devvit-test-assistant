import {ModMail} from "@devvit/protos";
import {Devvit, OnTriggerEvent, TriggerContext} from "@devvit/public-api";

// Enable any Devvit features you might need.
Devvit.configure({
    redditAPI: true,
});

Devvit.addTrigger({
    event: "ModMail",
    onEvent: async (event: OnTriggerEvent<ModMail>, context: TriggerContext) => {
        console.log("ModMail event triggered!");
        console.log(`Conversation type: ${event.conversationType}`);
        console.log(event);

        console.log("Getting conversation...");
        const modmailConvo = await context.reddit.modMail.getConversation({conversationId: event.conversationId, markRead: false});
        console.log(modmailConvo);
    },
});
export default Devvit;
