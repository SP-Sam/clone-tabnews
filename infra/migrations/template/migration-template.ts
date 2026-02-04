import type { MigrationBuilder, ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(_pgm: MigrationBuilder): Promise<void> {}

export async function down(_pgm: MigrationBuilder): Promise<void> {}
