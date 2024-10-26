import eel
import json
import random
import os
import sqlite3
eel.init('web')
# Connect to SQLite database
conn = sqlite3.connect('database.db')
c = conn.cursor()

# Create table if not exists
c.execute('''
    CREATE TABLE IF NOT EXISTS review_topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter INTEGER NOT NULL,
        question TEXT NOT NULL,
        question_number INTEGER NOT NULL,
        answer TEXT NOT NULL,
        explanation TEXT NOT NULL,
        options TEXT
    )
''')

# Function to add a new topic
@eel.expose
def add_topic(chapter, question, question_number, answer, explanation, options=None):
    c.execute('''
        INSERT INTO review_topics (chapter, question, question_number, answer, explanation, options)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (chapter, question, question_number, answer, explanation, options))
    conn.commit()

# Function to get all topics
@eel.expose
def get_topics():
    c.execute('SELECT * FROM review_topics')
    return c.fetchall()

@eel.expose
def delete_topic(topic_id):
    c.execute('DELETE FROM review_topics WHERE id = ?', (topic_id,))
    conn.commit()

@eel.expose
def get_random_question_from_chapter(chapter, type):
    chapter = int(chapter)
    if chapter < 10:
        filename = f'chapter 0{chapter}.json'  # Add a space for chapters less than 10
    else:
        filename = f'chapter{chapter}.json'  # No space for chapter numbers 10 and above
    
    if type == "MultiSelect":
        filepath = os.path.join('Json', 'MultiSelect', filename)
    else:
        filepath = os.path.join('Json', 'TrueOrFalse', filename)
    
    with open(filepath, 'r', encoding='utf-8') as file:
        questions = json.load(file)
    
    return random.choice(questions)  # Return a random question from the chapter

if __name__ == "__main__":
    eel.start('main.html')
