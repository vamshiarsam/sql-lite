import { createClient } from '@clickhouse/client';
import sqlite3 from 'sqlite3';

export async function GET(req) {
  const clickhouseClient = createClient({
    host: 'http://localhost:8123', // Update with your ClickHouse host
  });

  const sqliteDb = new sqlite3.Database('sample.db');

  try {
    // Fetch data from ClickHouse
    const clickhouseData = await clickhouseClient.query('SELECT * FROM my_database ');

    // Insert data into SQLite
    sqliteDb.serialize(() => {
      const stmt = sqliteDb.prepare('INSERT INTO users (id, name, email) VALUES (?, ?, ?)');

      clickhouseData.data.forEach((row) => {
        stmt.run(row.id, row.name, row.email);
      });

      stmt.finalize();
    });

    return new Response(JSON.stringify({ message: 'Data transferred successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error transferring data:', error);
    return new Response(JSON.stringify({ error: 'Failed to transfer data.' }), { status: 500 });
  } finally {
    sqliteDb.close();
  }
}
