import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const store = pgTable('store', {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  imageURL: text(),
  address: text(),
  phone: text(),
  whatsapp: text(),
  email: text(),
  website: text(),
  facebook: text(),
  instagram: text(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const storeImageType = pgEnum('store_image_type', [
  'cover',
  'logo',
  'banner',
]);

export const storeImage = pgTable('store_image', {
  id: uuid().defaultRandom().primaryKey(),
  url: text().notNull(),
  fileKey: text().notNull(),
  type: storeImageType('type'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  storeId: uuid('store_id').references(() => store.id, {
    onDelete: 'set null',
  }),
});

export const category = pgTable('category', {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  storeId: uuid('store_id')
    .notNull()
    .references(() => store.id, { onDelete: 'cascade' }),
});

export const product = pgTable('product', {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text(),
  price: numeric({ mode: 'number', precision: 10, scale: 2 }).notNull(),
  stock: integer().notNull().default(0),
  clicks: integer().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  storeId: uuid('store_id')
    .notNull()
    .references(() => store.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => category.id, {
    onDelete: 'set null',
  }),
});

export const productDetail = pgTable('product_detail', {
  id: uuid().defaultRandom().primaryKey(),
  content: text().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  productId: uuid('product_id')
    .notNull()
    .references(() => product.id, { onDelete: 'cascade' }),
});

export const productImage = pgTable('product_image', {
  id: uuid().defaultRandom().primaryKey(),
  url: text().notNull(),
  fileKey: text().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  productId: uuid('product_id')
    .notNull()
    .references(() => product.id, { onDelete: 'no action' }),
});

// relations
export const storeRelations = relations(store, ({ many }) => ({
  categories: many(category),
  products: many(product),
  images: many(storeImage),
}));

export const categoryRelations = relations(category, ({ many, one }) => ({
  products: many(product),
  store: one(store, {
    fields: [category.storeId],
    references: [store.id],
  }),
}));

export const storeImageRelations = relations(storeImage, ({ one }) => ({
  store: one(store, {
    fields: [storeImage.storeId],
    references: [store.id],
  }),
}));

export const productRelations = relations(product, ({ many, one }) => ({
  images: many(productImage),
  details: many(productDetail),
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  store: one(store, {
    fields: [product.storeId],
    references: [store.id],
  }),
}));

export const productDetailRelations = relations(productDetail, ({ one }) => ({
  product: one(product, {
    fields: [productDetail.productId],
    references: [product.id],
  }),
}));

export const productImageRelations = relations(productImage, ({ one }) => ({
  product: one(product, {
    fields: [productImage.productId],
    references: [product.id],
  }),
}));
