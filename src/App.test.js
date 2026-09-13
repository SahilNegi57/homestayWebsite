import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the homestay app with hero content', () => {
  render(<App />);
  const brandElement = screen.getAllByText(/shivalik ice hills/i)[0];
  expect(brandElement).toBeInTheDocument();
});
