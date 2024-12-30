import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';  // Import cors
import connectToDb from './Configuration/Connection';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import taskRoutes from './Controllers/TaskController';  

const app = express();

const PORT = 5000;

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Task API',
      description: 'Task Management API',
      version: '1.0.0',
    },
    basePath: '/api',
  },
  apis: ['./src/Controllers/*.ts'],  
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(cors({
  origin: 'https://coally-frontend.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use('/api/tasks/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

connectToDb();

app.use(taskRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
