const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000; // You can change this to any port you prefer

const server = http.createServer((req, res) => {
  // Determine the file path based on the URL
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html'; // Serve index.html as the default page
  }

  // Get the file extension to set the correct content type
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
  }

  // Read the file and send the response
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('File not found');
      } else {
        // Server error
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      // Success
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*' // Allow requests from any origin
      });
      res.end(content, 'utf-8');
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
