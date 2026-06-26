const Database = require('better-sqlite3');
const path = require('path');

// Connect to a local database file named 'elitedata.db'
const dbPath = path.join(__dirname, '../elitedata.db');
const db = new Database(dbPath);

// Create the tables if they don't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    userId TEXT PRIMARY KEY,
    guildId TEXT,
    zeni INTEGER DEFAULT 500,
    bank INTEGER DEFAULT 0,
    powerLevel INTEGER DEFAULT 100,
    rank INTEGER DEFAULT 1,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    favoriteTransformation TEXT DEFAULT 'None',
    inventory TEXT DEFAULT '[]'
  )
`);

console.log('🐉 Database Initialized: Capsule Corp filing cabinet is secure.');

module.exports = {
    // A quick tool to grab a user's profile from the database
    getUser: (userId) => {
        let user = db.prepare('SELECT * FROM users WHERE userId = ?').get(userId);
        if (!user) {
            // If they don't exist in our cabinet yet, add them with starting stats!
            db.prepare('INSERT INTO users (userId, zeni, powerLevel) VALUES (?, 500, 100)').run(userId);
            user = db.prepare('SELECT * FROM users WHERE userId = ?').get(userId);
        }
        // Convert their inventory text back into a real list/array
        user.inventory = JSON.parse(user.inventory || '[]');
        return user;
    },

    // A tool to save changes back to the database
    updateUser: (userId, data) => {
        const current = db.prepare('SELECT * FROM users WHERE userId = ?').get(userId);
        if (!current) return;

        const zeni = data.zeni !== undefined ? data.zeni : current.zeni;
        const bank = data.bank !== undefined ? data.bank : current.bank;
        const powerLevel = data.powerLevel !== undefined ? data.powerLevel : current.powerLevel;
        const rank = data.rank !== undefined ? data.rank : current.rank;
        const wins = data.wins !== undefined ? data.wins : current.wins;
        const losses = data.losses !== undefined ? data.losses : current.losses;
        const favoriteTransformation = data.favoriteTransformation !== undefined ? data.favoriteTransformation : current.favoriteTransformation;
        const inventory = data.inventory !== undefined ? JSON.stringify(data.inventory) : current.inventory;

        db.prepare(`
            UPDATE users 
            SET zeni = ?, bank = ?, powerLevel = ?, rank = ?, wins = ?, losses = ?, favoriteTransformation = ?, inventory = ?
            WHERE userId = ?
        `).run(zeni, bank, powerLevel, rank, wins, losses, favoriteTransformation, inventory, userId);
    }
};
