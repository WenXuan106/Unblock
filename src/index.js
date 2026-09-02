export default {
  async fetch(request) {
    return new Response(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Wen Browser</title>
  <style>
    body {
      margin: 0;
      background: #202124;
      color: white;
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    h1 {
      font-size: 40px;
    }
  </style>
</head>
<body>
  <h1>Wen Browser is working! 🎉</h1>
</body>
</html>
    `, {
      headers: {
        "Content-Type": "text/html; charset=UTF-8"
      }
    });
  }
};
