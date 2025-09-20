import {Context, Devvit, Form, FormKey, FormOnSubmitEvent, FormOnSubmitEventHandler} from "@devvit/public-api";
import {getExtendedDevvit} from "devvit-helpers";

import {resultForm} from "../main.js";

const form: Form = {
    fields: [
        {
            type: "string",
            name: "operation",
            label: "Operation",
            helpText: "If you're mimicking a query you saw in the network tab, this is the operation value in the request JSON body.",
            required: true,
        },
        {
            type: "paragraph",
            name: "variables",
            label: "Variables",
            helpText: "This should be a JSON string with the variables property of your GraphQL request.",
            required: true,
            lineHeight: 3,
        },
        {
            type: "string",
            name: "persistedQueryHash",
            label: "Persisted Query Hash",
            helpText: "This allows you to use a GraphQL persisted query.",
            required: false,
        },
    ],
    title: "GraphQL Test Form",
    description: "Oh boy, here I go poking around where I probably shouldn't again.",
    acceptLabel: "Send Query",
    cancelLabel: "Cancel",
};

export type GraphQlFormSubmitData = {
    operation?: string;
    variables?: string;
    persistedQueryHash?: string;
}

const formHandler: FormOnSubmitEventHandler<GraphQlFormSubmitData> = async (event: FormOnSubmitEvent<GraphQlFormSubmitData>, context: Context) => {
    const operation = event.values.operation?.trim();
    const variablesString = event.values.variables?.trim();
    const persistedQueryHash = event.values.persistedQueryHash?.trim();

    if (!operation) {
        context.ui.showToast({text: "ERROR: You must provide an operation.", appearance: "neutral"});
        return;
    }
    if (!variablesString) {
        context.ui.showToast({text: "ERROR: You must provide variables.", appearance: "neutral"});
        return;
    }

    let variables;
    try {
        variables = JSON.parse(variablesString) as unknown;
        if (typeof variables !== "object" || variables === null) {
            throw new Error("Variables is not an object!");
        }
    } catch (e) {
        context.ui.showToast({text: "ERROR: Variables must be valid JSON.", appearance: "neutral"});
        console.error("Error parsing variables JSON:", e);
        return;
    }

    const ExtendedDevvit = getExtendedDevvit();
    const gql = ExtendedDevvit.redditAPIPlugins.GraphQL;

    if (!gql) {
        context.ui.showToast({text: "ERROR: GraphQL plugin not available.", appearance: "neutral"});
        console.error("GraphQL plugin not available on Devvit.redditAPIPlugins.GraphQL");
        return;
    }

    try {
        let response;
        if (persistedQueryHash) {
            response = await gql.PersistedQuery({
                operationName: operation,
                variables,
                id: persistedQueryHash,
            }, context.metadata);
        } else {
            response = await gql.Query({
                query: operation,
                variables,
            }, context.metadata);
        }

        console.log("GraphQL response:", JSON.stringify(response, null, 2));
        context.ui.showForm(resultForm, {
            title: "GraphQL Query Result",
            description: "This is the result of your GraphQL query.",
            fields: [
                {
                    type: "paragraph",
                    name: "data",
                    label: "Data",
                    defaultValue: JSON.stringify(response.data, null, 2),
                    lineHeight: 6,
                },
                {
                    type: "paragraph",
                    name: "full",
                    label: "Full Response",
                    defaultValue: JSON.stringify(response, null, 2),
                    lineHeight: 3,
                },
            ],
        });
        return;
    } catch (e) {
        context.ui.showForm(resultForm, {
            title: "GraphQL Query Error",
            description: "An error occurred while executing the GraphQL query.",
            fields: [
                {
                    type: "paragraph",
                    name: "error",
                    label: "Error",
                    defaultValue: String(e),
                    lineHeight: 6,
                },
            ],
        });
        console.error("Error executing GraphQL query:", e);
        return;
    }
};

export const graphQlForm: FormKey = Devvit.createForm(form, formHandler);
