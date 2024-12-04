import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";
import {resultForm} from "../main.js";

const form: Form = {
    fields: [
        {
            type: "image",
            name: "image",
            label: "Image",
            helpText: "Select an image you wish to upload.",
            required: true,
        },
    ],
    title: "Upload Image",
    description: "Upload an image, you will be given the URL to the image once you hit submit.",
    acceptLabel: "Submit",
    cancelLabel: "Cancel",
};

export type UploadImageFormSubmitData = {
    image?: string;
}

const formHandler: FormOnSubmitEventHandler<UploadImageFormSubmitData> = async (event: FormOnSubmitEvent<UploadImageFormSubmitData>, context: Context) => {
    const image = event.values.image;
    if (!image) {
        context.ui.showToast({text: "ERROR: You must provide an image.", appearance: "neutral"});
        return;
    }

    context.ui.showForm(resultForm, {
        fields: [{
            type: "string",
            name: "result",
            label: "Image URL",
            defaultValue: image,
        }],
    });
};

export const uploadImageForm: FormKey = Devvit.createForm(form, formHandler);
