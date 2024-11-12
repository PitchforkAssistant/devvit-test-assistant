import {Devvit} from "@devvit/public-api";

// Enable any Devvit features you might need. For example purposes, we'll enable all non-privileged plugins.
Devvit.configure({
    redditAPI: true,
    redis: true,
    media: true,
    http: true,
    kvStore: true,
    realtime: true,
});

// These are exports of Devvit.add... functions contained in other files, which helps with organization.
// It's effectively the same as if you had written the code here.

// Settings
export {devvitAppSettings} from "./settings.js";

// Forms
export {createPostForm} from "./forms/createPostForm.js";
export {resultForm} from "./forms/resultForm.js";
export {createWikiForm} from "./forms/createWikiForm.js";
export {fetchWikiForm} from "./forms/fetchWikiForm.js";
export {fetchDomainForm} from "./forms/fetchDomainForm.js";
export {fetchThingForm} from "./forms/fetchThingForm.js";

// Buttons
export {modButton} from "./buttons/modButton.js";
export {loggedOutButton} from "./buttons/loggedOutButton.js";
export {customPostButton} from "./buttons/customPostButton.js";
export {generalButton} from "./buttons/generalButton.js";
export {createWikiButton} from "./buttons/createWikiButton.js";
export {fetchWikiButton} from "./buttons/fetchWikiButton.js";
export {fetchDomainButton} from "./buttons/fetchDomainButton.js";
export {fetchThingButton} from "./buttons/fetchThingButton.js";

// Custom Post
export {customPostExample} from "./customPost/index.js";

// Scheduler jobs
export {someRecurringTask} from "./scheduler/someRecurringTask.js";

// Triggers
export {appInstallTrigger} from "./triggers/appInstall.js";
export {appUpgradeTrigger} from "./triggers/appUpgrade.js";
export {commentCreateTrigger} from "./triggers/commentCreate.js";
export {commentDeleteTrigger} from "./triggers/commentDelete.js";
export {commentReportTrigger} from "./triggers/commentReport.js";
export {commentSubmitTrigger} from "./triggers/commentSubmit.js";
export {commentUpdateTrigger} from "./triggers/commentUpdate.js";
export {modActionTrigger} from "./triggers/modAction.js";
export {modMailTrigger} from "./triggers/modMail.js";
export {postCreateTrigger} from "./triggers/postCreate.js";
export {postDeleteTrigger} from "./triggers/postDelete.js";
export {postFlairUpdateTrigger} from "./triggers/postFlairUpdate.js";
export {postReportTrigger} from "./triggers/postReport.js";
export {postSubmitTrigger} from "./triggers/postSubmit.js";
export {postUpdateTrigger} from "./triggers/postUpdate.js";
export {postSpoilerUpdateTrigger} from "./triggers/postSpoilerUpdate.js";
export {postNsfwUpdateTrigger} from "./triggers/postNsfwUpdate.js";
export {automodFilterCommentTrigger} from "./triggers/automodFilterComment.js";
export {automodFilterPostTrigger} from "./triggers/automodFilterPost.js";

export default Devvit;
