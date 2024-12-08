const path = require('path');
const fs = require('fs');

async function loadLowdb() {
  try {
    const { Low } = await import('lowdb');
    const { JSONFile } = await import('lowdb/node');
    

    const file = path.join(__dirname, '../data/users.json');
    console.log('Database path:', file);

//read provided file
    let defaultData = { users: [] };
    if (fs.existsSync(file)) {
      const fileContent = fs.readFileSync(file, 'utf-8');
      if (fileContent) {
        defaultData = JSON.parse(fileContent);
      }
    }
    
    const adapter = new JSONFile(file);
    const db = new Low(adapter, defaultData);

    await db.read();
    console.log(`Database loaded successfully with ${db.data.users.length} users`);
    return db;
  } catch (error) {
    console.error('Error loading database:', error);
    throw error;
  }
}

module.exports = loadLowdb;