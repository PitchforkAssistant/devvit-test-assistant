import {Devvit} from "@devvit/public-api";

import {CustomPostState} from "../state.js";

export const ButtonsPage = (state: CustomPostState) => {
    async function clickCounter () {
        const success = await state.incrementCounter();
        if (!success) {
            state.context.ui.showToast("Failed to increment counter!");
        }
    }

    return (

        <vstack alignment="center middle" gap="large" grow>
            <hstack padding="medium">
                <text size="xxlarge" style="heading">
                    Hello, {state.username ?? "stranger"}!
                </text>
                <avatar facing="left" size="large" thingId={state.userId ?? "t2_1qwk"}/>
            </hstack>

            <vstack gap="medium">
                <text size="large" style="body">{`Click counter: ${state.counter}`}</text>
                <vstack border="thin" cornerRadius="medium" gap="medium" grow padding="medium">
                    <hstack alignment="center middle" gap="medium">
                        <button appearance="primary" grow onPress={clickCounter}>
                            Button
                        </button>
                        <button appearance="secondary" grow onPress={clickCounter}>
                            Button
                        </button>
                    </hstack>

                    <hstack alignment="center middle" gap="medium">
                        <button appearance="bordered" grow onPress={clickCounter}>
                            Button
                        </button>
                        <button appearance="plain" grow onPress={clickCounter}>
                            Button
                        </button>
                    </hstack>

                    <hstack alignment="center middle" gap="medium">
                        <button appearance="media" grow onPress={clickCounter}>
                            Button
                        </button>
                        <button appearance="caution" grow onPress={clickCounter}>
                            Button
                        </button>
                    </hstack>

                    <hstack alignment="center middle" gap="medium">
                        <button appearance="success" grow onPress={clickCounter}>
                            Button
                        </button>
                        <button appearance="destructive" grow onPress={clickCounter}>
                            Button
                        </button>
                    </hstack>
                </vstack>
                <text alignment="center middle" size="small" style="metadata">
                Click a button, you know you want to do it!
                </text>
            </vstack>
        </vstack>
    );
};
