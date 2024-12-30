import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Task from '../../src/Components/Task/Task';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import '@testing-library/jest-dom'; // Ensure this is imported

const mockStore = createStore(() => ({
  tasksData: {
    tasks: [
      { id: 1, title: 'Test Task', description: 'This is a test task', completed: false },
    ],
    filter: 'all',
  },
}));

vi.mock('axios');

describe('Task Component', () => {
  const mockOnStatusChange = vi.fn();

  test('renders task and toggles status', () => {
    const task = {
      id: 1,
      title: "Test Task",
      description: "This is a test task",
      createdAt: new Date().toISOString(),
      completed: false,
    };

    render(
      <Provider store={mockStore}>
        <Task task={task} onStatusChange={mockOnStatusChange} />
      </Provider>
    );

    // Make sure the task and checkbox exist
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
    const toggle = screen.getByRole('checkbox');
    expect(toggle).toBeInTheDocument();  // Ensure checkbox is present

    fireEvent.click(toggle);

    expect(mockOnStatusChange).toHaveBeenCalledWith(1, true);
  });
});
