/* eslint-disable @typescript-eslint/no-extraneous-class */
import {Devvit} from "@devvit/public-api";
import {ExtTriggerDefinition, extTriggerEvaluators} from "./triggers.js";

export class DevvitExtensions {
    public static addTrigger (triggerDefinition: ExtTriggerDefinition): typeof Devvit {
        Devvit.addTrigger({
            event: "CommentCreate",
            onEvent: async (event, context) => {
                console.log("DevvitExtensions CommentCreate event received");
                if (await extTriggerEvaluators[triggerDefinition.event](event, context)) {
                    try {
                        await triggerDefinition.onEvent({...event, subType: triggerDefinition.event}, context);
                    } catch (e) {
                        console.error(`Error in onEvent function for trigger ${triggerDefinition.event}`);
                        throw e;
                    }
                }
            },
        });
        return Devvit;
    }
}

