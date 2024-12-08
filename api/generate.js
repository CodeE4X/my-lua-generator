const crypto = require('crypto');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, webhook } = req.body;

        // Validasi input
        if (!username || !webhook) {
            return res.status(400).json({ message: 'Username and webhook are required' });
        }

        const uniqueId = crypto.randomBytes(8).toString('hex'); // Generate unique ID
        const luaScript = `
local username = "${username}"
local webhook = "${webhook}"

print("Generated Lua Script")
-- Tambahkan logika lain di sini
`;

        // Simpan sementara di memori global (serverless state)
        global.generatedScripts = global.generatedScripts || {};
        global.generatedScripts[uniqueId] = luaScript;

        // Kirim tautan kembali ke pengguna
        const scriptUrl = `https://${req.headers.host}/api/raw/${uniqueId}`;
        return res.status(200).json({ link: scriptUrl });
    } else if (req.method === 'GET') {
        // Tangani endpoint untuk mengakses script
        const { id } = req.query;
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

