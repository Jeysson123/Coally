import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import taskService from '../Services/TaskService';
import authService from '../Services/AuthService';

const router = express.Router();
const SECRET_KEY = '567312949ee76deb7fffc2db1daa46a5588df356e73447df411cffa5461190532e611e310a1d8173de5d1b4f67c0a1af5a4b52883a7f19650dbff7003916b97c'; // Replace with your actual secret key

router.use(express.json()); 

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for authentication
 *               password:
 *                 type: string
 *                 description: The password for authentication
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successfully generated token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token to use in subsequent requests
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid username or password
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
 *     description: Creates a task with the provided title and description.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - title
 *     responses:
 *       201:
 *         description: Successfully created task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 completed:
 *                   type: boolean
 *       401:
 *         description: Unauthorized, invalid token
 *       400:
 *         description: Validation error
 */
router.post('/api/tasks', authenticateToken, taskValidationRules, validate, asyncHandler(async (req: Request, res: Response) => {
  
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  // Create the task
  const task = await taskService.createTask(title, description);

  // Send response with created task
  res.status(201).json(task);
}));

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Retrieves all tasks, with optional status filtering.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, complete]
 *         description: Filter tasks by completion status
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   completed:
 *                     type: boolean
 *       401:
 *         description: Unauthorized, invalid token
 */
router.get('/api/tasks', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  let tasks = await taskService.getAllTasks();
  const { status } = req.query;

  // If a status is provided in the query, filter tasks based on it
  if (status) {
    if (status === 'pending') {
      tasks = tasks.filter((task) => !task.completed); 
    } else if (status === 'complete') {
      tasks = tasks.filter((task) => task.completed); 
    }
  }

  res.status(200).json(tasks);
}));

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Retrieves a specific task by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: The task object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 completed:
 *                   type: boolean
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized, invalid token
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
 *     description: Update the task's title and description by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successfully updated task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 completed:
 *                   type: boolean
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized, invalid token
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
 *     description: Deletes a task by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Successfully deleted task
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized, invalid token
 */
router.delete('/api/tasks/:id', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const taskDeleted = await taskService.deleteTask(req.params.id);
  if (!taskDeleted) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.status(200).json({ message: 'Task deleted successfully' });
}));

export default router;
