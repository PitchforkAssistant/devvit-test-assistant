
import {Context, Devvit, FormFunction, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";

import {resultForm} from "../main.js";
import {getExtendedDevvit} from "../utils/rawData.js";

export type FlairFormData = {
    username?: string;
    subredditName?: string;
}

const form: FormFunction = (data: FlairFormData) => ({
    fields: [
        {
            type: "string",
            name: "subreddit",
            label: "Target Subreddit",
            helpText: "This is the subreddit where the flair will be set, again an unprefixed name.",
            defaultValue: data.subredditName ?? "",
        },
        {
            type: "string",
            name: "username",
            label: "Target Username",
            helpText: "This should be the unprefixed username of the user who you wish to give a flair to.",
        },
        {
            type: "string",
            name: "targetId",
            label: "This is the full prefixed T3ID of the Post that should receive the flair (e.g. t3_abcdef).",
            helpText: "t3id",
        },
        {
            type: "group",
            label: "Flair Data",
            fields: [
                {
                    type: "string",
                    name: "text",
                    label: "Flair Text",
                },
                {
                    type: "string",
                    name: "cssClass",
                    label: "Flair CSS Class",
                },
                {
                    type: "string",
                    name: "templateId",
                    label: "Flair Template ID",
                },
                {
                    type: "string",
                    name: "textColor",
                    label: "Text Color",
                    helpText: "dark/light",
                },
                {
                    type: "string",
                    name: "backgroundColor",
                    label: "Background Color",
                    helpText: "#ABCDEF or transparent",
                },
                {
                    type: "select",
                    name: "returnRtjson",
                    label: "returnRtjson value",
                    options: [
                        {label: "only", value: "only"},
                        {label: "all", value: "all"},
                        {label: "none", value: "none"},
                    ],
                    defaultValue: ["all"],
                },
                {
                    type: "boolean",
                    name: "fancyFlairOption",
                    label: "Use Fancy Flair Function?",
                    helpText: "Fancy means /select, non-fancy means /flair",
                    defaultValue: true,
                },
            ],
        },
    ],
    title: "Set Flair Form",
    description: "This form allows you to call the Devvit flairing functions at a low level. Fill out the fields as needed. Keep in mind that some fields are optional depending on your use case and some are mutually exclusive (e.g. Post ID vs Username).",
    acceptLabel: "Set Flair",
    cancelLabel: "Cancel",
});

export type SetFlairFormSubmitData = {
    username?: string;
    subreddit?: string;
    targetId?: string;
    text?: string;
    cssClass?: string;
    templateId?: string;
    textColor?: string;
    backgroundColor?: string;
    richtext?: string;
    returnRtjson?: ["only" | "all" | "none"];
    fancyFlairOption?: boolean;
}

const formHandler: FormOnSubmitEventHandler<SetFlairFormSubmitData> = async (event: FormOnSubmitEvent<SetFlairFormSubmitData>, context: Context) => {
    const data = event.values;

    let result;
    const eDevvit = getExtendedDevvit();
    try {
        if (data.fancyFlairOption) {
            result = await eDevvit.redditAPIPlugins.Flair.SelectFlair({
                subreddit: data.subreddit ?? "",
                name: data.username ?? "",
                link: data.targetId ?? "",
                text: data.text ?? "",
                cssClass: data.cssClass ?? "",
                flairTemplateId: data.templateId ?? "",
                textColor: data.textColor ?? "",
                backgroundColor: data.backgroundColor ?? "",
                returnRtjson: data.returnRtjson ? data.returnRtjson[0] : "all",
            }, context.metadata);
        } else {
            result = await eDevvit.redditAPIPlugins.Flair.Flair({
                subreddit: data.subreddit ?? "",
                name: data.username ?? "",
                link: data.targetId ?? "",
                text: data.text ?? "",
                cssClass: data.cssClass ?? "",
            }, context.metadata);
        }
    } catch (error) {
        result = String(error);
    }

    context.ui.showForm(resultForm, {
        title: "JSONStatus Result",
        description: "This is the result of your flair operation.",
        fields: [
            {
                type: "paragraph",
                name: "jsonStatusLabel",
                label: "JSONStatus",
                defaultValue: JSON.stringify(result, null, 2),
                lineHeight: 6,
            },
        ],
    });
};

export const setFlairForm: FormKey = Devvit.createForm(form, formHandler);
