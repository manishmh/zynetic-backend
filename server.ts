import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import router from './routes'

dotenv.config();

const app: Application = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// all routes.
// main routes handled in /routes/index.ts
app.use(router)

app.get('/', (req: Request, res: Response) => {
    res.send("Home route");
})

const server = http.createServer(app);
const port = 8080;

const startServer = () => {
    try {
        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
};

startServer();

export default app;