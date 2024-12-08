const AWS = require('aws-sdk');

// Konfigurasi S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',  // Ganti dengan region bucket Anda
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, webhook } = req.body;

    // Generate Lua script dengan username dan webhook
    const luaScript = `local username = "${username}"\nlocal webhook = "${webhook}"`;

    // Generate uniqueId berdasarkan waktu atau random string
    const uniqueId = Math.random().toString(36).substring(2, 15);

    // Tentukan nama file di S3
    const fileName = `${uniqueId}.lua`;

    // Upload file ke S3
    const params = {
      Bucket: 'your-s3-bucket-name', // Ganti dengan nama bucket S3 Anda
      Key: fileName,
      Body: luaScript,
      ContentType: 'text/plain',
    };

    try {
      await s3.putObject(params).promise();

      // Generate link untuk mengakses script di S3
      const scriptLink = `https://your-s3-bucket-name.s3.amazonaws.com/${fileName}`;

      // Kirim response dengan link
      res.status(200).json({
        link: scriptLink,
        luaScript: luaScript
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload script to S3' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
