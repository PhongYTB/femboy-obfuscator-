[file name]: raw.js
[file content begin]
let storage = {};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ error: "❌ Tên script không được để trống" });
  }

  try {
    if (!storage[name]) {
      console.warn(`Script not found: ${name}. Available: ${Object.keys(storage).join(', ')}`);
      return res.status(404).send("❌ Không tìm thấy script này");
    }

    const script = storage[name];
    const cleanCode = script.content.replace(/\u200D/g, '');
    
    // Format code đẹp hơn cho web
    const formattedCode = cleanCode
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r');
    
    // Kiểm tra nếu là web browser
    const userAgent = (req.headers["user-agent"] || "").toLowerCase();
    const isWebBrowser = userAgent.includes("mozilla") || 
                         userAgent.includes("chrome") || 
                         userAgent.includes("safari") ||
                         userAgent.includes("firefox") ||
                         userAgent.includes("edge");
    
    if (isWebBrowser) {
      // Trả về HTML page đẹp để hiển thị code
      const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Script: ${name} - LuaProtector</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    body {
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .header h1 i {
      color: #fbbf24;
    }
    
    .script-info {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .info-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .code-container {
      background: #1e293b;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #334155;
      margin-bottom: 20px;
    }
    
    .code-header {
      background: #334155;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #475569;
    }
    
    .code-header h2 {
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .code-actions {
      display: flex;
      gap: 10px;
    }
    
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s ease;
      font-size: 14px;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
    }
    
    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-2px);
    }
    
    .btn-success {
      background: #10b981;
      color: white;
    }
    
    .btn-success:hover {
      background: #059669;
      transform: translateY(-2px);
    }
    
    .btn-secondary {
      background: #6b7280;
      color: white;
    }
    
    .btn-secondary:hover {
      background: #4b5563;
      transform: translateY(-2px);
    }
    
    .code-content {
      padding: 20px;
      max-height: 70vh;
      overflow: auto;
    }
    
    pre {
      margin: 0;
      font-family: 'JetBrains Mono', 'Cascadia Code', 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
      color: #cbd5e1;
    }
    
    .footer {
      text-align: center;
      padding: 20px;
      color: #94a3b8;
      font-size: 14px;
      border-top: 1px solid #334155;
      margin-top: 20px;
    }
    
    .line-numbers {
      color: #64748b;
      text-align: right;
      padding-right: 15px;
      user-select: none;
      border-right: 1px solid #334155;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .script-info {
        width: 100%;
      }
      
      .code-header {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
      }
      
      .code-actions {
        width: 100%;
        flex-wrap: wrap;
      }
      
      .btn {
        flex: 1;
        justify-content: center;
      }
    }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <h1>
          <i class="fas fa-file-code"></i>
          Script: ${name}
        </h1>
        <div class="script-info">
          <div class="info-item">
            <i class="fas fa-calendar"></i>
            ${new Date(script.createdAt).toLocaleString('vi-VN')}
          </div>
          <div class="info-item">
            <i class="fas fa-code"></i>
            ${formattedCode.length} ký tự
          </div>
          <div class="info-item">
            <i class="fas fa-shield-alt"></i>
            LuaProtector
          </div>
        </div>
      </div>
    </div>
    
    <div class="code-container">
      <div class="code-header">
        <h2>
          <i class="fas fa-terminal"></i>
          Nội dung Script
        </h2>
        <div class="code-actions">
          <button class="btn btn-primary" onclick="copyCode()">
            <i class="fas fa-copy"></i> Copy Code
          </button>
          <button class="btn btn-success" onclick="downloadCode()">
            <i class="fas fa-download"></i> Download
          </button>
          <button class="btn btn-secondary" onclick="goBack()">
            <i class="fas fa-arrow-left"></i> Quay lại
          </button>
        </div>
      </div>
      <div class="code-content">
        <pre id="code-content">${formattedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      </div>
    </div>
    
    <div class="footer">
      <p>LuaProtector Pro | Advanced Lua Obfuscation & Protection</p>
      <p>Script được tạo và bảo vệ bởi LuaProtector</p>
    </div>
  </div>
  
  <script>
    function copyCode() {
      const code = \`${formattedCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
      navigator.clipboard.writeText(code)
        .then(() => {
          alert('✅ Code đã được copy vào clipboard!');
        })
        .catch(err => {
          console.error('Copy failed:', err);
          alert('❌ Lỗi khi copy code');
        });
    }
    
    function downloadCode() {
      const code = \`${formattedCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '${name}.lua';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('✅ Script đã được tải xuống!');
    }
    
    function goBack() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.close();
      }
    }
    
    // Thêm line numbers
    function addLineNumbers() {
      const pre = document.getElementById('code-content');
      const lines = pre.innerHTML.split('\\n');
      let lineNumbers = '';
      for (let i = 1; i <= lines.length; i++) {
        lineNumbers += \`<div class="line-number">\${i}</div>\`;
      }
      
      const container = document.createElement('div');
      container.className = 'line-numbers';
      container.innerHTML = lineNumbers;
      
      const codeContainer = document.querySelector('.code-content');
      codeContainer.insertBefore(container, pre);
      container.style.height = pre.offsetHeight + 'px';
    }
    
    // Tự động thêm line numbers khi trang load
    setTimeout(addLineNumbers, 100);
    
    // Tô màu syntax đơn giản
    function highlightSyntax() {
      const codeElement = document.getElementById('code-content');
      let code = codeElement.innerHTML;
      
      // Highlight keywords Lua
      const keywords = [
        'function', 'end', 'if', 'then', 'else', 'elseif',
        'for', 'do', 'while', 'repeat', 'until', 'return',
        'local', 'nil', 'true', 'false', 'not', 'and', 'or',
        'break', 'in', 'require'
      ];
      
      keywords.forEach(keyword => {
        const regex = new RegExp(\`\\\\b\${keyword}\\\\b\`, 'g');
        code = code.replace(regex, \`<span style="color: #f472b6;">\${keyword}</span>\`);
      });
      
      // Highlight strings
      code = code.replace(/(['"])(.*?)\1/g, '<span style="color: #34d399;">$1$2$1</span>');
      
      // Highlight comments
      code = code.replace(/--.*$/gm, '<span style="color: #6b7280;">$&</span>');
      
      // Highlight numbers
      code = code.replace(/\b\d+\b/g, '<span style="color: #fbbf24;">$&</span>');
      
      codeElement.innerHTML = code;
    }
    
    setTimeout(highlightSyntax, 200);
  </script>
</body>
</html>
      `;
      
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } else {
      // Roblox client hoặc tool khác: trả về plain text
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.send(formattedCode);
    }
    
  } catch (err) {
    console.error("Error:", err.message);
    
    // Trả về error page cho web
    const userAgent = (req.headers["user-agent"] || "").toLowerCase();
    const isWebBrowser = userAgent.includes("mozilla") || 
                         userAgent.includes("chrome") || 
                         userAgent.includes("safari") ||
                         userAgent.includes("firefox") ||
                         userAgent.includes("edge");
    
    if (isWebBrowser) {
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              background: #0f172a;
              color: #e2e8f0;
              font-family: sans-serif;
              padding: 40px;
              text-align: center;
            }
            .error-box {
              background: #dc2626;
              padding: 20px;
              border-radius: 10px;
              margin: 20px auto;
              max-width: 500px;
            }
          </style>
        </head>
        <body>
          <h1>❌ Lỗi</h1>
          <div class="error-box">
            <p>Không thể tải script: ${err.message}</p>
          </div>
          <button onclick="window.history.back()">Quay lại</button>
        </body>
        </html>
      `);
    } else {
      res.status(500).send("❌ Lỗi lấy script");
    }
  }
}
[file content end]
