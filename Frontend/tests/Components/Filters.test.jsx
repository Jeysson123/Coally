import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Filters from './../../src/Components/Filters/Filters';

describe('Filters Component', () => {
  const mockOnFilterChange = vi.fn();

  test('renders filter buttons and applies "pending" filter', () => {
    render(<Filters onFilterChange={mockOnFilterChange} filter="pending" />);

    expect(screen.getByText('Pending')).toBeTruthy();
    expect(screen.getByText('Completed')).toBeTruthy();
    expect(screen.getByText('All')).toBeTruthy();

    const pendingButton = screen.getByText('Pending');
    fireEvent.click(pendingButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('pending');
  });
});
