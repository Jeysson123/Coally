import { combineReducers } from 'redux';
import taskReducer from './TaskReducer';

const rootReducer = combineReducers({
  tasksData: taskReducer,
});

export default rootReducer;
