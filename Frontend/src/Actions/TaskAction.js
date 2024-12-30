export const SET_TASKS = 'SET_TASKS';
export const SET_ERROR = 'SET_ERROR';
export const SET_FILTER = 'SET_FILTER';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

export const setTasks = (tasks) => ({
  type: SET_TASKS,
  payload: tasks,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const setFilter = (filter) => ({
  type: SET_FILTER,
  payload: filter,
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});
