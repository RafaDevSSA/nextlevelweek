import express from 'express';
import path from 'path';
import routes from './routes/routes';
import pointsRoutes from './routes/points-routes';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', routes);
app.use('/points', pointsRoutes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3333, () => {
    console.log('i am here');
});

