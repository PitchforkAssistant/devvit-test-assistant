import {Context, Devvit, FormField, FormFunction, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";

export type ResultFormData = {
    title?: string;
    description?: string;
    acceptLabel?: string;
    cancelLabel?: string;
    fields?: FormField[];
}

const form: FormFunction<ResultFormData> = (data: ResultFormData) => ({
    fields: data.fields ?? [],
    title: data.title ?? "Results",
    acceptLabel: data.acceptLabel ?? "Close",
    cancelLabel: data.cancelLabel ?? "Close",
    description: data.description ?? undefined,
});

const formHandler: FormOnSubmitEventHandler<object> = async (event: FormOnSubmitEvent<object>, context: Context) => {
    context.ui.showToast({text: "You closed the form with the blue button, so you get this toast!", appearance: "success"});
};

export const resultForm: FormKey = Devvit.createForm(form, formHandler);
