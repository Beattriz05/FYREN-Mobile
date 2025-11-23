# Fyren Mobile App - Design Guidelines

## Visual Identity (Core Reference)

The Fyren application must follow the exact visual identity provided in the reference image. All design decisions should maintain visual consistency with this established aesthetic.

## Color Palette

**Primary Colors:**
- **Navy Blue** (#0E2345) - Main background color
- **Orange** (#F39C12) - Icons, logo, and accent highlights
- **Light Blue** (#2D74FF) - Primary action buttons
- **White** (#FFFFFF) - Inputs and text
- **Light Gray** (#F2F2F2) - Component backgrounds and cards

## Design Elements

**Input Fields:**
- Rounded corners with subtle borders
- White background
- Clean, simple styling

**Buttons:**
- Large, prominent action buttons
- Light blue background (#2D74FF)
- White text
- Rounded corners

**Icons:**
- Minimalist style
- Orange color (#F39C12) for navigation and highlights
- Gray for inactive states

**Cards:**
- White background
- Rounded corners
- Soft shadows for depth
- Clean spacing

**Navigation:**
- Bottom navigation bar
- Orange icons for active states
- Gray text/icons for inactive states
- Fyren logo at the top of main screens

**Overall Aesthetic:**
- Clean and modern
- Simple and intuitive
- Professional appearance
- Minimalist approach

## Architecture & User Roles

**Three User Profiles:**
1. **User** (Regular user reporting incidents)
2. **Chief** (Manager reviewing and updating incidents)
3. **Administrator** (System admin managing users and audit)

**Authentication:**
- Login screen with identity visual consistency
- Email/password authentication
- AsyncStorage for session management
- Role-based access control

## Navigation Structure

**Root Navigation:** Bottom Tab Navigation (4-5 tabs depending on user role)

**User Role Tabs:**
- Home
- Register Incident (FAB or center tab)
- History
- Profile/Settings

**Chief Role Tabs:**
- Dashboard
- Incidents List
- Reports
- Profile/Settings

**Administrator Role Tabs:**
- Dashboard
- User Management
- Audit
- Settings

## Screen Specifications

### Login Screen
- Navy blue background
- Fyren logo at top (orange)
- White rounded input fields
- Large light blue login button
- Clean, centered layout

### Home Screen
- Transparent header with Fyren logo
- Navy blue background or gradient
- Quick access cards (white with rounded corners)
- Bottom navigation visible
- Safe area: bottom inset = tabBarHeight + 24px

### Register Incident (Multi-step Form)
- Step-by-step wizard layout
- White form cards on navy background
- Clear progress indicator
- Large rounded input fields
- Camera/media upload section with preview
- Map integration for location selection
- Submit button: large, light blue, at bottom
- Cancel in header (left)

### Media Upload Screen
- Camera access for photo/video capture
- Gallery picker option
- Preview thumbnails in grid
- Orange accent for selected items
- Delete option on previews

### Map Screen
- Full-screen map view
- Orange markers for incidents
- Current location indicator
- Filter options in header
- Details card slides up from bottom when marker tapped

### History Screen
- Scrollable list of incident cards
- White cards with rounded corners
- Status badges (color-coded)
- Search bar in header
- Filter chips (status, date range)
- Pull-to-refresh

### Comments/Chat Area (per incident)
- Threaded comment view
- User avatars (small circles)
- Timestamp per comment
- Input field fixed at bottom
- White message bubbles
- Send button in orange

### Chief Dashboard
- Statistics cards at top (white, rounded)
- Charts/graphs in navy/orange palette
- Incident status overview
- Quick actions (orange icons)
- Scrollable content area

### Chief - Incident List
- Filterable list (by status, priority, date)
- Card-based layout
- Status color indicators
- Swipe actions for quick updates
- Pull-to-refresh

### Chief - Incident Details
- Full incident information
- Media gallery
- Location map
- Comment thread
- Status update buttons (large, colored by status)
- Assignment options

### Administrator Dashboard
- System overview metrics
- User statistics
- Audit log summary
- Navigation to management sections

### Administrator - User Management
- List of users with role badges
- Search and filter options
- Add new user (FAB)
- Edit/deactivate actions
- Role assignment interface

### Administrator - Audit Log
- Chronological list of system events
- Filter by user, action type, date
- Detailed event information
- Export options

## Component Specifications

**Safe Area Insets:**
- With tab bar: bottom = tabBarHeight + 24px
- Without tab bar: bottom = insets.bottom + 24px
- With transparent header: top = headerHeight + 24px
- Without header: top = insets.top + 24px

**Headers:**
- Transparent by default (showing background)
- Left button: Back arrow or Menu icon
- Right button: Action icons (orange when active)
- Optional search bar (white rounded)

**Forms:**
- Submit button at bottom of form
- Cancel in header (left)
- Field validation with error messages
- Orange accent for active fields

**Lists:**
- Scrollable with pull-to-refresh
- Card-based items
- Dividers between sections
- Empty states with orange icons

**Floating Action Button (if used):**
- Orange background (#F39C12)
- White icon
- Subtle shadow: offset (0, 2), opacity 0.10, radius 2
- Bottom-right placement (16px margins)

## Interaction Design

**Touch Feedback:**
- All touchable elements show visual feedback
- Slight opacity change on press (0.7)
- Ripple effect on Android (optional)

**Loading States:**
- Activity indicators in orange
- Skeleton screens for content loading
- Progress bars in light blue

**Animations:**
- Smooth transitions between screens
- Subtle card entrance animations
- Bottom sheet slide-ups for details

## Typography

- Headers: Bold, large size
- Body text: Regular weight, readable size
- Labels: Smaller, uppercase for sections
- Maintain high contrast for readability

## Accessibility

- Minimum touch target: 44x44 points
- High contrast text (white on navy, navy on white)
- Icon labels for screen readers
- Form field labels always visible
- Error messages clear and descriptive