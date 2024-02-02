import {CommentCreate} from "@devvit/protos";
import {OnTriggerEvent, TriggerContext} from "@devvit/public-api";
import {isT1ID} from "@devvit/shared-types/tid.js";

export type AppCommentReply = "AppCommentReply";
export type StickyCommentReply = "StickyCommentReply";

export type SubTriggerEvaluator<TriggerEvent> = (event: OnTriggerEvent<TriggerEvent>, context: TriggerContext) => Promise<boolean> | boolean;

export async function isAppCommentReply (event: CommentCreate, context: TriggerContext): Promise<boolean> {
    if (!event.comment?.parentId || !isT1ID(event.comment.parentId)) {
        return false;
    }

    const parentComment = await context.reddit.getCommentById(event.comment.parentId);
    if (!parentComment) {
        return false;
    }

    return parentComment.authorId === context.appAccountId;
}

export async function isStickyCommentReply (event: CommentCreate, context: TriggerContext): Promise<boolean> {
    if (!event.comment?.parentId || !isT1ID(event.comment.parentId)) {
        return false;
    }

    const parentComment = await context.reddit.getCommentById(event.comment.parentId);
    if (!parentComment) {
        return false;
    }

    return parentComment.stickied;
}

export type ExtTriggerEventType = {
    AppCommentReply: CommentCreate;
    StickyCommentReply: CommentCreate;
};

export type ExtTriggerEvent = AppCommentReply | StickyCommentReply;

export const extTriggerEvaluators: Record<ExtTriggerEvent, SubTriggerEvaluator<ExtTriggerEventType[ExtTriggerEvent]>> = {
    AppCommentReply: isAppCommentReply,
    StickyCommentReply: isStickyCommentReply,
};

export type OnExtTriggerEvent<RequestType extends ExtTriggerEvent> = ExtTriggerEventType[RequestType] & {
    subType: ExtTriggerEvent;
};

export type ExtTriggerOnEventHandler<RequestType extends ExtTriggerEvent> = (event: OnExtTriggerEvent<RequestType>, context: TriggerContext) => void | Promise<void>;

export type AppCommentReplyDefinition = {
    event: AppCommentReply;
    onEvent: ExtTriggerOnEventHandler<AppCommentReply>;
};

export type StickyCommentReplyDefinition = {
    event: StickyCommentReply;
    onEvent: ExtTriggerOnEventHandler<StickyCommentReply>;
};

export type ExtTriggerDefinition = AppCommentReplyDefinition | StickyCommentReplyDefinition;
