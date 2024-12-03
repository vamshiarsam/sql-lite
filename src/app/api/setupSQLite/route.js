import sqlite3 from 'sqlite3';

export async function GET(req) {
  const sqliteDb = new sqlite3.Database('sample.db');

  return new Promise((resolve, reject) => {
    sqliteDb.serialize(() => {
      sqliteDb.run(`CREATE TABLE IF NOT EXISTS userss (
        id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT
      )`, (err) => {
        if (err) {
          console.error(err);
          return reject(new Response(JSON.stringify({ error: 'Failed to create table.' }), { status: 500 }));
        }
        resolve(new Response(JSON.stringify({ message: 'SQLite setup completed.' }), { status: 200 }));
      });
    });

    sqliteDb.close();
  });
}
