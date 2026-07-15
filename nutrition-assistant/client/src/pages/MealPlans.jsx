import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col, Modal, Badge } from 'react-bootstrap';
import { useNotification } from '../hooks/useNotification';
import { mealPlanService } from '../services/mealPlanService';
import { clientService } from '../services/clientService';
import MealCard from '../components/MealCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MealPlans = () => {
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(true);
  const [mealPlans, setMealPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedClient, setSelectedClient] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
    totalCalories: '',
    totalProtein: '',
    totalCarbs: '',
    totalFat: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchClients();
    fetchMealPlans();
  }, [selectedClient, page]);

  const fetchClients = async () => {
    try {
      const response = await clientService.getAllClients(1, 100);
      setClients(response.data.data);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load clients');
    }
  };

  const fetchMealPlans = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (selectedClient) params.clientId = selectedClient;

      const response = await mealPlanService.getMealPlans(params);
      setMealPlans(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to load meal plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      ...formData,
      clientId: selectedClient || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.clientId || !formData.totalCalories) {
      error('Please fill all required fields');
      return;
    }

    try {
      await mealPlanService.createMealPlan({
        ...formData,
        totalCalories: parseInt(formData.totalCalories),
        totalProtein: parseInt(formData.totalProtein),
        totalCarbs: parseInt(formData.totalCarbs),
        totalFat: parseInt(formData.totalFat),
      });
      success('Meal plan created successfully');
      setShowModal(false);
      setFormData({
        clientId: '',
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
        totalCalories: '',
        totalProtein: '',
        totalCarbs: '',
        totalFat: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      fetchMealPlans();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create meal plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this meal plan?')) {
      try {
        await mealPlanService.deleteMealPlan(id);
        success('Meal plan deleted');
        fetchMealPlans();
      } catch (err) {
        error(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  if (loading && mealPlans.length === 0) return <LoadingSpinner />;

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Meal Plans</h2>
        <Button variant="primary" onClick={handleCreate}>
          <i className="bi bi-plus me-2"></i>Create Meal Plan
        </Button>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>Filter by Client</Form.Label>
            <Form.Select
              value={selectedClient}
              onChange={(e) => {
                setSelectedClient(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Clients</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>
                  {client.userId?.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {mealPlans.length > 0 ? (
        <>
          {mealPlans.map(plan => (
            <MealCard
              key={plan._id}
              meal={plan}
              onEdit={() => {}}
              onDelete={() => handleDelete(plan._id)}
            />
          ))}

          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-4">
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
          )}
        </>
      ) : (
        <Card className="shadow-sm">
          <Card.Body className="text-center py-5">
            <p className="text-muted">No meal plans found</p>
          </Card.Body>
        </Card>
      )}

      {/* Create Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Meal Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Select
                value={formData.clientId}
                onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                required
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.userId?.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Total Calories</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.totalCalories}
                    onChange={(e) => setFormData({...formData, totalCalories: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Protein (g)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.totalProtein}
                    onChange={(e) => setFormData({...formData, totalProtein: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Carbs (g)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.totalCarbs}
                    onChange={(e) => setFormData({...formData, totalCarbs: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Fat (g)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.totalFat}
                    onChange={(e) => setFormData({...formData, totalFat: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

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
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MealPlans;
