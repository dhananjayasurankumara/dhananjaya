import { relations } from "drizzle-orm/relations";
import { users, shopOrders, shopProducts, sessions, accounts } from "./schema";

export const shopOrdersRelations = relations(shopOrders, ({one}) => ({
	user: one(users, {
		fields: [shopOrders.userId],
		references: [users.id]
	}),
	shopProduct: one(shopProducts, {
		fields: [shopOrders.productId],
		references: [shopProducts.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	shopOrders: many(shopOrders),
	sessions: many(sessions),
	accounts: many(accounts),
}));

export const shopProductsRelations = relations(shopProducts, ({many}) => ({
	shopOrders: many(shopOrders),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));