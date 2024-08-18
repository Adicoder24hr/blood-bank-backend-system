import express from 'express'
import v1Router from './router'
import cookieParser from 'cookie-parser';

const app = express()

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1", v1Router);

export default app;