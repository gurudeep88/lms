import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { httpResponse } from './helper/api';
import { createError } from './helper/error';
import { user, course, order, notification, analytics, layout } from './routes/index.route';
const { ORIGIN } = process.env;

export const app = express();

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

app.use(cors({
    origin: ORIGIN
}))

// routes
app.use('/api/v1', user);
app.use('/api/v1', course);
app.use('/api/v1', order);
app.use('/api/v1', notification);
app.use('/api/v1', analytics);
app.use('/api/v1', layout);


//testing api
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
     httpResponse(res, 200, {
        success: true,
        message: "API is working"
    })
})

//unknown routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = createError(`Route ${req.originalUrl} not found`, 404);
    next(err);
})