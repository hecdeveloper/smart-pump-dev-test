import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../components/Profile';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

const mockUser = {
  name: { first: 'John', last: 'Doe' },
  email: 'john@example.com',
  balance: '$1,000',
  isActive: true,
  age: 30,
  eyeColor: 'blue',
  company: 'SMART Pump',
  phone: '123-456-7890',
  address: '123 Main St'
};

describe('Profile Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
    axios.get.mockResolvedValue({ data: mockUser });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders user profile data', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('handles logout', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(async () => {
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await fireEvent.click(logoutButton);
    });
    
    expect(localStorage.getItem('token')).toBeNull();
  });
});