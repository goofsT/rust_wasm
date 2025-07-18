// server.js
const express = require('express');
const path = require('path');
const app = express();

// 设置 SharedArrayBuffer 所需的 HTTP 头
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// 静态文件目录（你的 HTML 和 JS 文件放这里）
app.use(express.static(path.join(__dirname, 'src')));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
