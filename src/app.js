import express from 'express';
import { initMongoDB } from './config/dbConfig.js';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import sessionRouter from './routes/sessionRouter.js';
import passport from './passport/passportConfig.js';

const app = express();

// Iniciamos la conexión con MongoDB
initMongoDB();

// Middlewares incorporados de Express
app.use(express.json()); // Formatea los cuerpos json de peticiones entrantes.
app.use(express.urlencoded({extended: true})); // Formatea query params de URLs para peticiones entrantes.
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionRouter);
app.use('/api/users', userRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Start Server in Port ${PORT}`);
});
