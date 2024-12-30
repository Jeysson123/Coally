import { Task, ITask } from '../Models/Task';

class TaskService {

  async createTask(title: string, description?: string): Promise<ITask> {
    try {
      const task = new Task({ title, description });
      await task.save();
      return task;
    } catch (err) {
      throw new Error('Error creating task: ' + err);
    }
  }

  async getAllTasks(): Promise<ITask[]> {
    try {
      const tasks = await Task.find();
      return tasks;
    } catch (err) {
      throw new Error('Error fetching tasks: ' + err);
    }
  }

  async getTaskById(id: string): Promise<ITask | null> {
    try {
      const task = await Task.findOne({ id: Number(id) });
      return task;
    } catch (err) {
      throw new Error('Error fetching task: ' + err);
    }
  }

  async updateTask(id: string, updatedFields: Partial<ITask>): Promise<ITask | null> {
    try {
      // Use findOneAndUpdate with the 'id' field instead of '_id'
      const task = await Task.findOneAndUpdate(
        { id: Number(id) }, // query by the 'id' field
        updatedFields, 
        { new: true } // return the updated task
      );
      return task;
    } catch (err) {
      throw new Error('Error updating task: ' + err);
    }
  }
  
  async deleteTask(id: string): Promise<ITask | null> {
    try {
      // Use findOneAndDelete with the 'id' field instead of '_id'
      const task = await Task.findOneAndDelete({ id: Number(id) }); 
      return task;
    } catch (err) {
      throw new Error('Error deleting task: ' + err);
    }
  }  
}

export default new TaskService();
