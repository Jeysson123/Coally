import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    id: { type: Number, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'Task' }
);

taskSchema.pre('save', async function (next) {
  const task = this as ITask;

  if (!task.isNew) return next(); 

  try {
    // Get the highest current id in the database
    const lastTask = await Task.findOne().sort({ id: -1 }).select('id');
    // If a task exists, increment the id based on the last task's id
    task.id = lastTask ? lastTask.id + 1 : 1;  // Start from 1 if no tasks exist

    next();
  } catch (err:any) {
    next(err);
  }
});

taskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
    return ret;
  },
});

export const Task = mongoose.model<ITask>('Task', taskSchema);
