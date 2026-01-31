import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listar.route.js';
import likeRouter from './routes/like.route.js';
import cookieParser from 'cookie-parser';
import notificationRoute from './routes/notification.route.js';
import messageRoute from './routes/message.route.js';
import statsRouter from './routes/stats.route.js';
import favoriteRouter from './routes/favorite.route.js';




//Diploy method
import path from 'path';

dotenv.config();


mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});


const __dirname = path.resolve();



const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
        console.log("Server is runnnig on port 3000");
    }

);
//Import Routers
app.use("/api/user", userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/like', likeRouter);
app.use('/api/notifications', notificationRoute);
app.use('/api/messages', messageRoute);
app.use('/api/stats', statsRouter);
app.use('/api/favorites', favoriteRouter);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});