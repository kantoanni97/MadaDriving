import { 
  type Category, type InsertCategory,
  type Lesson, type InsertLesson,
  type Question, type InsertQuestion,
  type ExamResult, type InsertExamResult,
  categories, lessons, questions, examResults
} from "@shared/schema";
import { db } from "../db";
import { eq, count } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;
  
  // Lessons
  getLessonsByCategory(categoryId: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<Lesson | undefined>;
  deleteLesson(id: string): Promise<boolean>;
  
  // Questions
  getQuestionsByCategory(categoryId: string): Promise<Question[]>;
  getQuestion(id: string): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: string, question: Partial<InsertQuestion>): Promise<Question | undefined>;
  deleteQuestion(id: string): Promise<boolean>;
  
  // Exam Results
  createExamResult(result: InsertExamResult): Promise<ExamResult>;
  getExamResultsByCategory(categoryId: string): Promise<ExamResult[]>;
  
  // Stats
  getCategoryStats(): Promise<Array<{ categoryId: string; lessonCount: number; questionCount: number }>>;
}

export class DatabaseStorage implements IStorage {
  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount! > 0;
  }

  // Lessons
  async getLessonsByCategory(categoryId: string): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.categoryId, categoryId)).orderBy(lessons.orderIndex);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const result = await db.select().from(lessons).where(eq(lessons.id, id));
    return result[0];
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const result = await db.insert(lessons).values(lesson).returning();
    return result[0];
  }

  async updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<Lesson | undefined> {
    const result = await db.update(lessons).set(lesson).where(eq(lessons.id, id)).returning();
    return result[0];
  }

  async deleteLesson(id: string): Promise<boolean> {
    const result = await db.delete(lessons).where(eq(lessons.id, id));
    return result.rowCount! > 0;
  }

  // Questions
  async getQuestionsByCategory(categoryId: string): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.categoryId, categoryId));
  }

  async getQuestion(id: string): Promise<Question | undefined> {
    const result = await db.select().from(questions).where(eq(questions.id, id));
    return result[0];
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const result = await db.insert(questions).values(question).returning();
    return result[0];
  }

  async updateQuestion(id: string, question: Partial<InsertQuestion>): Promise<Question | undefined> {
    const result = await db.update(questions).set(question).where(eq(questions.id, id)).returning();
    return result[0];
  }

  async deleteQuestion(id: string): Promise<boolean> {
    const result = await db.delete(questions).where(eq(questions.id, id));
    return result.rowCount! > 0;
  }

  // Exam Results
  async createExamResult(result: InsertExamResult): Promise<ExamResult> {
    const inserted = await db.insert(examResults).values(result).returning();
    return inserted[0];
  }

  async getExamResultsByCategory(categoryId: string): Promise<ExamResult[]> {
    return await db.select().from(examResults).where(eq(examResults.categoryId, categoryId));
  }

  // Stats
  async getCategoryStats(): Promise<Array<{ categoryId: string; lessonCount: number; questionCount: number }>> {
    const lessonCounts = await db.select({
      categoryId: lessons.categoryId,
      lessonCount: count(),
    }).from(lessons).groupBy(lessons.categoryId);

    const questionCounts = await db.select({
      categoryId: questions.categoryId,
      questionCount: count(),
    }).from(questions).groupBy(questions.categoryId);

    const stats = new Map<string, { categoryId: string; lessonCount: number; questionCount: number }>();

    lessonCounts.forEach((item: { categoryId: string; lessonCount: number }) => {
      stats.set(item.categoryId, { categoryId: item.categoryId, lessonCount: item.lessonCount, questionCount: 0 });
    });

    questionCounts.forEach((item: { categoryId: string; questionCount: number }) => {
      const existing = stats.get(item.categoryId);
      if (existing) {
        existing.questionCount = item.questionCount;
      } else {
        stats.set(item.categoryId, { categoryId: item.categoryId, lessonCount: 0, questionCount: item.questionCount });
      }
    });

    return Array.from(stats.values());
  }
}

export const storage = new DatabaseStorage();
