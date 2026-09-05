import 'dotenv/config';

import express, { type Express, type Request, type Response } from 'express';
import productsRouter from './routes/products/products.route.ts';

const app: Express = express();

app.use(express.json());
app.use('/products', productsRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});