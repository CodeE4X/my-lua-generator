const crypto = require('crypto');

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
-- Tambahkan logika lain di sini
`;

        // Simpan sementara di memori global (state serverless)
        global.generatedScripts = global.generatedScripts || {};
        global.generatedScripts[uniqueId] = luaScript;

        // Kirim tautan ke pengguna
        const scriptUrl = `https://${req.headers.host}/api/raw/${uniqueId}`;
        return res.status(200).json({ link: scriptUrl });
    } else if (req.method === 'GET') {
        const { id } = req.query;

        // Cek apakah ID script tersedia
        const luaScript = global.generatedScripts?.[id];
        if (!luaScript) {
            return res.status(404).send('Script not found');
        }

        res.setHeader('Content-Type', 'text/plain');
        return res.send(luaScript);
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
