import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { INITIAL_VIETNAMESE_QUESTIONS } from "./dataStore";
import { DEFAULT_VOCABULARY_NOTES, SAMPLE_STUDENTS, SAMPLE_VIETNAMESE_TOPICS } from "./data";

let dbInstance: Database.Database | null = null;

const DB_DIR = path.join(process.cwd(), "database");
const DB_PATH = path.join(DB_DIR, "eduspark.db");

/**
 * Lấy đối tượng kết nối SQLite cục bộ
 */
export function getDb(): Database.Database {
  if (!dbInstance) {
    // Đảm bảo thư mục database tồn tại
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    dbInstance = new Database(DB_PATH);
    dbInstance.pragma("journal_mode = WAL"); // Tối ưu hiệu năng ghi đọc song song

    // Tự động khởi tạo cấu trúc bảng nếu chưa tồn tại
    initTables(dbInstance);
  }
  return dbInstance;
}

/**
 * Khởi tạo bảng và nạp dữ liệu mẫu ban đầu
 */
function initTables(db: Database.Database) {
  // 1. Bảng topics
  db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      grade INTEGER DEFAULT 4,
      total_questions INTEGER DEFAULT 10,
      icon TEXT DEFAULT '📖',
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Bảng students
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      grade INTEGER DEFAULT 4,
      avatar TEXT DEFAULT '🦊',
      xp INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 1,
      gems INTEGER DEFAULT 100,
      stars INTEGER DEFAULT 10,
      level INTEGER DEFAULT 1,
      last_active TEXT DEFAULT 'Hôm nay',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Bảng questions
  db.exec(`
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

  // 4. Bảng vocabulary_notes
  db.exec(`
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

  // 5. Bảng assignments
  db.exec(`
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      grade INTEGER DEFAULT 4,
      topic_id TEXT DEFAULT 'topic_tu_loai',
      question_count INTEGER DEFAULT 10,
      due_date TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      completion_rate INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Kiểm tra và nạp dữ liệu mẫu nếu bảng rỗng
  const topicsCount = db.prepare("SELECT COUNT(*) as count FROM topics").get() as { count: number };
  if (topicsCount.count === 0) {
    const insertTopic = db.prepare(
      "INSERT OR IGNORE INTO topics (id, name, grade, total_questions, icon, description) VALUES (?, ?, ?, ?, ?, ?)"
    );
    for (const t of SAMPLE_VIETNAMESE_TOPICS) {
      insertTopic.run(t.id, t.name, t.grade, t.questionCount || 10, t.icon, t.description);
    }
  }

  const studentsCount = db.prepare("SELECT COUNT(*) as count FROM students").get() as { count: number };
  if (studentsCount.count === 0) {
    const insertStudent = db.prepare(
      "INSERT OR IGNORE INTO students (id, name, grade, avatar, xp, streak, gems, stars, level, last_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    for (const s of SAMPLE_STUDENTS) {
      insertStudent.run(s.studentId, s.name, s.grade, s.avatar, s.xp, s.streak, 100, 10, s.level, "Hôm nay");
    }
  }

  const questionsCount = db.prepare("SELECT COUNT(*) as count FROM questions").get() as { count: number };
  if (questionsCount.count === 0) {
    const insertQuestion = db.prepare(
      "INSERT OR IGNORE INTO questions (id, subject, grade, topic, topic_id, question, options, correct_index, explanation, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    for (const q of INITIAL_VIETNAMESE_QUESTIONS) {
      insertQuestion.run(
        q.id,
        q.subject,
        q.grade,
        q.topic,
        q.topicId,
        q.question,
        JSON.stringify(q.options),
        q.correctIndex,
        q.explanation,
        q.difficulty
      );
    }
  }

  const vocabCount = db.prepare("SELECT COUNT(*) as count FROM vocabulary_notes").get() as { count: number };
  if (vocabCount.count === 0) {
    const insertVocab = db.prepare(
      "INSERT OR IGNORE INTO vocabulary_notes (id, word, category, definition, example_sentence, date_learned) VALUES (?, ?, ?, ?, ?, ?)"
    );
    for (const v of DEFAULT_VOCABULARY_NOTES) {
      insertVocab.run(v.id, v.word, v.category, v.definition, v.exampleSentence, v.dateLearned);
    }
  }
}

/**
 * Kiểm tra trạng thái cơ sở dữ liệu SQLite
 */
export function testDbConnection(): {
  connected: boolean;
  message: string;
  databasePath: string;
} {
  try {
    const db = getDb();
    const result = db.prepare("SELECT sqlite_version() as version").get() as { version: string };
    return {
      connected: true,
      message: `Đã kết nối CSDL SQLite cục bộ (SQLite v${result.version}) — Tự động lưu trữ vào database/eduspark.db`,
      databasePath: DB_PATH,
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return {
      connected: false,
      message: `Lỗi kết nối SQLite: ${error.message}`,
      databasePath: DB_PATH,
    };
  }
}

/**
 * Khởi tạo lại hoặc làm mới CSDL SQLite
 */
export function setupDatabase(): {
  success: boolean;
  message: string;
  details?: Record<string, number>;
} {
  try {
    const db = getDb();
    initTables(db);
    const topics = (db.prepare("SELECT COUNT(*) as c FROM topics").get() as { c: number }).c;
    const students = (db.prepare("SELECT COUNT(*) as c FROM students").get() as { c: number }).c;
    const questions = (db.prepare("SELECT COUNT(*) as c FROM questions").get() as { c: number }).c;
    const vocab = (db.prepare("SELECT COUNT(*) as c FROM vocabulary_notes").get() as { c: number }).c;

    return {
      success: true,
      message: `CSDL SQLite đã được khởi tạo và sẵn sàng tại "database/eduspark.db"!`,
      details: { topics, students, questions, vocabulary: vocab },
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return {
      success: false,
      message: `Lỗi khởi tạo SQLite: ${error.message}`,
    };
  }
}
