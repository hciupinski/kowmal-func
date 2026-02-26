import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('./components/Products/Products', () => ({
  default: () => <div>Products</div>,
}));

test('renders main nav entries', () => {
  render(<App />);
  expect(screen.getByText(/gallery/i)).toBeInTheDocument();
  expect(screen.getByText(/contact/i)).toBeInTheDocument();
});
