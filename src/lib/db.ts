import mysql, { Pool } from "mysql2/promise";
import { INITIAL_VIETNAMESE_QUESTIONS } from "./dataStore";
import { DEFAULT_VOCABULARY_NOTES, SAMPLE_STUDENTS, SAMPLE_VIETNAMESE_TOPICS } from "./data";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "3306", 10);
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "eduspark_db";

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
    });
  }
  return pool;
}

/**
 * Kiểm tra kết nối tới MySQL XAMPP
 */
export async function testDbConnection(): Promise<{
  connected: boolean;
  message: string;
  databaseExists?: boolean;
}> {
  try {
    // Thử kết nối trực tiếp đến database eduspark_db
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      connectTimeout: 3000,
    });
    await connection.ping();
    await connection.end();
    return {
      connected: true,
      message: `Đã kết nối thành công tới MySQL XAMPP (Database: ${DB_NAME})`,
      databaseExists: true,
    };
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    // Nếu lỗi là database chưa tồn tại (ER_BAD_DB_ERROR)
    if (error.code === "ER_BAD_DB_ERROR") {
      try {
        const rootConn = await mysql.createConnection({
          host: DB_HOST,
          port: DB_PORT,
          user: DB_USER,
          password: DB_PASSWORD,
          connectTimeout: 3000,
        });
        await rootConn.ping();
        await rootConn.end();
        return {
          connected: true,
          message: `MySQL XAMPP đang chạy, nhưng CSDL "${DB_NAME}" chưa được khởi tạo.`,
          databaseExists: false,
        };
      } catch (e: unknown) {
        const rootErr = e as { message?: string };
        return {
          connected: false,
          message: `Không thể kết nối MySQL XAMPP: ${rootErr.message || "Kiểm tra lại cổng 3306"}`,
          databaseExists: false,
        };
      }
    }

    return {
      connected: false,
      message: `Chưa kết nối được MySQL XAMPP (${error.message || "Vui lòng mở XAMPP và Start MySQL"}).`,
      databaseExists: false,
    };
  }
}

/**
 * Tự động tạo Database, các bảng và nạp dữ liệu mẫu ban đầu (1-click setup)
 */
export async function setupDatabase(): Promise<{
  success: boolean;
  message: string;
  details?: Record<string, number>;
}> {
  let rootConn: mysql.Connection | null = null;
  try {
    // 1. Kết nối cấp máy chủ để tạo Database
    rootConn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      charset: "utf8mb4",
    });

    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConn.changeUser({ database: DB_NAME });

    // 2. Tạo bảng topics
    await rootConn.query(`
      CREATE TABLE IF NOT EXISTS \`topics\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`name\` VARCHAR(150) NOT NULL,
        \`grade\` INT DEFAULT 4,
        \`total_questions\` INT DEFAULT 10,
        \`icon\` VARCHAR(10) DEFAULT '📖',
        \`description\` TEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Tạo bảng students
    await rootConn.query(`
      CREATE TABLE IF NOT EXISTS \`students\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`name\` VARCHAR(100) NOT NULL,
        \`grade\` INT DEFAULT 4,
        \`avatar\` VARCHAR(255) DEFAULT '🦊',
        \`xp\` INT DEFAULT 0,
        \`streak\` INT DEFAULT 1,
        \`gems\` INT DEFAULT 100,
        \`stars\` INT DEFAULT 10,
        \`level\` INT DEFAULT 1,
        \`last_active\` VARCHAR(50) DEFAULT 'Hôm nay',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Tạo bảng questions
    await rootConn.query(`
      CREATE TABLE IF NOT EXISTS \`questions\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`subject\` VARCHAR(50) DEFAULT 'tieng-viet',
        \`grade\` INT DEFAULT 4,
        \`topic\` VARCHAR(150) NOT NULL,
        \`topic_id\` VARCHAR(50) DEFAULT 'topic_tu_loai',
        \`question\` TEXT NOT NULL,
        \`options\` TEXT NOT NULL,
        \`correct_index\` INT NOT NULL,
        \`explanation\` TEXT,
        \`difficulty\` ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_topic_id (\`topic_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Tạo bảng vocabulary_notes
    await rootConn.query(`
      CREATE TABLE IF NOT EXISTS \`vocabulary_notes\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`word\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(100) NOT NULL,
        \`definition\` TEXT NOT NULL,
        \`example_sentence\` TEXT,
        \`date_learned\` VARCHAR(50) DEFAULT 'Hôm nay',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Tạo bảng assignments
    await rootConn.query(`
      CREATE TABLE IF NOT EXISTS \`assignments\` (
        \`id\` VARCHAR(50) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`grade\` INT DEFAULT 4,
        \`topic_id\` VARCHAR(50) DEFAULT 'topic_tu_loai',
        \`question_count\` INT DEFAULT 10,
        \`due_date\` VARCHAR(50) NOT NULL,
        \`status\` ENUM('active', 'completed', 'draft') DEFAULT 'active',
        \`completion_rate\` INT DEFAULT 0,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Nạp dữ liệu mẫu nếu bảng rỗng
    // Topics
    for (const t of SAMPLE_VIETNAMESE_TOPICS) {
      await rootConn.query(
        `INSERT IGNORE INTO \`topics\` (\`id\`, \`name\`, \`grade\`, \`total_questions\`, \`icon\`, \`description\`)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [t.id, t.name, t.grade, t.questionCount || 10, t.icon, t.description]
      );
    }

    // Students
    for (const s of SAMPLE_STUDENTS) {
      await rootConn.query(
        `INSERT IGNORE INTO \`students\` (\`id\`, \`name\`, \`grade\`, \`avatar\`, \`xp\`, \`streak\`, \`gems\`, \`stars\`, \`level\`, \`last_active\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [s.studentId, s.name, s.grade, s.avatar, s.xp, s.streak, 100, 10, s.level, "Hôm nay"]
      );
    }

    // Questions
    for (const q of INITIAL_VIETNAMESE_QUESTIONS) {
      await rootConn.query(
        `INSERT IGNORE INTO \`questions\` (\`id\`, \`subject\`, \`grade\`, \`topic\`, \`topic_id\`, \`question\`, \`options\`, \`correct_index\`, \`explanation\`, \`difficulty\`)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          q.id,
          q.subject,
          q.grade,
          q.topic,
          q.topicId,
          q.question,
          JSON.stringify(q.options),
          q.correctIndex,
          q.explanation,
          q.difficulty,
        ]
      );
    }

    // Vocabulary Notes
    for (const v of DEFAULT_VOCABULARY_NOTES) {
      await rootConn.query(
        `INSERT IGNORE INTO \`vocabulary_notes\` (\`id\`, \`word\`, \`category\`, \`definition\`, \`example_sentence\`, \`date_learned\`)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [v.id, v.word, v.category, v.definition, v.exampleSentence, v.dateLearned]
      );
    }

    return {
      success: true,
      message: `Đã khởi tạo thành công CSDL "${DB_NAME}" và nạp dữ liệu tiếng Việt đầy đủ!`,
      details: {
        topics: SAMPLE_VIETNAMESE_TOPICS.length,
        students: SAMPLE_STUDENTS.length,
        questions: INITIAL_VIETNAMESE_QUESTIONS.length,
        vocabulary: DEFAULT_VOCABULARY_NOTES.length,
      },
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return {
      success: false,
      message: `Lỗi khi khởi tạo CSDL: ${error.message || "Lỗi không xác định"}`,
    };
  } finally {
    if (rootConn) {
      await rootConn.end();
    }
  }
}
