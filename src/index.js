const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/routes.js');
const aboutRouter = require('./routes/About.js');


app.use(cors()); // Aktiviere CORS

// Andere benötigte Konfigurationen und Middleware...
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/', router);
app.use('/FAQs', router);
app.use('/home', router);
app.use('/login', router);
app.use('/rating', router);
app.use('/user', router);
app.use('/about', aboutRouter);

const port = 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
