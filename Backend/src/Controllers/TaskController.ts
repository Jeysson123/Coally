import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import taskService from '../Services/TaskService';
import authService from '../Services/AuthService';

const router = express.Router();
const SECRET_KEY = '567312949ee76deb7fffc2db1daa46a5588df356e73447df411cffa5461190532e611e310a1d8173de5d1b4f67c0a1af5a4b52883a7f19650dbff7003916b97c'; // Replace with your actual secret key

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction): any => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    (req as any).user = user;
    next();
  });
};

const taskValidationRules = [
  body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
  body('description').optional().isString().withMessage('Description must be a string if provided'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean if provided'),
];

// Middleware to check validation results
const validate: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Generate a new bearer token
 *     description: Returns a JWT token for use in authentication.
 */
router.post('/api/auth/token', asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'testuser' && password === 'password123') {
    const payload = { username };
    const token = authService.generateToken(payload);
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: 'Invalid username or password' });
}));

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 */
router.post('/api/tasks', authenticateToken, taskValidationRules, validate, asyncHandler(async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const task = await taskService.createTask(title, description);
  res.status(201).json(task);
}));

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 */
router.get('/api/tasks', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  let tasks = await taskService.getAllTasks();
  const { status } = req.query;

  // If a status is provided in the query, filter tasks based on it
  if (status) {
    if (status === 'pending') {
      tasks = tasks.filter((task) => !task.completed); // Assuming `completed` is a boolean field
    } else if (status === 'complete') {
      tasks = tasks.filter((task) => task.completed); // Assuming `completed` is a boolean field
    }
  }

  res.status(200).json(tasks);
}));


/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 */
router.get('/api/tasks/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.status(200).json(task);
}));

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 */
router.put('/api/tasks/:id', authenticateToken, taskValidationRules, validate, asyncHandler(async (req: Request, res: Response) => {
  const updatedTask = await taskService.updateTask(req.params.id, req.body);
  if (!updatedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.status(200).json(updatedTask);
}));

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 */
router.delete('/api/tasks/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const deletedTask = await taskService.deleteTask(req.params.id);
  if (!deletedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.status(200).json({ message: 'Task deleted' });
}));

export default router;
