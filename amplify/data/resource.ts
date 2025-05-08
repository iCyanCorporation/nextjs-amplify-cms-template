import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { sendEmail } from "../functions/send-mail/resource.js";

/*== Data ===============================================================
The section below creates a database table with fields.
=========================================================================*/
const schema = a
  .schema({
    // Blog
    Blog: a.model({
      title: a.string(),
      imgUrl: a.string(),
      content: a.string(), // markdown content
      category: a.string(),
      tags: a.string().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),

    // Shop
    ProductType: a.model({
      name: a.string().required(),
      description: a.string(),
      products: a.hasMany("Product", "productTypeId"),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),

    Product: a.model({
      name: a.string().required(),
      description: a.string(),
      sku: a.string(), // Stock keeping unit
      thumbnailImageUrl: a.string(),
      isActive: a.boolean().default(true),
      primaryAttributeId: a.id(),
      productTypeId: a.id(),
      productType: a.belongsTo("ProductType", "productTypeId"),
      variants: a.hasMany("ProductVariant", "productId"),
      orderProducts: a.hasMany("OrderProduct", "productId"),
      tags: a.string().array(), // Store tags for search
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),

    Attribute: a.model({
      name: a.string().required(),
      type: a.enum(["text", "color"]),
      options: a.json(), // Store options for select attributes
    }),

    ProductVariant: a.model({
      productId: a.id(),
      product: a.belongsTo("Product", "productId"),
      name: a.string(), // Variant name
      price: a.float(), // Variant-specific price
      discountPrice: a.float(), // Add discount price
      stock: a.integer(), // Variant-specific stock
      attributes: a.string(), // JSON stringified variant attributes
      images: a.string().array(),
      isActive: a.boolean().default(true),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),

    Order: a.model({
      orderNumber: a.string().required(),
      customerName: a.string().required(),
      customerEmail: a.string().required(),
      status: a.enum([
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ]),
      totalAmount: a.float().required(),
      shippingAddress: a.string(),
      paymentInfo: a.string(),
      orderProducts: a.hasMany("OrderProduct", "orderId"),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),

    OrderProduct: a.model({
      orderId: a.id(),
      order: a.belongsTo("Order", "orderId"),
      productId: a.id(),
      product: a.belongsTo("Product", "productId"),
      quantity: a.integer().required(),
      priceAtPurchase: a.float().required(),
    }),

    // User settings
    Settings: a.model({
      key: a.string(),
      value: a.string(),
      description: a.string(),
      group: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }),

    // functions
    sendEmail: a
      .query()
      .arguments({
        name: a.string(),
        myEmail: a.string(), // sender email address
        emailAddresses: a.string().array(), // recipient email addresses
        subject: a.string(), // email subject
        bodyText: a.string(), // email body
      })
      .returns(a.string())
      .authorization((allow) => [allow.guest()]) // independent authorization
      .handler(a.handler.function(sendEmail)),
  })
  .authorization((allow) => [
    // allow.publicApiKey().to(["read"]),
    allow.guest().to(["read"]),
    allow.owner(),
    allow.authenticated("identityPool").to(["read"]),
    allow.authenticated(),
  ]);

export type Schema = ClientSchema<typeof schema>;

/*== Auth ===============================================================
The section below creates an auth for the database table.
=========================================================================*/
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool", // apiKey iam userPool
    // apiKeyAuthorizationMode: {
    //   expiresInDays: 365,
    // },
  },
});
