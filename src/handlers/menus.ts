import {MenuItemOnPressEvent, MenuItemUserType, FormOnSubmitEvent} from "@devvit/public-api";
import {Context} from "@devvit/public-api";
import {customPostPreview} from "../components/customPostType.js";
import {submitPostFormKey, fetchDataFormKey, testFormKey} from "../main.js";
import {DEFAULTS, ERRORS} from "../constants.js";
import {isT1ID, isT2ID, isT3ID, isT5ID} from "@devvit/shared-types/tid.js";

export async function testButtonPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(testFormKey);
}

export async function testFormSubmit (event: FormOnSubmitEvent, context: Context) {
    const targetUsername = String(event.values.targetName);
    const targetSub = String(event.values.targetSub);
    if (!targetUsername || !targetSub) {
        console.error("Invalid targets provided");
        context.ui.showToast("Invalid targets provided");
        return;
    }

    const user = await context.reddit.getUserByUsername(targetUsername);
    const perms = await user.getModPermissionsForSubreddit(targetSub);
    console.log(`Fetched perms for ${targetUsername}: ${JSON.stringify(perms)}`);
    context.ui.showToast(`Fetched perms for ${targetUsername}: ${JSON.stringify(perms)}`);
}

export async function formActionPressed (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(submitPostFormKey);
}

export async function lookupButton (event: MenuItemOnPressEvent, context: Context) {
    context.ui.showForm(fetchDataFormKey);
}

export async function lookupOnSubmit (event: FormOnSubmitEvent, context: Context) {
    const message = `You submitted the form with values ${JSON.stringify(event.values)}`;
    console.log(message);
    context.ui.showToast(message);

    if (!event.values.targetId) {
        console.error("No target ID provided");
        context.ui.showToast("No target ID provided");
        return;
    }

    try {
        const targetId = String(event.values.targetId);
        if (isT1ID(targetId)) {
            const comment = await context.reddit.getCommentById(targetId);
            console.log(`Fetched comment: ${JSON.stringify(comment)}`);
            context.ui.showToast(`Fetched comment: ${JSON.stringify(comment)}`);
        } else if (isT2ID(targetId)) {
            const user = await context.reddit.getUserById(targetId);
            console.log(`Fetched user: ${JSON.stringify(user)}`);
            context.ui.showToast(`Fetched user: ${JSON.stringify(user)}`);
        } else if (isT3ID(targetId)) {
            const post = await context.reddit.getPostById(targetId);
            console.log(`Fetched post: ${JSON.stringify(post)}`);
            context.ui.showToast(`Fetched post: ${JSON.stringify(post)}`);
        } else if (isT5ID(targetId)) {
            const subreddit = await context.reddit.getSubredditById(targetId);
            console.log(`Fetched subreddit: ${JSON.stringify(subreddit)}`);
            context.ui.showToast(`Fetched subreddit: ${JSON.stringify(subreddit)}`);
        } else {
            context.ui.showToast("Invalid target ID, did you include the prefix?");
        }
    } catch (e) {
        console.error("Error attempting to fetch target", e);
        context.ui.showToast("Failed to fetch target");
    }
}

export async function formOnSubmit (event: FormOnSubmitEvent, context: Context) {
    const message = `You submitted the form with values ${JSON.stringify(event.values)}`;
    console.log(message);
    context.ui.showToast(message);

    // The logic for creating a custom post.
    const subredditName = (await context.reddit.getCurrentSubreddit()).name;

    let title = DEFAULTS.CUSTOM_POST_TITLE;
    if (event.values.title) {
        title = String(event.values.title);
    }

    try {
        await context.reddit.submitPost({
            title,
            subredditName,
            preview: customPostPreview,
        });
        context.ui.showToast({
            text: "Custom post created!",
            appearance: "success",
        });
    } catch (e) {
        console.error("Error attempting to create custom post", e);
        context.ui.showToast(ERRORS.CUSTOM_POST_FAILED);
    }
}

// MenuItemOnPressEvent doesn't have a userType property, so we have to pass it in separately based on the menu item.
export async function menuActionPressed (event: MenuItemOnPressEvent, context: Context) {
    return menuItemPressed(event, context);
}
export async function menuModActionPressed (event: MenuItemOnPressEvent, context: Context) {
    return menuItemPressed(event, context, "moderator");
}
export async function menuLoggedOutPressed (event: MenuItemOnPressEvent, context: Context) {
    return menuItemPressed(event, context, "loggedOut");
}
export async function menuMemberPressed (event: MenuItemOnPressEvent, context: Context) {
    return menuItemPressed(event, context, "member");
}
export async function menuItemPressed (event: MenuItemOnPressEvent, context: Context, userType?: MenuItemUserType) {
    const message = `You pressed a ${event.location} button! (userType: ${userType ?? ""}, targetId: ${event.targetId})\nevent:\n${JSON.stringify(event)}\ncontext:\n${JSON.stringify(context)}`;
    console.log(message);
    context.ui.showToast(message);
}
