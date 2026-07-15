# Nutrition Assistant API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses follow this format:
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Authentication Endpoints

### Register
- **URL**: `POST /auth/register`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```
- **Response**: User object with JWT token

### Login
- **URL**: `POST /auth/login`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**: User object with JWT token

### Logout
- **URL**: `POST /auth/logout`
- **Auth**: Required
- **Body**:
```json
{
  "refreshToken": "token"
}
```

### Forgot Password
- **URL**: `POST /auth/forgot-password`
- **Body**:
```json
{
  "email": "john@example.com"
}
```

### Reset Password
- **URL**: `POST /auth/reset-password/:token`
- **Body**:
```json
{
  "password": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

### Refresh Token
- **URL**: `POST /auth/refresh-token`
- **Body**:
```json
{
  "refreshToken": "token"
}
```

---

## User Endpoints

### Get Profile
- **URL**: `GET /users/profile`
- **Auth**: Required
- **Response**: User object

### Update Profile
- **URL**: `PUT /users/profile`
- **Auth**: Required
- **Body**:
```json
{
  "name": "John Doe",
  "phone": "555-1234",
  "gender": "male",
  "age": 30,
  "height": 180,
  "weight": 75,
  "activityLevel": "moderate",
  "allergies": ["peanuts", "milk"],
  "goals": ["weight loss", "better energy"]
}
```

### Upload Profile Image
- **URL**: `POST /users/upload-image`
- **Auth**: Required
- **Body**: FormData with `image` file
- **Response**: { profileImage: "url" }

### Get User Stats
- **URL**: `GET /users/stats`
- **Auth**: Required
- **Response**: User stats with progress data

### Change Password
- **URL**: `PUT /users/change-password`
- **Auth**: Required
- **Body**:
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123"
}
```

---

## Client Endpoints

### Get All Clients
- **URL**: `GET /clients`
- **Auth**: Required (Dietitian/Admin)
- **Query Params**: page, limit, search
- **Response**: Array of clients with pagination

### Get Client Details
- **URL**: `GET /clients/:id`
- **Auth**: Required (Dietitian/Admin)
- **Response**: Client object with progress summary

### Create Client
- **URL**: `POST /clients`
- **Auth**: Required (Dietitian/Admin)
- **Body**:
```json
{
  "userId": "userId",
  "targetCalories": 2000,
  "targetProtein": 150,
  "targetCarbs": 200,
  "targetFat": 65,
  "notes": "Client notes"
}
```

### Update Client
- **URL**: `PUT /clients/:id`
- **Auth**: Required (Dietitian/Admin)
- **Body**:
```json
{
  "targetCalories": 2000,
  "targetProtein": 150,
  "targetCarbs": 200,
  "targetFat": 65,
  "notes": "Updated notes"
}
```

### Delete Client
- **URL**: `DELETE /clients/:id`
- **Auth**: Required (Dietitian/Admin)

---

## Meal Plan Endpoints

### Get Meal Plans
- **URL**: `GET /meal-plans`
- **Auth**: Required
- **Query Params**: clientId, page, limit, startDate, endDate
- **Response**: Array of meal plans with pagination

### Get Meal Plan Details
- **URL**: `GET /meal-plans/:id`
- **Auth**: Required
- **Response**: Meal plan object

### Create Meal Plan
- **URL**: `POST /meal-plans`
- **Auth**: Required (Dietitian/Admin)
- **Body**:
```json
{
  "clientId": "clientId",
  "breakfast": [],
  "lunch": [],
  "dinner": [],
  "snacks": [],
  "totalCalories": 2000,
  "totalProtein": 150,
  "totalCarbs": 200,
  "totalFat": 65,
  "date": "2024-01-15",
  "notes": "Plan notes"
}
```

### Update Meal Plan
- **URL**: `PUT /meal-plans/:id`
- **Auth**: Required (Dietitian/Admin)

### Delete Meal Plan
- **URL**: `DELETE /meal-plans/:id`
- **Auth**: Required (Dietitian/Admin)

---

## Progress Endpoints

### Get Progress Records
- **URL**: `GET /progress`
- **Auth**: Required
- **Query Params**: clientId, page, limit, startDate, endDate
- **Response**: Array of progress records with pagination

### Get Progress Details
- **URL**: `GET /progress/:id`
- **Auth**: Required
- **Response**: Progress record object

### Create Progress
- **URL**: `POST /progress`
- **Auth**: Required
- **Body**:
```json
{
  "clientId": "clientId",
  "weight": 75,
  "caloriesConsumed": 1850,
  "waterIntake": 2.5,
  "exerciseMinutes": 30,
  "notes": "Progress notes",
  "date": "2024-01-15"
}
```

### Update Progress
- **URL**: `PUT /progress/:id`
- **Auth**: Required
- **Body**: Partial update with same fields

### Delete Progress
- **URL**: `DELETE /progress/:id`
- **Auth**: Required

### Get Progress Stats
- **URL**: `GET /progress/stats/summary`
- **Auth**: Required
- **Query Params**: clientId, days (default: 30)
- **Response**: Stats with average metrics and records

---

## Admin Endpoints

### Get Dashboard Stats
- **URL**: `GET /admin/dashboard/stats`
- **Auth**: Required (Admin)
- **Response**: Dashboard statistics

### Get All Users
- **URL**: `GET /admin/users`
- **Auth**: Required (Admin)
- **Query Params**: page, limit, role, search
- **Response**: Array of users with pagination

### Get All Dietitians
- **URL**: `GET /admin/dietitians`
- **Auth**: Required (Admin)
- **Query Params**: page, limit, approved, search
- **Response**: Array of dietitians with client count

### Approve Dietitian
- **URL**: `PUT /admin/approve-dietitian/:id`
- **Auth**: Required (Admin)
- **Response**: Updated user object

### Reject Dietitian
- **URL**: `DELETE /admin/reject-dietitian/:id`
- **Auth**: Required (Admin)

### Delete User
- **URL**: `DELETE /admin/users/:id`
- **Auth**: Required (Admin)

### Get Platform Analytics
- **URL**: `GET /admin/analytics/platform`
- **Auth**: Required (Admin)
- **Query Params**: startDate, endDate
- **Response**: Analytics data

---

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Example Requests

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <token>"
```

### Create Meal Plan
```bash
curl -X POST http://localhost:5000/api/meal-plans \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "clientId",
    "totalCalories": 2000,
    "totalProtein": 150,
    "totalCarbs": 200,
    "totalFat": 65,
    "date": "2024-01-15"
  }'
```

### Log Progress
```bash
curl -X POST http://localhost:5000/api/progress \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "clientId",
    "weight": 75,
    "caloriesConsumed": 1850
  }'
```
