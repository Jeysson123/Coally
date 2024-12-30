import request from 'supertest';
import express from 'express';
import router from '../Controllers/TaskController';
import taskService from '../Services/TaskService';
import authService from '../Services/AuthService';
import jwt from 'jsonwebtoken';

jest.mock('../Services/TaskService');
jest.mock('../Services/AuthService');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(router);

describe('Routes', () => {
  const validToken = 'valid-token';
  const mockJwtVerify = jest.fn();
  const mockGenerateToken = jest.fn();

  beforeAll(() => {
    (authService.generateToken as jest.Mock).mockImplementation(() => validToken);
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      if (token === validToken) {
        callback(null, { username: 'testuser' });
      } else {
        callback(new Error('Invalid token'));
      }
    });
  });

  describe('POST /auth/token', () => {
    it('should return a token for valid credentials', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe(validToken);
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({ username: 'wronguser', password: 'wrongpass' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid username or password');
    });
  });

  describe('POST /tasks', () => {
    it('should create a task with valid token and input', async () => {
      (taskService.createTask as jest.Mock).mockResolvedValue({
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
      });

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'Test Task', description: 'Test Description' });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Test Task');
    });

    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task', description: 'Test Description' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks with a valid token', async () => {
      (taskService.getAllTasks as jest.Mock).mockResolvedValue([
        { id: '1', title: 'Task 1', description: 'Description 1' },
        { id: '2', title: 'Task 2', description: 'Description 2' },
      ]);

      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a task with valid ID and token', async () => {
      (taskService.getTaskById as jest.Mock).mockResolvedValue({
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
      });

      const response = await request(app)
        .get('/tasks/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Task 1');
    });

    it('should return 404 for invalid task ID', async () => {
      (taskService.getTaskById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/tasks/999')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task with valid ID and token', async () => {
      (taskService.updateTask as jest.Mock).mockResolvedValue({
        id: '1',
        title: 'Updated Task',
        description: 'Updated Description',
      });

      const response = await request(app)
        .put('/tasks/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'Updated Task', description: 'Updated Description' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Task');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task with valid ID and token', async () => {
      (taskService.deleteTask as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .delete('/tasks/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted');
    });

    it('should return 404 for invalid task ID', async () => {
      (taskService.deleteTask as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .delete('/tasks/999')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });
  });
});
