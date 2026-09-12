import { createClient, Client } from "@libsql/client";
import { SAMPLE_STUDENTS, SAMPLE_VIETNAMESE_TOPICS, DEFAULT_VOCABULARY_NOTES } from "./data";
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
 * Lấy client kết nối duy nhất tới Turso Cloud
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
 * Khởi tạo cấu trúc các bảng trên Turso Cloud
 */
export async function ensureTursoTables(client: Client) {
  if (tablesInitialized) return;

  // 1. Bảng topics (Chuyên đề ôn tập)
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

  // 2. Bảng students (Học sinh)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      pin TEXT DEFAULT '1234',
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

  // 3. Bảng questions (Ngân hàng câu hỏi)
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

  // 4. Bảng vocabulary_notes (Sổ tay từ vựng)
  await client.execute(`
    CREATE TABLE IF NOT EXISTS vocabulary_notes (
      id TEXT PRIMARY KEY,
      word TEXT NOT NULL,
      category TEXT NOT NULL,
      definition TEXT NOT NULL,
      example_sentence TEXT,
      date_learned TEXT DEFAULT 'Hôm nay',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tự động seed học sinh ban đầu nếu bảng rỗng
  const studentsCount = await client.execute("SELECT COUNT(*) as count FROM students");
  if (Number(studentsCount.rows[0]?.count || 0) === 0) {
    for (const s of SAMPLE_STUDENTS) {
      await client.execute({
        sql: "INSERT OR IGNORE INTO students (id, name, grade, avatar, xp, streak, gems, stars, level, last_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: [s.studentId, s.name, s.grade, s.avatar, s.xp, s.streak, 100, 10, s.level, "Mới tạo"],
      });
    }
  }

  // Tự động seed chuyên đề nếu bảng rỗng
  const topicsCount = await client.execute("SELECT COUNT(*) as count FROM topics");
  if (Number(topicsCount.rows[0]?.count || 0) === 0) {
    for (const t of SAMPLE_VIETNAMESE_TOPICS) {
      await client.execute({
        sql: "INSERT OR IGNORE INTO topics (id, name, grade, total_questions, icon, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [t.id, t.name, t.grade, t.questionCount || 10, t.icon, t.description, t.isActive ? 1 : 0],
      });
    }
  }

  // Tự động seed câu hỏi nếu bảng rỗng
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

  // Tự động seed từ vựng nếu bảng rỗng
  const vocabCount = await client.execute("SELECT COUNT(*) as count FROM vocabulary_notes");
  if (Number(vocabCount.rows[0]?.count || 0) === 0) {
    for (const v of DEFAULT_VOCABULARY_NOTES) {
      await client.execute({
        sql: "INSERT OR IGNORE INTO vocabulary_notes (id, word, category, definition, example_sentence, date_learned) VALUES (?, ?, ?, ?, ?, ?)",
        args: [v.id, v.word, v.category, v.definition, v.exampleSentence, v.dateLearned],
      });
    }
  }

  tablesInitialized = true;
}

/**
 * Kiểm tra kết nối Turso Cloud
 */
export async function testTursoConnection(): Promise<{
  connected: boolean;
  message: string;
  databasePath?: string;
  provider: "turso";
}> {
  if (!isTursoConfigured()) {
    return {
      connected: false,
      message: "Chưa cấu hình TURSO_DATABASE_URL và TURSO_AUTH_TOKEN trong file .env.local",
      provider: "turso",
    };
  }

  try {
    const client = getTursoClient()!;
    await ensureTursoTables(client);
    await client.execute("SELECT 1 as connected");
    return {
      connected: true,
      message: "Đã kết nối thành công CSDL Turso SQLite Cloud (Đồng bộ 24/7 toàn cầu)",
      databasePath: process.env.TURSO_DATABASE_URL,
      provider: "turso",
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return {
      connected: false,
      message: `Lỗi kết nối Turso Cloud: ${error.message}`,
      provider: "turso",
    };
  }
}

/**
 * Làm mới hoặc nạp lại bảng dữ liệu trên Turso Cloud
 */
export async function setupTursoDatabase(): Promise<{
  success: boolean;
  message: string;
  details?: Record<string, number>;
}> {
  if (!isTursoConfigured()) {
    return {
      success: false,
      message: "Chưa cấu hình biến môi trường Turso!",
    };
  }

  try {
    const client = getTursoClient()!;
    tablesInitialized = false;
    await ensureTursoTables(client);

    const topics = Number((await client.execute("SELECT COUNT(*) as c FROM topics")).rows[0]?.c || 0);
    const students = Number((await client.execute("SELECT COUNT(*) as c FROM students")).rows[0]?.c || 0);
    const questions = Number((await client.execute("SELECT COUNT(*) as c FROM questions")).rows[0]?.c || 0);
    const vocab = Number((await client.execute("SELECT COUNT(*) as c FROM vocabulary_notes")).rows[0]?.c || 0);

    return {
      success: true,
      message: "CSDL Turso Cloud đã sẵn sàng hoạt động!",
      details: { topics, students, questions, vocabulary: vocab },
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return {
      success: false,
      message: `Lỗi khởi tạo Turso: ${error.message}`,
    };
  }
}
