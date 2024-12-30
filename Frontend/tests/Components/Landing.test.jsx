import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import Landing from '../../src/Components/Landing/Landing';
import axios from 'axios';
import { vi } from 'vitest';
import { createStore } from 'redux';

const mockStore = createStore(() => ({
  tasksData: {
    tasks: [
      { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
      { id: 2, title: 'Task 2', description: 'Description 2', completed: true },
      { id: 3, title: 'Task 3', description: 'Description 3', completed: false },
      { id: 4, title: 'Task 4', description: 'Description 4', completed: true },
      { id: 5, title: 'Task 5', description: 'Description 5', completed: false },
    ],
    filter: 'all',
  },
}));

vi.mock('axios');

describe('Landing Component', () => {
  it('renders the correct number of tasks after fetching data', async () => {
    axios.post.mockResolvedValue({
      data: { token: 'mockedToken' },
    });

    axios.get.mockResolvedValue({
      data: [
        { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
        { id: 2, title: 'Task 2', description: 'Description 2', completed: true },
        { id: 3, title: 'Task 3', description: 'Description 3', completed: false },
        { id: 4, title: 'Task 4', description: 'Description 4', completed: true },
        { id: 5, title: 'Task 5', description: 'Description 5', completed: false },
      ],
    });

    render(
      <Provider store={mockStore}>
        <Landing />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Task/i)).toHaveLength(3);
    });
  });
});
