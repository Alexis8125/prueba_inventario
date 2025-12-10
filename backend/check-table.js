import mysql from 'mysql2/promise';

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'inventory_system'
    });
    
    const [cols] = await conn.execute('DESCRIBE inventory_products');
    console.log('Columnas actuales:');
    cols.forEach(c => console.log(`  - ${c.Field} (${c.Type})`));
    
    conn.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
