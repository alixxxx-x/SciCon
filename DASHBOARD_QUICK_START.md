# 🚀 Quick Start Guide - SciCon Dashboard

## ✅ What Was Created

### 1. **Enhanced Dashboard Component** (`frontend/src/pages/Dashboard.jsx`)
- ✨ Modern, premium dark theme design
- 🔄 Real-time data integration with backend
- 👥 Role-based content (Organizer, Author, Reviewer, Participant)
- 📊 Dynamic statistics cards
- 🔔 Notification and message indicators
- 🎨 Smooth animations and transitions

### 2. **Improved API Client** (`frontend/src/api.js`)
- 🔐 Automatic JWT token refresh on 401 errors
- 🔄 Request/Response interceptors
- ⚡ Better error handling
- 🛡️ Security enhancements

### 3. **Documentation**
- 📚 Complete API documentation (DASHBOARD_API.md)
- 🎯 Usage examples and integration guide

## 🎯 Features by User Role

### 👨‍💼 Organizer
- View and manage organized events
- Track event statistics
- Quick access to event management

### ✍️ Author
- View submitted papers
- Track submission status
- Submit new abstracts

### 🔍 Reviewer
- See pending reviews count
- Quick access to review tasks
- Track review progress

### 👤 Participant
- Browse upcoming events
- View registrations
- Access certificates

## 🔧 How to Test

### Step 1: Start Backend
```bash
cd backend
py manage.py runserver
```
✅ Backend should be running on `http://localhost:8000`

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend should be running on `http://localhost:5173`

### Step 3: Login & Access Dashboard
1. Navigate to `http://localhost:5173/login`
2. Login with your credentials
3. You'll be automatically redirected to the Dashboard

## 📱 Dashboard Sections

### 🎯 Top Stats (4 Cards)
- **Card 1**: Role-specific metric (My Events/Submissions/Reviews)
- **Card 2**: My Registrations count
- **Card 3**: Unread Notifications
- **Card 4**: Unread Messages

### 📅 Main Content Area
- **Upcoming Events**: Events with open call for papers
- **My Events** (Organizer only): Your organized events
- **My Submissions** (Author only): Your submitted papers

### 📋 Side Panel
- **My Registrations**: Events you've registered for
- **Review Tasks** (Reviewer only): Pending reviews
- **Quick Actions**: Fast navigation buttons

## 🎨 Design Features

### Color Scheme
- Background: `#0a0a0a` (Deep black)
- Cards: `#1a1a2e` (Dark navy)
- Accents: Blue, Green, Purple, Yellow
- Text: White with gray variations

### Interactive Elements
- ✨ Hover effects on cards
- 🎭 Smooth transitions
- 💫 Scale animations on buttons
- 🌈 Gradient text effects

### Responsive Design
- 📱 Mobile-friendly
- 💻 Tablet optimized
- 🖥️ Desktop enhanced

## 🔌 API Endpoints Used

```javascript
// Dashboard data
GET /api/dashboard/

// User profile
GET /api/auth/profile/

// Token refresh (automatic)
POST /api/auth/refresh/
```

## 🛠️ Customization

### Change Base Colors
Edit `Dashboard.jsx` and modify color classes:
```jsx
// Current: bg-[#0a0a0a]
// Change to: bg-[#YOUR_COLOR]
```

### Add New Stats Card
```jsx
const newStat = {
  title: 'Your Metric',
  value: data.yourValue,
  icon: YourIcon,
  color: 'bg-your-color',
  trend: 'Your trend text'
};
```

### Modify Sidebar Items
```jsx
<SidebarItem 
  icon={YourIcon} 
  label="Your Label" 
  open={sidebarOpen} 
  to="/your-route" 
/>
```

## 🐛 Troubleshooting

### Issue: Dashboard not loading
**Solution**: Check browser console for errors
```javascript
// Common fixes:
1. Ensure backend is running
2. Check .env file has correct VITE_API_URL
3. Verify you're logged in (check localStorage for 'access' token)
```

### Issue: 401 Unauthorized
**Solution**: Token might be expired or invalid
```javascript
// The system auto-refreshes tokens, but if it fails:
1. Logout and login again
2. Clear localStorage: localStorage.clear()
3. Check backend logs for authentication errors
```

### Issue: No data showing
**Solution**: Check backend API
```bash
# Test dashboard endpoint directly:
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/dashboard/
```

## 📊 Data Flow

```
User Login
    ↓
Store JWT tokens (access, refresh)
    ↓
Navigate to /dashboard
    ↓
Fetch dashboard data (/api/dashboard/)
    ↓
Fetch user profile (/api/auth/profile/)
    ↓
Render role-based content
    ↓
User interacts with dashboard
    ↓
If 401 error → Auto-refresh token
    ↓
Retry failed request
```

## 🎓 Next Steps

1. **Test Different Roles**: Create users with different roles to see varied dashboard views
2. **Add Real Data**: Create events, submissions, registrations through admin panel
3. **Customize**: Modify colors, add new sections, enhance animations
4. **Extend**: Add charts, graphs, export features

## 📝 Important Files

```
frontend/
├── src/
│   ├── pages/
│   │   └── Dashboard.jsx          ← Main dashboard component
│   ├── api.js                      ← API client with interceptors
│   └── constants.js                ← Token key constants

backend/
├── api/
│   ├── views.py                    ← Dashboard view (line 620-657)
│   ├── urls.py                     ← Routes
│   ├── serializers.py              ← Data serializers
│   └── models.py                   ← Database models
```

## 💡 Tips

1. **Performance**: Dashboard caches data until page refresh
2. **Real-time**: For live updates, consider adding WebSocket support
3. **Analytics**: Add chart libraries like Chart.js or Recharts for visualizations
4. **Export**: Implement PDF/Excel export for reports

## 🎉 Success Indicators

✅ Dashboard loads without errors
✅ Stats show correct numbers
✅ Role-specific sections appear
✅ Navigation works smoothly
✅ Tokens refresh automatically
✅ Responsive on all devices

---

**Built with ❤️ for SciCon Platform**

Need help? Check the full API documentation in `DASHBOARD_API.md`
