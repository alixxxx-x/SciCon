# 📊 Dashboard API Documentation

## Overview
This document describes the Dashboard component and its integration with the backend API endpoints.

## Backend API Endpoint

### GET `/api/dashboard/`
Returns customized dashboard data based on the authenticated user's role.

**Authentication Required:** Yes (JWT Token)

**Response Structure:**
```json
{
  "upcoming_events": [
    {
      "id": 1,
      "title": "International Conference on AI",
      "start_date": "2026-03-15",
      "end_date": "2026-03-17",
      "city": "Algiers",
      "country": "Algeria",
      "status": "open_call",
      "organizer": 1
    }
  ],
  "my_registrations": [
    {
      "id": 1,
      "event": 1,
      "registration_type": "participant",
      "payment_status": "pending",
      "registered_at": "2026-01-04T02:00:00Z"
    }
  ],
  "unread_notifications": 5,
  "unread_messages": 2
}
```

### Role-Specific Data

#### For Organizers (`role='organizer'`):
```json
{
  "my_events": [
    {
      "id": 1,
      "title": "My Conference",
      "status": "open_call",
      "start_date": "2026-03-15",
      // ... event details
    }
  ],
  // ... plus base fields
}
```

#### For Authors (`role='author'`):
```json
{
  "my_submissions": [
    {
      "id": 1,
      "title": "Research Paper Title",
      "status": "under_review",
      "submission_type": "oral",
      "submitted_at": "2026-01-01T00:00:00Z",
      // ... submission details
    }
  ],
  // ... plus base fields
}
```

#### For Reviewers (`role='reviewer'`):
```json
{
  "pending_reviews": 3,
  // ... plus base fields
}
```

## Frontend Implementation

### Features
1. **Dynamic Stats Cards** - Display different metrics based on user role
2. **Upcoming Events** - Shows events with open calls for papers
3. **Role-Specific Sections**:
   - Organizers: Managed events
   - Authors: Submitted papers
   - Reviewers: Pending review count
4. **Registrations** - User's event registrations
5. **Quick Actions** - Fast navigation to key features
6. **Real-time Notifications** - Badge indicators for unread items

### Component Structure
```
Dashboard
├── Sidebar (Navigation)
├── Header (Search, Notifications, Profile)
└── Main Content
    ├── Stats Grid (4 cards)
    ├── Main Area (2/3 width)
    │   ├── Upcoming Events
    │   ├── My Events (Organizer)
    │   └── My Submissions (Author)
    └── Side Panel (1/3 width)
        ├── My Registrations
        ├── Review Tasks (Reviewer)
        └── Quick Actions
```

### State Management
- `dashboardData`: API response data
- `userInfo`: Current user profile
- `loading`: Loading state
- `sidebarOpen`: Sidebar toggle state

### API Integration
The dashboard makes two parallel API calls on mount:
1. `GET /api/dashboard/` - Dashboard data
2. `GET /api/auth/profile/` - User profile

### Error Handling
- **401 Unauthorized**: Redirects to login
- **Network Errors**: Logged to console
- **Loading States**: Shows spinner during data fetch

### Token Management
- Automatic token refresh on 401 errors
- Token stored in localStorage with keys: `access` and `refresh`
- Interceptor handles token injection and refresh

## Related Files
- `frontend/src/pages/Dashboard.jsx` - Main dashboard component
- `frontend/src/api.js` - API client with interceptors
- `backend/api/views.py` - Dashboard view (line 620-657)
- `backend/api/urls.py` - Dashboard route (line 16)

## Usage Example

### Testing the Dashboard
1. Start backend: `py manage.py runserver` (in backend folder)
2. Start frontend: `npm run dev` (in frontend folder)
3. Login with your credentials
4. Dashboard loads automatically at `/dashboard`

### Sample API Call
```javascript
import api from '../api';

const fetchDashboard = async () => {
  const response = await api.get('/api/dashboard/');
  console.log(response.data);
};
```

## Future Enhancements
- [ ] Add charts for statistics visualization
- [ ] Real-time updates using WebSockets
- [ ] Customizable dashboard layout
- [ ] Export dashboard data as PDF/Excel
- [ ] Analytics and insights section
- [ ] Calendar view for upcoming events
