const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const { uniqueId } = req.query;  // Ambil uniqueId dari URL

  // Tentukan path file Lua berdasarkan uniqueId
  const filePath = path.join(__dirname, '..', 'data', `${uniqueId}.lua`);

  // Cek apakah file Lua ada
  if (fs.existsSync(filePath)) {
    const luaScript = fs.readFileSync(filePath, 'utf-8');
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(luaScript);  // Kirim Lua script ke client
  } else {
    res.status(404).json({ message: 'Script not found' });
  }
};
