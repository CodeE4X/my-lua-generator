module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, webhook } = req.body;

    // Generate Lua script dengan username dan webhook
    const luaScript = `local username = "${username}"\nlocal webhook = "${webhook}"`;

    // Generate uniqueId berdasarkan waktu atau random string
    const uniqueId = Math.random().toString(36).substring(2, 15);

    // Simpan file Lua script secara sementara atau hanya kirimkan sebagai response
    // Karena kita tidak menyimpan file secara permanen di sini, kita hanya mengirimkan script sebagai response
    // File akan dihasilkan secara dinamis melalui endpoint /api/raw/uniqueId

    // Response dengan link ke Lua script
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
