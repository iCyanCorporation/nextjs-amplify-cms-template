import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== Data ===============================================================
The section below creates a database table with fields.
=========================================================================*/
const schema = a.schema({
  Blog: a
    .model({
      title: a.string(),
      imgUrl: a.string(),
      content: a.string(), // markdown content
      category: a.string(),
      tags: a.string().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey(), allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

/*== Auth ===============================================================
The section below creates an auth for the database table.
=========================================================================*/
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
