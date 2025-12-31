const { v4: uuidv4 } = require('uuid');

// Lưu file tạm thời (trong production dùng database/cloud storage)
const files = new Map();

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Invalid content type' });
    }
    
    // Parse form data từ Vercel
    const boundary = contentType.split('boundary=')[1];
    const chunks = [];
    
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    
    const buffer = Buffer.concat(chunks);
    const body = buffer.toString();
    
    // Parse các phần
    const parts = body.split(`--${boundary}`);
    let fileName = '';
    let fileContent = '';
    let scriptName = '';
    
    for (const part of parts) {
      if (part.includes('Content-Disposition')) {
        const lines = part.split('\r\n');
        
        for (const line of lines) {
          if (line.includes('filename="')) {
            const match = line.match(/filename="(.+?)"/);
            if (match) fileName = match[1];
          }
          
          if (line.includes('name="scriptName"')) {
            const contentMatch = part.match(/\r\n\r\n(.+)/s);
            if (contentMatch) {
              scriptName = contentMatch[1].trim();
              // Remove trailing boundary
              scriptName = scriptName.replace(`--${boundary}--`, '').trim();
            }
          }
          
          if (line.includes('name="file"')) {
            const contentMatch = part.match(/\r\n\r\n(.+)/s);
            if (contentMatch) {
              fileContent = contentMatch[1].trim();
              // Remove trailing boundary
              fileContent = fileContent.replace(`--${boundary}--`, '').trim();
            }
          }
        }
      }
    }
    
    // Validate
    if (!fileName) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Check file extension
    const validExtensions = ['.txt', '.lua', '.css', '.html', '.js'];
    const fileExt = fileName.toLowerCase().endsWith('.txt') ? '.txt' :
                   fileName.toLowerCase().endsWith('.lua') ? '.lua' :
                   fileName.toLowerCase().endsWith('.css') ? '.css' :
                   fileName.toLowerCase().endsWith('.html') ? '.html' :
                   fileName.toLowerCase().endsWith('.js') ? '.js' : '';
    
    if (!validExtensions.includes(fileExt)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Allowed: .txt, .lua, .css, .html, .js' 
      });
    }
    
    // Check file size (10MB limit on Vercel)
    if (Buffer.byteLength(fileContent) > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large (max 10MB)' });
    }
    
    // Validate script name
    if (!scriptName || !/^[a-zA-Z0-9]{1,15}$/.test(scriptName)) {
      return res.status(400).json({ 
        error: 'Invalid script name (1-15 alphanumeric characters)' 
      });
    }
    
    // Generate unique ID
    const fileId = uuidv4();
    
    // Store file temporarily
    files.set(fileId, {
      id: fileId,
      fileName,
      scriptName,
      content: fileContent,
      uploadTime: Date.now(),
      expiresAt: Date.now() + (3600 * 1000) // 1 hour
    });
    
    // Auto cleanup after 1 hour
    setTimeout(() => {
      files.delete(fileId);
    }, 3600 * 1000);
    
    return res.status(200).json({
      success: true,
      fileId: fileId,
      message: 'File uploaded successfully',
      scriptName: scriptName
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};
