import { SET_TASKS, SET_ERROR, SET_FILTER, SET_CURRENT_PAGE } from '../Actions/TaskAction';

const initialState = {
  tasks: [],
  error: null,
  filter: 'all',
  currentPage: 0,
};

const TaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TASKS:
      return { ...state, tasks: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case SET_FILTER:
      return { ...state, filter: action.payload };
    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
};

export default TaskReducer;
