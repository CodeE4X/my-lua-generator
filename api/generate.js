// Menyimpan data script sementara di memory (object JavaScript)
let scriptDatabase = {};  // Menyimpan script berdasarkan uniqueId

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, webhook } = req.body;

    // Generate Lua script dengan username dan webhook
    const luaScript = `local username = "${username}"\nlocal webhook = "${webhook}"`;

    // Generate uniqueId berdasarkan waktu atau random string
    const uniqueId = Math.random().toString(36).substring(2, 15);

    // Simpan script ke memory
    scriptDatabase[uniqueId] = luaScript;

    // Generate link untuk mengakses script tersebut
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
