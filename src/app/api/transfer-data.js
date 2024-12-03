import { NextApiRequest, NextApiResponse } from 'next'
import { ClickHouse } from 'clickhouse'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Connect to Clickhouse
      const clickhouse = new ClickHouse({
        url: process.env.CLICKHOUSE_URL,
        port: 8123,
        debug: false,
        basicAuth: {
          username: process.env.CLICKHOUSE_USER,
          password: process.env.CLICKHOUSE_PASSWORD,
        },
        isUseGzip: false,
        format: "json",
        raw: false,
        config: {
          session_timeout: 60,
          output_format_json_quote_64bit_integers: 0,
          enable_http_compression: 0,
        },
      });

      // Fetch data from Clickhouse
      const query = 'SELECT * FROM your_table LIMIT 1000';  // Adjust this query as needed
      const clickhouseData = await clickhouse.query(query).toPromise();

      // Connect to SQLite
      const db = await open({
        filename: './mydb.sqlite',
        driver: sqlite3.Database
      });

      // Insert data into SQLite
      for (const row of clickhouseData) {
        await db.run(
          'INSERT INTO your_sqlite_table (column1, column2, column3) VALUES (?, ?, ?)',
          [row.column1, row.column2, row.column3]
        );
      }

      await db.close();

      res.status(200).json({ message: 'Data transfer completed successfully' });
    } catch (error) {
      console.error('Error transferring data:', error);
      res.status(500).json({ error: 'An error occurred while transferring data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}