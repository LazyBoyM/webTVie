import { createClient, Client } from "@libsql/client";
import { SAMPLE_STUDENTS, SAMPLE_VIETNAMESE_TOPICS } from "./data";
import { INITIAL_VIETNAMESE_QUESTIONS } from "./dataStore";

let tursoClient: Client | null = null;
let tablesInitialized = false;

/**
 * Kiểm tra xem Turso Cloud đã được cấu hình biến môi trường hay chưa
 */
export function isTursoConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

/**
 * Lấy client kết nối Turso Cloud
 */
export function getTursoClient(): Client | null {
  if (!isTursoConfigured()) return null;
  if (!tursoClient) {
    tursoClient = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return tursoClient;
}

/**
 * Tự động tạo bảng và nạp dữ liệu ban đầu lên Turso Cloud nếu chưa có
 */
export async function ensureTursoTables(client: Client) {
  if (tablesInitialized) return;

  // 1. Bảng topics
  await client.execute(`
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      grade INTEGER DEFAULT 4,
      total_questions INTEGER DEFAULT 10,
      icon TEXT DEFAULT '📖',
      description TEXT,
      is_active INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Bảng students
  await client.execute(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      grade INTEGER DEFAULT 4,
      avatar TEXT DEFAULT '🦊',
      xp INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      gems INTEGER DEFAULT 100,
      stars INTEGER DEFAULT 10,
      level INTEGER DEFAULT 1,
      last_active TEXT DEFAULT 'Mới tạo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Bảng questions
  await client.execute(`
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      subject TEXT DEFAULT 'tieng-viet',
      grade INTEGER DEFAULT 4,
      topic TEXT NOT NULL,
      topic_id TEXT DEFAULT 'topic_tu_loai',
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_index INTEGER NOT NULL,
      explanation TEXT,
      difficulty TEXT DEFAULT 'medium',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed students nếu rỗng
  const studentsCount = await client.execute("SELECT COUNT(*) as count FROM students");
  if (Number(studentsCount.rows[0]?.count || 0) === 0) {
    for (const s of SAMPLE_STUDENTS) {
      await client.execute({
        sql: "INSERT OR IGNORE INTO students (id, name, grade, avatar, xp, streak, gems, stars, level, last_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: [s.studentId, s.name, s.grade, s.avatar, s.xp, s.streak, 100, 10, s.level, "Mới tạo"],
      });
    }
  }

  // Seed topics nếu rỗng
  const topicsCount = await client.execute("SELECT COUNT(*) as count FROM topics");
  if (Number(topicsCount.rows[0]?.count || 0) === 0) {
    for (const t of SAMPLE_VIETNAMESE_TOPICS) {
      await client.execute({
        sql: "INSERT OR IGNORE INTO topics (id, name, grade, total_questions, icon, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [t.id, t.name, t.grade, t.questionCount || 10, t.icon, t.description, t.isActive ? 1 : 0],
      });
    }
  }

  // Seed questions nếu rỗng
  const questionsCount = await client.execute("SELECT COUNT(*) as count FROM questions");
  if (Number(questionsCount.rows[0]?.count || 0) === 0) {
    for (const q of INITIAL_VIETNAMESE_QUESTIONS) {
      await client.execute({
        sql: "INSERT OR IGNORE INTO questions (id, subject, grade, topic, topic_id, question, options, correct_index, explanation, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: [
          q.id,
          q.subject,
          q.grade,
          q.topic,
          q.topicId || "topic_tu_loai",
          q.question,
          JSON.stringify(q.options),
          q.correctIndex,
          q.explanation,
          q.difficulty,
        ],
      });
    }
  }

  tablesInitialized = true;
}
