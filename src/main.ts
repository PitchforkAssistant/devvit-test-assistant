import {Devvit} from "@devvit/public-api";

// Enable any Devvit features you might need. For example purposes, we'll enable all non-privileged plugins.
Devvit.configure({
    redditAPI: true,
    redis: true,
    media: true,
    http: true,
    kvStore: true,
    realtime: true,
    userActions: true,
});

// These are exports of Devvit.add... functions contained in other files, which helps with organization.
// It's effectively the same as if you had written the code here.

// Settings
export {devvitAppSettings} from "./settings.js";

// Forms
export {createPostForm} from "./forms/createPostForm.js";
export {createWikiForm} from "./forms/createWikiForm.js";
export {editWikiForm} from "./forms/editWikiForm.js";
export {evilForm} from "./forms/evilForm.js";
export {fetchDomainForm} from "./forms/fetchDomainForm.js";
export {fetchThingForm} from "./forms/fetchThingForm.js";
export {fetchWikiForm} from "./forms/fetchWikiForm.js";
export {graphQlForm} from "./forms/graphQlForm.js";
export {resultForm} from "./forms/resultForm.js";
export {testPostForm} from "./forms/testPostForm.js";
export {uploadImageForm} from "./forms/uploadImageForm.js";

// Buttons
export {checkDebugButton} from "./buttons/checkDebugButton.js";
export {checkLocaleButton} from "./buttons/checkLocaleButton.js";
export {createWikiButton} from "./buttons/createWikiButton.js";
export {customPostButton} from "./buttons/customPostButton.js";
export {editWikiButton} from "./buttons/editWikiButton.js";
export {evilButton} from "./buttons/evilButton.js";
export {fetchDomainButton} from "./buttons/fetchDomainButton.js";
export {fetchThingButton} from "./buttons/fetchThingButton.js";
export {fetchWikiButton} from "./buttons/fetchWikiButton.js";
export {generalButton} from "./buttons/generalButton.js";
export {graphQlButton} from "./buttons/graphQlButton.js";
export {loggedOutButton} from "./buttons/loggedOutButton.js";
export {modButton} from "./buttons/modButton.js";
export {testPostButton} from "./buttons/testPostButton.js";
export {uploadImageButton} from "./buttons/uploadImageButton.js";

// Custom Post
export {customPostExample} from "./customPost/index.js";

// Scheduler jobs
export {someRecurringTask} from "./scheduler/someRecurringTask.js";

// Triggers
export {appInstallTrigger} from "./triggers/appInstall.js";
export {appUpgradeTrigger} from "./triggers/appUpgrade.js";
export {automodFilterCommentTrigger} from "./triggers/automodFilterComment.js";
export {automodFilterPostTrigger} from "./triggers/automodFilterPost.js";
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
export {postNsfwUpdateTrigger} from "./triggers/postNsfwUpdate.js";
export {postReportTrigger} from "./triggers/postReport.js";
export {postSpoilerUpdateTrigger} from "./triggers/postSpoilerUpdate.js";
export {postSubmitTrigger} from "./triggers/postSubmit.js";
export {postUpdateTrigger} from "./triggers/postUpdate.js";

export default Devvit;
