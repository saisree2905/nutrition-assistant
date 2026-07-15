import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Form, Row, Col, Modal } from 'react-bootstrap';
import { useNotification } from '../hooks/useNotification';
import { clientService } from '../services/clientService';
import { userService } from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';

const Clients = () => {
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    targetCalories: '',
    targetProtein: '',
    targetCarbs: '',
    targetFat: '',
    notes: '',
  });

  useEffect(() => {
    fetchClients();
  }, [page, search]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await clientService.getAllClients(page, 10, search);
      setClients(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(id);
        success('Client deleted successfully');
        fetchClients();
      } catch (err) {
        error(err.response?.data?.message || 'Failed to delete client');
      }
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setFormData({
      targetCalories: client.targetCalories,
      targetProtein: client.targetProtein,
      targetCarbs: client.targetCarbs,
      targetFat: client.targetFat,
      notes: client.notes || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedClient) return;

    try {
      await clientService.updateClient(selectedClient._id, formData);
      success('Client updated successfully');
      setShowModal(false);
      fetchClients();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update client');
    }
  };

  if (loading && clients.length === 0) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Clients</h2>
        <Button variant="primary" href="/meal-plans">
          <i className="bi bi-plus me-2"></i>New Meal Plan
        </Button>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form.Control
            placeholder="Search clients by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        {clients.length > 0 ? (
          <>
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Weight</th>
                    <th>Target Calories</th>
                    <th>Protein</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client._id}>
                      <td className="fw-bold">{client.userId?.name}</td>
                      <td>{client.userId?.email}</td>
                      <td>{client.userId?.weight} kg</td>
                      <td>{client.targetCalories}</td>
                      <td>{client.targetProtein}g</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          href={`/clients/${client._id}`}
                          className="me-2"
                        >
                          View
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(client)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(client._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Card.Footer>
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    variant="outline-secondary"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="align-self-center">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline-secondary"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </Card.Footer>
            )}
          </>
        ) : (
          <Card.Body className="text-center py-5">
            <p className="text-muted">No clients found</p>
          </Card.Body>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Target Calories</Form.Label>
              <Form.Control
                type="number"
                value={formData.targetCalories}
                onChange={(e) => setFormData({...formData, targetCalories: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Target Protein (g)</Form.Label>
              <Form.Control
                type="number"
                value={formData.targetProtein}
                onChange={(e) => setFormData({...formData, targetProtein: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Target Carbs (g)</Form.Label>
              <Form.Control
                type="number"
                value={formData.targetCarbs}
                onChange={(e) => setFormData({...formData, targetCarbs: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Target Fat (g)</Form.Label>
              <Form.Control
                type="number"
                value={formData.targetFat}
                onChange={(e) => setFormData({...formData, targetFat: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Clients;
