import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameFr: text("name_fr").notNull(),
  nameMg: text("name_mg").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  titleFr: text("title_fr").notNull(),
  titleMg: text("title_mg").notNull(),
  contentFr: text("content_fr").notNull(),
  contentMg: text("content_mg").notNull(),
  imageUrl: text("image_url"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  questionFr: text("question_fr").notNull(),
  questionMg: text("question_mg").notNull(),
  imageUrl: text("image_url"),
  option1Fr: text("option1_fr").notNull(),
  option1Mg: text("option1_mg").notNull(),
  option2Fr: text("option2_fr").notNull(),
  option2Mg: text("option2_mg").notNull(),
  option3Fr: text("option3_fr").notNull(),
  option3Mg: text("option3_mg").notNull(),
  option4Fr: text("option4_fr").notNull(),
  option4Mg: text("option4_mg").notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const examResults = pgTable("exam_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  passed: boolean("passed").notNull(),
  answers: text("answers").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertExamResultSchema = createInsertSchema(examResults).omit({
  id: true,
  createdAt: true,
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type ExamResult = typeof examResults.$inferSelect;
export type InsertExamResult = z.infer<typeof insertExamResultSchema>;
