import mysql from 'mysql2/promise';

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'inventory_system'
    });
    
    console.log('Agregando columnas faltantes...');
    
    // Verificar e agregar description
    try {
      await conn.execute('ALTER TABLE inventory_products ADD COLUMN description TEXT AFTER product_name');
      console.log('✓ Columna description agregada');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ Columna description ya existe');
      } else {
        throw err;
      }
    }
    
    // Verificar e agregar category
    try {
      await conn.execute('ALTER TABLE inventory_products ADD COLUMN category VARCHAR(255) AFTER description');
      console.log('✓ Columna category agregada');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ Columna category ya existe');
      } else {
        throw err;
      }
    }
    
    // Verificar e agregar location
    try {
      await conn.execute('ALTER TABLE inventory_products ADD COLUMN location VARCHAR(255) AFTER category');
      console.log('✓ Columna location agregada');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ Columna location ya existe');
      } else {
        throw err;
      }
    }
    
    console.log('\nColumnas después de actualizar:');
    const [cols] = await conn.execute('DESCRIBE inventory_products');
    cols.forEach(c => console.log(`  - ${c.Field} (${c.Type})`));
    
    conn.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
