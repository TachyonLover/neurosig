import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "neurosig.db"

def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection

def init_database():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS recordings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            row_count INTEGER NOT NULL,
            channel_count INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close

def add_recording(filename, row_count, channel_count, file_path):
    connection = get_connection()

    cursor = connection.execute("""
        INSERT INTO recordings (filename, row_count, channel_count, file_path)
        VALUES (?, ?, ?, ?)
    """, (filename, row_count, channel_count, file_path))

    connection.commit()

    recording_id = cursor.lastrowid

    connection.close()

    return recording_id

def get_recordings():
    connection = get_connection()

    cursor = connection.execute("""
        SELECT * FROM recordings
    """)

    recordings = cursor.fetchall()

    connection.close()
    return recordings

def delete_recording(recording_id):
    connection = get_connection()

    connection.execute("""
        DELETE FROM recordings
        WHERE id = ?
    """, (recording_id,))

    connection.commit()
    connection.close()

if __name__ == "__main__":
    connection = get_connection()

    connection.execute("""
        ALTER TABLE recordings
        ADD COLUMN file_path TEXT
    """)

    connection.commit()
    connection.close()
    print("Added file_path column")