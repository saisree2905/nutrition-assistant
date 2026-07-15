import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const MealCard = ({ meal, onEdit, onDelete }) => {
  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="mb-2">{meal.date ? new Date(meal.date).toLocaleDateString() : 'Meal Plan'}</Card.Title>
          </div>
          <div>
            {onEdit && (
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={onEdit}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={onDelete}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-2">
              <strong>Nutrition Info:</strong>
            </div>
            <div className="mb-1">
              <Badge bg="info">Calories: {meal.totalCalories || 0}</Badge>
            </div>
            <div className="mb-1">
              <Badge bg="success">Protein: {meal.totalProtein || 0}g</Badge>
            </div>
            <div className="mb-1">
              <Badge bg="warning">Carbs: {meal.totalCarbs || 0}g</Badge>
            </div>
            <div className="mb-1">
              <Badge bg="danger">Fat: {meal.totalFat || 0}g</Badge>
            </div>
          </div>
        </div>

        {meal.notes && (
          <div className="mt-3">
            <strong>Notes:</strong>
            <p className="text-muted mt-1">{meal.notes}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default MealCard;
