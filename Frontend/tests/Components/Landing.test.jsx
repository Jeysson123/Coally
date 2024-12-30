import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Landing from '../../src/Components/Landing/Landing';
import axios from 'axios';

// Mock axios.post and axios.get for the test
jest.mock('axios');

describe('Landing Component', () => {
  it('renders tasks after fetching data', async () => {
    // Mock axios.post to return a token
    axios.post.mockResolvedValue({
      data: { token: 'mockedToken' },
    });

    // Mock axios.get to return task data after successful token request
    axios.get.mockResolvedValue({
      data: [
        { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
        { id: 2, title: 'Task 2', description: 'Description 2', completed: true },
        { id: 3, title: 'Task 3', description: 'Description 3', completed: false },
        { id: 4, title: 'Task 4', description: 'Description 4', completed: true },
        { id: 5, title: 'Task 5', description: 'Description 5', completed: false },
      ],
    });

    // Render the Landing component
    render(<Landing />);

    // Wait for the tasks to appear in the document
    await waitFor(() => {
      expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Task 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Task 3/i)).toBeInTheDocument();
      expect(screen.getByText(/Task 4/i)).toBeInTheDocument();
      expect(screen.getByText(/Task 5/i)).toBeInTheDocument();
    });

    // Check for the pagination buttons
    expect(screen.getByText('>')).toBeInTheDocument();
    expect(screen.getByText('<')).toBeInTheDocument();
  });

  it('shows error message if tasks fetch fails', async () => {
    // Mock axios.post to return a token
    axios.post.mockResolvedValue({
      data: { token: 'mockedToken' },
    });

    // Mock axios.get to simulate an error
    axios.get.mockRejectedValue(new Error('Failed to fetch tasks'));

    // Render the Landing component
    render(<Landing />);

    // Wait for the error message to appear in the document
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
    });
  });
});
