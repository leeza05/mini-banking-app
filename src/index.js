import 'dotenv/config';
import './config/db.js';

import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3200, () => {
  console.log('Server running on port 3200');
});
