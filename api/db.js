const path = require('path');

// Function to dynamically load lowdb
async function loadLowdb() {
  const { Low, JSONFile } = await import('lowdb');
  
  // Define the path to the JSON file in the `data` folder
  const file = path.join(__dirname, '../data/users.json');
  const adapter = new JSONFile(file);
  const db = new Low(adapter);

  await db.read(); // Load the data from the JSON file
  return db;
}

module.exports = loadLowdb;
