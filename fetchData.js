const { createClient } = require('@clickhouse/client');

// Create a ClickHouse client
const client = createClient({
  url: 'http://192.168.1.10:8123', // Use "url" instead of "host"
});

async function fetchData() {
  try {
    // Execute a query to fetch data from the users table
    const result = await client.query('SELECT * FROM  my_database').toPromise();

    // Log the fetched data
    console.log('Users:', result.rows);
  } catch (error) {
    console.error('Error fetching data from ClickHouse:', error);
  }
}

// Call the fetchData function
fetchData();
