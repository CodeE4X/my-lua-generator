module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { username, webhook } = req.body;

        // Generate Lua script dengan username dan webhook
        const luaScript = `local username = "${username}"\nlocal webhook = "${webhook}"`;

        // Generate link (di sini hanya contoh, Anda bisa ganti dengan sistem penyimpanan lebih lanjut)
        const uniqueId = Math.random().toString(36).substring(2, 15);
        const scriptLink = `https://my-lua-generator.vercel.app/api/raw/${uniqueId}`;

        // Kirim response dengan link
        res.status(200).json({
            link: scriptLink,
            luaScript: luaScript
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
