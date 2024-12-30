import mongoose from 'mongoose';
import taskService from '../Services/TaskService';
import { Task } from '../Models/Task';
import Connection from '../Configuration/Connection';

jest.mock('mongoose', () => ({
  connect: jest.fn(), 
  connection: {
    close: jest.fn().mockResolvedValue(true), 
  },
}));

jest.mock('../Configuration/Connection', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true), // Mock the connection function
}));

jest.mock('../Models/Task', () => ({
  Task: {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    prototype: {
      save: jest.fn(),
    },
  },
}));

beforeAll(async () => {
  await Connection();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('TaskService', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should create a task with valid input', async () => {
    const mockSave = jest.fn().mockResolvedValue({
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
    });
    Task.prototype.save = mockSave;

    const task = await taskService.createTask('Test Task', 'Test Description');
    
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(task.id).toBe('1');
    expect(task.title).toBe('Test Task');
  });

  it('should return all tasks', async () => {
    const mockFind = jest.fn().mockResolvedValue([
      { id: '1', title: 'Task 1', description: 'Description 1' },
      { id: '2', title: 'Task 2', description: 'Description 2' },
    ]);
    Task.find = mockFind;

    const tasks = await taskService.getAllTasks();

    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe('Task 1');
  });

  it('should return a task by ID', async () => {
    const mockFindOne = jest.fn().mockResolvedValue({
      id: '1', title: 'Task 1', description: 'Description 1',
    });
    Task.findOne = mockFindOne;

    const task = await taskService.getTaskById('1');

    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(task).not.toBeNull();
    expect(task?.title).toBe('Task 1');
  });

  it('should return null for an invalid task ID', async () => {
    const mockFindOne = jest.fn().mockResolvedValue(null);
    Task.findOne = mockFindOne;

    const task = await taskService.getTaskById('999');

    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(task).toBeNull();
  });

  it('should update a task', async () => {
    const mockFindOneAndUpdate = jest.fn().mockResolvedValue({
      id: '1',
      title: 'Updated Task',
      description: 'Updated Description',
    });
    Task.findOneAndUpdate = mockFindOneAndUpdate;

    const updatedTask = await taskService.updateTask('1', {
      title: 'Updated Task',
      description: 'Updated Description',
    });

    expect(mockFindOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(updatedTask?.title).toBe('Updated Task');
  });

  it('should delete a task', async () => {
    const mockFindOneAndDelete = jest.fn().mockResolvedValue({
      id: '1',
      title: 'Deleted Task',
      description: 'Deleted Description',
    });
    Task.findOneAndDelete = mockFindOneAndDelete;

    const deletedTask = await taskService.deleteTask('1');

    expect(mockFindOneAndDelete).toHaveBeenCalledTimes(1);
    expect(deletedTask?.title).toBe('Deleted Task');
  });
});
