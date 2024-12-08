const sqlite3 = require('better-sqlite3');
const crypto = require('crypto');

// Hubungkan atau buat database
const db = sqlite3('./data/scripts.db');

// Buat tabel untuk menyimpan script jika belum ada
db.exec(`
    CREATE TABLE IF NOT EXISTS scripts (
        id TEXT PRIMARY KEY,
        lua_script TEXT
    );
`);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, webhook } = req.body;

        // Validasi input
        if (!username || !webhook) {
            return res.status(400).json({ message: 'Username and webhook are required' });
        }

        // Generate ID unik dan Lua script
        const uniqueId = crypto.randomBytes(8).toString('hex');
        const luaScript = `
local username = "${username}"
local webhook = "${webhook}"
print("Generated Lua Script for ${username}")
`;

        // Simpan script ke database
        const stmt = db.prepare(`INSERT INTO scripts (id, lua_script) VALUES (?, ?)`);
        stmt.run(uniqueId, luaScript);

        // Kirim tautan ke pengguna
        const scriptUrl = `https://${req.headers.host}/api/raw/${uniqueId}`;
        return res.status(200).json({ link: scriptUrl });
    } else if (req.method === 'GET') {
        const { id } = req.query;

        // Ambil script dari database
        const stmt = db.prepare(`SELECT lua_script FROM scripts WHERE id = ?`);
        const row = stmt.get(id);

        if (!row) {
            return res.status(404).send('Script not found');
        }

        res.setHeader('Content-Type', 'text/plain');
        return res.send(row.lua_script);
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
