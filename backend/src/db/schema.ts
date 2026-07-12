import {
    pgTable,
    uuid,
    text,
    boolean,
    timestamp,
    pgEnum,
    date,
    unique,
    integer,
    uniqueIndex,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', [
    'admin',
    'dispatcher',
    'fleet_manager',
    'financial_analyst',
    'safety_officer',
]);

export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE', 'OTHER']);



export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    employeeId: text('employee_id').unique().notNull(),
    fullName: text('full_name').notNull(),
    email: text('email').unique().notNull(),
    role: roleEnum('role').notNull(),
    destination: text('destination'),

    password: text('password').notNull(),
    isFirstLogin: boolean('is_first_login').default(true).notNull(),
    isProfileComplete: boolean('is_profile_complete').default(false).notNull(),

    tokenVersion: integer('token_version').default(1).notNull(),

    dateOfBirth: text('date_of_birth'),
    phone: text('phone'),
    address: text('address'),
    gender: genderEnum('gender'),

    emergencyContactName: text('emergency_contact_name'),
    emergencyContactRelationship: text('emergency_contact_relationship'),
    emergencyContactPhone: text('emergency_contact_phone'),

    profilePhoto: text('profile_photo'),

    contractStartDate: timestamp('contract_start_date'),
    contractEndDate: timestamp('contract_end_date'),

    passwordResetRequested: boolean('password_reset_requested').default(false),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),

    passwordResetToken: text('password_reset_token'),
    passwordResetExpiry: timestamp('password_reset_expiry'),

    isDeleted: boolean('is_deleted').default(false).notNull(),
    deletedAt: timestamp('deleted_at'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Role = (typeof roleEnum.enumValues)[number];