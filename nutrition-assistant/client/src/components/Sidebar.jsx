import React from 'react';
import { Nav, Offcanvas } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';

const Sidebar = ({ show, handleClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const menuItems = {
    user: [
      { label: 'Dashboard', href: '/dashboard', icon: 'bi-speedometer2' },
      { label: 'Profile', href: '/profile', icon: 'bi-person' },
      { label: 'Meal Plans', href: '/meal-plans', icon: 'bi-egg' },
      { label: 'Progress', href: '/progress', icon: 'bi-graph-up' },
      { label: 'Analytics', href: '/analytics', icon: 'bi-bar-chart' },
    ],
    dietitian: [
      { label: 'Dashboard', href: '/dashboard', icon: 'bi-speedometer2' },
      { label: 'Clients', href: '/clients', icon: 'bi-people' },
      { label: 'Meal Plans', href: '/meal-plans', icon: 'bi-egg' },
      { label: 'Progress', href: '/progress', icon: 'bi-graph-up' },
      { label: 'Profile', href: '/profile', icon: 'bi-person' },
    ],
    admin: [
      { label: 'Dashboard', href: '/dashboard', icon: 'bi-speedometer2' },
      { label: 'Users', href: '/admin/users', icon: 'bi-people' },
      { label: 'Dietitians', href: '/admin/dietitians', icon: 'bi-person-check' },
      { label: 'Analytics', href: '/analytics', icon: 'bi-bar-chart' },
    ],
  };

  const items = menuItems[user?.role] || [];

  return (
    <Offcanvas show={show} onHide={handleClose} responsive="lg">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="flex-column">
          {items.map((item) => (
            <Nav.Link
              key={item.href}
              href={item.href}
              active={isActive(item.href)}
              className="d-flex align-items-center"
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;
