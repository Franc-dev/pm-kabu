import { pgTable, text, timestamp, boolean, integer, uuid, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums as tuples for Drizzle
export const UserRoles = ['admin', 'faculty', 'student'] as const;
export type UserRole = typeof UserRoles[number];

export const ProjectStatuses = ['planned', 'in_progress', 'completed', 'on_hold'] as const;
export type ProjectStatus = typeof ProjectStatuses[number];

export const DocumentStatuses = ['draft', 'submitted', 'verified', 'rejected'] as const;
export type DocumentStatus = typeof DocumentStatuses[number];

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: UserRoles }).notNull(),
  hashedPassword: text('hashed_password').notNull(),
  department: text('department'),
  isVerified: boolean('is_verified').default(false),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true),
  resetToken: text('reset_token'),
  resetTokenExpiry: timestamp('reset_token_expiry'),
  lastLoginAt: timestamp('last_login_at'),
  verificationToken: text('verification_token'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  preferences: jsonb('preferences'),
});

// Teams Table
export const teams = pgTable("teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  leaderId: uuid("leader_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
// Projects Table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status", { enum: ProjectStatuses }).notNull(),
  teamId: uuid("team_id").references(() => teams.id),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: jsonb("metadata"),
})

// Tasks Table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  projectId: uuid('project_id').references(() => projects.id),
  assigneeId: uuid('assignee_id').references(() => users.id),
  status: text('status', { enum: ProjectStatuses }).notNull(),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).notNull(),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Documents Table
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull(),
  size: integer('size').notNull(),
  uploaderId: uuid('uploader_id').references(() => users.id),
  projectId: uuid('project_id').references(() => projects.id),
  status: text('status', { enum: DocumentStatuses }).notNull(),
  verifierId: uuid('verifier_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: jsonb('metadata'),
});

// Comments Table
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  userId: uuid('user_id').references(() => users.id),
  taskId: uuid('task_id').references(() => tasks.id),
  documentId: uuid('document_id').references(() => documents.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Team Members Junction Table
export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').references(() => teams.id),
  userId: uuid('user_id').references(() => users.id),
  role: text('role', { enum: ['member', 'leader', 'guest'] }).notNull(),
  joinedAt: timestamp('joined_at').defaultNow(),
});

// Chat Messages Table
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  senderId: uuid('sender_id').references(() => users.id),
  projectId: uuid('project_id').references(() => projects.id),
  teamId: uuid('team_id').references(() => teams.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Notifications Table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: text('type', { enum: ['info', 'warning', 'error', 'success'] }).notNull(),
  isRead: boolean('is_read').default(false),
  relatedId: uuid('related_id'),
  relatedType: text('related_type'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Audit Logs Table
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  changes: jsonb('changes'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  assignedTasks: many(tasks, { relationName: 'assignee' }),
  uploadedDocuments: many(documents, { relationName: 'uploader' }),
  verifiedDocuments: many(documents, { relationName: 'verifier' }),
  comments: many(comments),
  chatMessages: many(chatMessages, { relationName: 'sender' }),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  leader: one(users, {
    fields: [teams.leaderId],
    references: [users.id],
    relationName: 'teamLeader',
  }),
  members: many(teamMembers),
  projects: many(projects),
  chatMessages: many(chatMessages),
}));
export const projectsRelations = relations(projects, ({ one, many }) => ({
  team: one(teams, {
    fields: [projects.teamId],
    references: [teams.id],
  }),
  tasks: many(tasks),
  documents: many(documents),
  chatMessages: many(chatMessages),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
    relationName: 'assignee',
  }),
  comments: many(comments),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  uploader: one(users, {
    fields: [documents.uploaderId],
    references: [users.id],
    relationName: 'uploader',
  }),
  verifier: one(users, {
    fields: [documents.verifierId],
    references: [users.id],
    relationName: 'verifier',
  }),
  project: one(projects, {
    fields: [documents.projectId],
    references: [projects.id],
  }),
  comments: many(comments),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  sender: one(users, {
    fields: [chatMessages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  project: one(projects, {
    fields: [chatMessages.projectId],
    references: [projects.id],
  }),
  team: one(teams, {
    fields: [chatMessages.teamId],
    references: [teams.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  document: one(documents, {
    fields: [comments.documentId],
    references: [documents.id],
  }),
}));
export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));


export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
// Types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;