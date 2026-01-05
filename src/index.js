import 'dotenv/config';
import './config/db.js';
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import accountRoutes from './routes/account.routes.js';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3200, () => {
  console.log('Server running on port 3200');
});
