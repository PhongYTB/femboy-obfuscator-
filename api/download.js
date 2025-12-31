// Shared storage
const files = new Map();

module.exports = async (req, res) => {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).send('File ID is required');
  }
  
  const fileData = files.get(id);
  if (!fileData) {
    return res.status(404).send('File not found or expired');
  }
  
  // Set headers for file download
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `inline; filename="${fileData.fileName}"`);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Send the file content
  res.send(fileData.content);
  
  // Delete file after sending (one-time download)
  files.delete(id);
};
