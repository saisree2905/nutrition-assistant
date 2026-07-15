import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand href="/" className="fw-bold">
          <i className="bi bi-apple me-2"></i>
          Nutrition Assistant
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              <>
                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link href="/features">Features</Nav.Link>
                <Nav.Link href="/contact">Contact</Nav.Link>
                <Nav.Link href="/login" className="ms-lg-3">
                  <button className="btn btn-primary btn-sm">Login</button>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Dropdown className="ms-lg-3">
                  <Dropdown.Toggle variant="light" id="user-menu">
                    <i className="bi bi-person-circle me-2"></i>
                    {user?.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item href="/profile">
                      <i className="bi bi-person me-2"></i>Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
            <Nav.Link onClick={toggleTheme} className="ms-lg-2">
              <i className={`bi ${theme === 'light' ? 'bi-moon' : 'bi-sun'}`}></i>
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
