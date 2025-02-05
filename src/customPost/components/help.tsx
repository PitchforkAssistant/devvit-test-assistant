import {Devvit} from "@devvit/public-api";

import {CustomPostState} from "../state.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const HelpPage = (state: CustomPostState) => (
    <vstack alignment="top center" gap="small" grow padding="small">
        <vstack alignment="center middle" gap="none">
            <text alignment="center" style="heading" wrap>What is this?</text>
            <text alignment="center" style="body" wrap>
                This is an example of a custom post included with devvit-template.
            </text>
        </vstack>
    </vstack>
);

