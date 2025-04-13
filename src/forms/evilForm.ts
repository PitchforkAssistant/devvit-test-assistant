import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";

const form: Form = {
    fields: [
        {
            type: "string",
            name: "target",
            label: "Target",
            helpText: "Target ID of the evil action.",
        },
    ],
    title: "Super Evil Form",
    description: "This is a super evil form that will do something super evil.",
    acceptLabel: "Evil",
    cancelLabel: "Cancel",
};

export type EvilFormSubmitData = {
    target?: string;
}

const formHandler: FormOnSubmitEventHandler<EvilFormSubmitData> = async (event: FormOnSubmitEvent<EvilFormSubmitData>, context: Context) => {
    console.log("Evil form submitted:", event, context);
    const target = event.values.target?.trim();
    // TODO: do evil stuff
};

export const evilForm: FormKey = Devvit.createForm(form, formHandler);
