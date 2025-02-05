import {Devvit} from "@devvit/public-api";

import {Page} from "./pages.js";
import {CustomPostState} from "./state.js";

export const customPostExample = Devvit.addCustomPostType({
    name: "Custom Post Example",
    description: "An example of a custom post.",
    height: "tall",
    render: context => {
        const state = new CustomPostState(context);
        return (
            <blocks>
                <vstack alignment="center top" height="100%" width="100%">
                    <hstack alignment="center middle" border="thick" minWidth="100%" padding="small">
                        <button appearance="plain" disabled={state.currentPage === "home"} icon="home" onPress={() => state.changePage("home")}>Home</button>
                        <vstack alignment="center middle" grow>
                            <text style="heading">Custom Post Example</text>
                        </vstack>
                        <button appearance="plain" disabled={state.currentPage === "help"} icon="help" onPress={() => state.changePage("help")}>Help</button>
                    </hstack>
                    <vstack alignment="center middle" grow width="100%">
                        <Page state={state} />
                    </vstack>
                </vstack>
            </blocks>
        );
    },
});
