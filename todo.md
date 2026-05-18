# Street Food Safety Rater - Project TODO

## Database Schema
- [x] Create vendors table with location, safety score, grade, approval status
- [x] Create ratings table with hygiene, food_handling, water_source, waste_disposal fields
- [x] Create photos table for vendor images
- [ ] Add indexes for vendor location queries

## Backend API (tRPC Procedures)
- [x] Implement vendors.list procedure (with filtering by grade, food_type, location)
- [x] Implement vendors.getById procedure with ratings
- [x] Implement vendors.create procedure (authenticated)
- [ ] Implement vendors.update procedure (admin only)
- [x] Implement ratings.submit procedure (authenticated)
- [x] Implement ratings.getByVendor procedure
- [x] Implement admin.getPendingVendors procedure (admin only)
- [x] Implement admin.approveVendor procedure (admin only)
- [x] Implement admin.rejectVendor procedure (admin only)
- [x] Implement photos.upload procedure (authenticated)
- [x] Implement safety score calculation logic

## Frontend Pages
- [x] Create HomePage with interactive Google Map showing vendors
- [x] Create VendorListPage with search/filter functionality
- [x] Create VendorDetailPage with ratings and photos
- [x] Create AddVendorPage with address geocoding
- [x] Create RatingPage with star rating widget
- [x] Create AdminDashboard for vendor approval
- [ ] Create UserProfilePage

## Frontend Components
- [ ] Build MapComponent with vendor pins (color-coded by grade)
- [x] Build VendorCard component
- [x] Build StarRatingWidget component
- [x] Build SearchFilterBar component
- [x] Build VendorForm component with address input
- [ ] Build AdminVendorReviewCard component

## Maps Integration
- [ ] Integrate Google Maps API for vendor display
- [ ] Implement geocoding for address input
- [ ] Add marker clustering for high-density areas
- [ ] Implement location-based search radius

## Design & Styling
- [x] Define color scheme (Grade A/B/C/D colors)
- [x] Create responsive layout
- [x] Style forms and input fields
- [x] Add loading states and animations
- [ ] Implement dark/light theme support

## Authentication & Authorization
- [ ] Implement user login/registration flow
- [ ] Add admin role checking
- [ ] Protect admin routes
- [ ] Add user profile management

## Testing
- [x] Write vitest tests for safety score calculation
- [ ] Write tests for vendor CRUD operations
- [ ] Write tests for rating submission
- [ ] Write tests for admin approval workflow
- [ ] Write integration tests for API endpoints

## Deployment & Polish
- [ ] Set up environment variables
- [ ] Configure Google Maps API key
- [ ] Add error handling and validation
- [ ] Implement proper error messages
- [ ] Add loading spinners and skeletons
- [ ] Create checkpoint for deployment
