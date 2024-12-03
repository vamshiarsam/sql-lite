import sqlite3 from 'sqlite3';

export async function GET(req) {
  const sqliteDb = new sqlite3.Database('sample.db');

  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        return reject(new Response(JSON.stringify({ error: 'Failed to fetch users.' }), { status: 500 }));
      }
      resolve(new Response(JSON.stringify(rows), { status: 200 }));
    });

    sqliteDb.close();
  });
}
