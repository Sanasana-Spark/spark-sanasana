import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ListItemWithLink from '../components/layout/ListItemWithLink';

// Create a basic theme for testing
const theme = createTheme();

// Helper component to wrap with necessary providers
const TestWrapper = ({ children, initialRoute = '/' }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div>
          {children}
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('ListItemWithLink', () => {
  test('renders list item with correct label and navigation link', () => {
    const mockIcon = <span data-testid="test-icon">Icon</span>;
    
    render(
      <TestWrapper>
        <ListItemWithLink 
          label="Dashboard" 
          icon={mockIcon} 
          to="/" 
        />
      </TestWrapper>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });

  test('applies active class when link matches current route', () => {
    const mockIcon = <span data-testid="test-icon">Icon</span>;
    
    // Set initial URL to match the link
    window.history.pushState({}, 'Dashboard', '/');
    
    render(
      <TestWrapper initialRoute="/">
        <ListItemWithLink 
          label="Dashboard" 
          icon={mockIcon} 
          to="/" 
        />
      </TestWrapper>
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass('active');
  });
});