module.exports = (req, res) => {
  const { uniqueId } = req.query;  // Ambil uniqueId dari URL

  // Ambil script dari memory (dari scriptDatabase)
  const luaScript = global.scriptDatabase ? global.scriptDatabase[uniqueId] : null;

  if (luaScript) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(luaScript);  // Kirim Lua script ke client
  } else {
    res.status(404).json({ message: 'Script not found' });
  }
};
