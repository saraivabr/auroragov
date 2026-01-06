import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/dashboard/Header';

describe('Header Component', () => {
  it('should render the Aurora Gov logo', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const logoText = screen.getByText(/Aurora Gov/i);
    expect(logoText).toBeInTheDocument();
  });

  it('should display security badges', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Check for encryption status
    const encryptionBadge = screen.getByText(/Criptografia Ativa/i);
    expect(encryptionBadge).toBeInTheDocument();
  });

  it('should show LGPD and ISO badges', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const lgpdBadge = screen.getByText(/LGPD/i);
    const isoBadge = screen.getByText(/ISO 27001/i);

    expect(lgpdBadge).toBeInTheDocument();
    expect(isoBadge).toBeInTheDocument();
  });

  it('should display session timer', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Session timer should be visible
    const timer = screen.getByText(/45:00/i);
    expect(timer).toBeInTheDocument();
  });

  it('should show online status', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const onlineStatus = screen.getByText(/Online/i);
    expect(onlineStatus).toBeInTheDocument();
  });
});
