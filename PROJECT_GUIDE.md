# Street Food Safety Rater - Project Guide

## 🍲 Overview

**Street Food Safety Rater** is a full-stack web application that enables users to rate and review street food vendors based on safety and hygiene standards. The application helps consumers make informed decisions about where to eat and provides vendors with feedback to improve their food safety practices.

## 🎯 Key Features

### For Users
- **Browse Vendors**: View a list of approved street food vendors with their safety grades
- **Search & Filter**: Search vendors by name, food type, or filter by safety grade (A, B, C, D)
- **Submit Ratings**: Rate vendors on four key safety criteria:
  - Hygiene (Cleanliness & Sanitation) - 35% weight
  - Food Handling (Proper Preparation) - 30% weight
  - Water Source (Clean & Safe) - 20% weight
  - Waste Disposal (Proper Management) - 15% weight
- **View Details**: See vendor information, ratings, comments, and photos
- **Add Vendors**: Submit new street food vendors for admin approval

### For Admins
- **Admin Dashboard**: Review and approve/reject pending vendor submissions
- **Vendor Management**: Manage vendor listings and ensure quality standards

## 📊 Safety Score System

### Calculation Formula
```
Safety Score = (Hygiene × 0.35 + FoodHandling × 0.30 + WaterSource × 0.20 + WasteDisposal × 0.15) × 20
Range: 0-100
```

### Grade Mapping
| Grade | Score Range | Color | Status |
|-------|-------------|-------|--------|
| A | ≥ 80 | 🟢 Green | Excellent |
| B | 60-79 | 🔵 Blue | Good |
| C | 40-59 | 🟡 Yellow | Fair |
| D | < 40 | 🔴 Red | Poor |

## 🏗️ Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **tRPC** - Type-safe API client
- **Wouter** - Lightweight routing

### Backend
- **Express.js** - Web server
- **tRPC** - Type-safe RPC framework
- **Drizzle ORM** - Database ORM
- **MySQL** - Database

### Testing
- **Vitest** - Unit testing framework

## 📁 Project Structure

```
street_food_rater/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Vendor listing with search/filter
│   │   │   ├── VendorDetail.tsx      # Vendor details and ratings
│   │   │   ├── AddVendor.tsx         # Vendor submission form
│   │   │   └── AdminDashboard.tsx    # Admin approval panel
│   │   ├── components/
│   │   │   ├── RatingForm.tsx        # Star rating widget
│   │   │   └── ui/                   # shadcn/ui components
│   │   ├── lib/
│   │   │   └── trpc.ts               # tRPC client setup
│   │   ├── App.tsx                   # Routes and layout
│   │   └── main.tsx                  # Entry point
│   └── index.html
├── server/
│   ├── db.ts                         # Database queries and helpers
│   ├── routers.ts                    # tRPC procedure definitions
│   ├── procedures.ts                 # tRPC setup and auth
│   ├── index.ts                      # Express server setup
│   └── db.test.ts                    # Safety score calculation tests
├── drizzle/
│   ├── schema.ts                     # Database schema
│   └── migrations/                   # Database migrations
├── shared/                           # Shared types and constants
└── package.json
```

## 🚀 Getting Started

### Installation
```bash
cd /home/ubuntu/street_food_rater
pnpm install
```

### Development
```bash
# Start dev server (frontend + backend)
pnpm dev

# Run tests
pnpm test

# Type check
pnpm check
```

### Database
```bash
# Generate and run migrations
pnpm db:push
```

## 📊 Database Schema

### Users Table
- `id`: Primary key
- `openId`: OAuth identifier
- `name`, `email`: User info
- `role`: 'user' or 'admin'
- `createdAt`, `updatedAt`: Timestamps

### Vendors Table
- `id`: Primary key
- `name`: Vendor name
- `foodType`: Type of food served
- `address`: Location address
- `latitude`, `longitude`: GPS coordinates
- `safetyScore`: Calculated safety score (0-100)
- `grade`: Letter grade (A, B, C, D)
- `isApproved`: Approval status
- `submittedBy`: User who submitted
- `createdAt`, `updatedAt`: Timestamps

### Ratings Table
- `id`: Primary key
- `vendorId`: Reference to vendor
- `userId`: Reference to user
- `hygiene`, `foodHandling`, `waterSource`, `wasteDisposal`: Ratings (1-5)
- `comment`: Optional review text
- `createdAt`: Timestamp

### Photos Table
- `id`: Primary key
- `vendorId`: Reference to vendor
- `url`: Photo URL
- `fileKey`: Storage key
- `uploadedBy`: User who uploaded
- `createdAt`: Timestamp

## 🔌 API Endpoints (tRPC)

### Public Procedures
- `vendors.list` - Get approved vendors with filters
- `vendors.getById` - Get vendor details with ratings
- `ratings.getByVendor` - Get ratings for a vendor
- `photos.getByVendor` - Get photos for a vendor

### Protected Procedures (Authenticated Users)
- `vendors.create` - Submit a new vendor
- `ratings.submit` - Submit a rating
- `photos.upload` - Upload a photo

### Admin Procedures
- `admin.getPendingVendors` - Get pending vendor approvals
- `vendors.approve` - Approve a vendor
- `vendors.reject` - Reject a vendor

## ✅ Testing

### Safety Score Calculation Tests
All 10 tests passing:
- Grade A calculation (score ≥ 80)
- Grade B calculation (score 60-79)
- Grade C calculation (score 40-59)
- Grade D calculation (score < 40)
- Weighted formula verification
- Score rounding accuracy

Run tests:
```bash
pnpm test
```

## 🎨 Design Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Color-Coded Grades**: Visual indicators for safety grades
- **Intuitive Navigation**: Easy-to-use interface
- **Loading States**: Spinners and skeletons for better UX
- **Error Handling**: User-friendly error messages
- **Accessible**: WCAG compliant components

## 🔐 Security Considerations

- **Authentication**: Mock user system (production should use OAuth)
- **Authorization**: Role-based access control for admin functions
- **Input Validation**: Zod schema validation on all inputs
- **Database**: Parameterized queries via Drizzle ORM

## 📝 Future Enhancements

- [ ] Google Maps integration for vendor locations
- [ ] Real photo upload functionality
- [ ] Email notifications for new ratings
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Real-time notifications
- [ ] User profiles and reputation system

## 🤝 Contributing

To add new features:
1. Update `todo.md` with new items
2. Create feature branch
3. Implement with tests
4. Update documentation
5. Create checkpoint

## 📞 Support

For issues or questions, refer to the project documentation or create an issue in the repository.

---

**Last Updated**: May 17, 2026
**Status**: Core features implemented, ready for testing and deployment
