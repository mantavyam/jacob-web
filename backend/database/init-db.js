const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'complaints.db');
const schemaPath = path.join(__dirname, 'schema.sql');

console.log('Initializing WomenRise database...');

try {
    // Create database connection
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error creating database:', err);
            process.exit(1);
        }
    });
    
    // Read schema
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Execute schema
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error executing schema:', err);
            process.exit(1);
        }
        
        console.log('✓ Database created successfully');
        console.log('✓ Tables created: complaints, admin_sessions');
        console.log('✓ Indexes created');
        console.log(`✓ Database location: ${dbPath}`);
        
        // Verify tables
        db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
            if (err) {
                console.error('Error querying tables:', err);
                db.close();
                process.exit(1);
            }
            
            console.log('\nTables in database:');
            let processed = 0;
            
            tables.forEach((table) => {
                db.get(`SELECT COUNT(*) as count FROM ${table.name}`, [], (err, row) => {
                    processed++;
                    if (!err) {
                        console.log(`  - ${table.name} (${row.count} records)`);
                    }
                    
                    if (processed === tables.length) {
                        console.log('\nDatabase initialization complete!');
                        db.close((err) => {
                            if (err) {
                                console.error('Error closing database:', err);
                            }
                            process.exit(0);
                        });
                    }
                });
            });
        });
    });
    
} catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
}
