"use client"; // This is a client component

import { useState } from 'react';

export default function TransferPage() {
  const [message, setMessage] = useState('');

  const handleTransfer = async () => {
    const response = await fetch('/api/transferData');
    const data = await response.json();
    setMessage(data.message || data.error);
  };

  return (
    <div>
      <h1>Transfer Data from ClickHouse to SQLite</h1>
      <button onClick={handleTransfer}>Transfer Data</button>
      {message && <p>{message}</p>}
    </div>
  );
}
