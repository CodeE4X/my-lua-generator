module.exports = (req, res) => {
  const { uniqueId } = req.query;  // Ambil uniqueId dari URL

  // Misalnya kita simpan script sementara dalam memory (di server)
  // atau ambil dari variable di generate.js sebelumnya

  // Cek jika uniqueId valid (misalnya, kita simpan mapping atau data sementara di memory)
  const scripts = {
    'exampleUniqueId': `local username = "exampleUser"\nlocal webhook = "https://example.com/webhook"`,
    // Tambahkan lebih banyak script sesuai kebutuhan
  };

  // Cek apakah uniqueId ada
  const luaScript = scripts[uniqueId];

  if (luaScript) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(luaScript);  // Kirim Lua script ke client
  } else {
    res.status(404).json({ message: 'Script not found' });
  }
};

