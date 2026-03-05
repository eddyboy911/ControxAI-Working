# Changelog
All notable changes to the Controx AI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Organization CRUD with auto-user creation
- Send credentials email via Supabase
- Agent linking interface
- Retell AI API integration
- Real call data in client dashboard

---

## [0.3.0] - 2026-02-05

### 🛡️ Added - Super Admin Dashboard (In Progress)
Role-based dashboard for agency staff to manage client organizations and AI agents.

#### New Files Created
- `src/pages/AdminDashboard.jsx` - Super admin command center with:
  - Emerald/teal gradient theme (distinct from client cyan/purple)
  - Sidebar navigation (Overview, Organizations, Agents, Analytics)
  - System-wide stats cards (orgs, agents, calls, revenue)
  - Organizations table with search and filters
  - Status badges (active/suspended)
  - Placeholder tabs for agents and analytics

#### Modified Files
- `src/contexts/AuthContext.jsx`
  - Added `isSuperAdmin` state and `checkUserRole()` method
  - Queries `organization_members` table to check org membership
  - No org membership = super admin, has membership = client
  - Added `organization` state with org details for clients
  - Combined loading states (`loading || roleLoading`)
  
- `src/components/ProtectedRoute.jsx`
  - Added `requireSuperAdmin` and `requireClient` props
  - Redirects super admins to `/admin` if they try `/dashboard`
  - Redirects clients to `/dashboard` if they try `/admin`
  - Preserves intended location for post-login redirect
  
- `src/pages/Login.jsx`
  - Updated success redirect to check `isSuperAdmin`
  - Routes to `/admin` for super admins, `/dashboard` for clients
  - Added small delay to ensure role is determined
  
- `src/App.jsx`
  - Imported `AdminDashboard` component
  - Added `/admin` protected route with `requireSuperAdmin` flag
  - Updated `/dashboard` route with `requireClient` flag

#### Features
- ✅ Role-based authentication (Option A: no org link = super admin)
- ✅ Automatic routing to correct dashboard
- ✅ Visually distinct admin theme (emerald/teal vs cyan/purple)
- ✅ Organizations table with mock data
- ✅ Search and filter UI (functional hooks ready)
- 🚧 Create organization (button present, modal pending)
- 🚧 Agent linking (placeholder UI)
- 🚧 System analytics (placeholder UI)

#### Design Decisions
- **Color Scheme:** Emerald (#10B981) + Teal (#14B8A6) for admin vs Cyan (#06B6D4) + Purple (#A855F7) for clients
- **Visual Style:** More data-dense, "command center" feel
- **Role Detection:** Query `organization_members` table; no row = super admin
- **Routing:** Automatic redirect based on user role after login

#### Performance
- Efficient role checking with single Supabase query
- Combined loading states prevent UI flicker
- Role checked on login, auth change, and session restore

---


## [0.2.0] - 2026-02-05

### 🔐 Added - Authentication System
Complete Supabase authentication integration with login-only access model.

#### New Files Created
- `.env` - Environment configuration for Supabase credentials (gitignored)
- `src/lib/supabase.js` - Supabase client singleton with persistent session configuration
- `src/contexts/AuthContext.jsx` - Global authentication context providing:
  - `useAuth()` hook for accessing auth state
  - `signIn()` method for email/password login
  - `signOut()` method for logout
  - `resetPassword()` method for password reset
  - Session state management with auto-refresh
- `src/pages/Login.jsx` - Login page with:
  - Email/password input fields
  - Error message display
  - Loading states
  - "Forgot Password?" link
  - Glassmorphic design matching landing page
- `src/pages/ResetPassword.jsx` - Password reset page with:
  - Email input for reset link
  - Success/error feedback
  - Back to login navigation
- `src/components/ProtectedRoute.jsx` - Route wrapper component that:
  - Checks authentication status
  - Shows loading spinner during auth check
  - Redirects to `/login` if not authenticated
  - Protects dashboard access

#### Modified Files
- `.gitignore`
  - Added `.env`, `.env.local`, `.env.*.local` to protect credentials
  
- `src/App.jsx`
  - Wrapped app with `<AuthProvider>` for global auth state
  - Added `/login` route for login page
  - Added `/reset-password` route for password reset
  - Wrapped `/dashboard` route with `<ProtectedRoute>` for authentication enforcement
  
- `src/components/layout/Navbar.jsx`
  - Changed "Live Demo" button text to "Login"
  - Updated link target from `/dashboard` to `/login`
  - Applied to both desktop and mobile menu
  
- `src/components/sections/Hero.jsx`
  - Imported `Link` from react-router-dom
  - Changed "Live Demo" button to "Login"
  - Wrapped button with `<Link to="/login">`
  
- `src/pages/Dashboard.jsx`
  - Imported `useAuth` hook and `useNavigate`
  - Created `handleLogout` async function
  - Connected logout button to `handleLogout` with onClick handler
  - Logout now redirects to landing page (`/`)

#### Dependencies Added
- `@supabase/supabase-js@^2.x.x` - Supabase client library

#### Features
- ✅ Email/password login (no public signup)
- ✅ Protected dashboard route (auto-redirect if not authenticated)
- ✅ Persistent sessions (survives browser restart via localStorage)
- ✅ Password reset functionality via email
- ✅ Logout with session cleanup
- ✅ Loading states during authentication
- ✅ Error handling and user feedback
- ✅ Auto-redirect after login/logout

#### Configuration Required
Users must add Supabase credentials to `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

#### Security
- Environment variables properly gitignored
- Supabase Row Level Security (RLS) enforced
- Session tokens auto-refresh
- Anon key safe for client-side use

#### Design
- Login and reset password pages match landing page aesthetics
- Glassmorphic UI with gradient backgrounds
- Purple/blue/cyan color scheme
- Smooth Framer Motion animations
- Fully responsive design

---

## [0.1.0] - 2026-02-05

### 🎨 Added - Initial Landing Page & Dashboard UI

#### Landing Page
Complete landing page with following sections:
- **Hero Section** - Main headline, CTA buttons, background image
- **Social Proof** - Trust indicators and client logos
- **Problem Statement** - Pain points addressed
- **Solution Overview** - How Controx AI solves problems
- **Industries** - Target industry use cases
- **Features** - Key platform features
- **Integrations** - Integration capabilities showcase
- **Security** - Security & compliance information
- **Testimonials** - Customer testimonials
- **FAQ** - Frequently asked questions
- **CTA Section** - Final call-to-action
- **Footer** - Links and company information

#### Dashboard (UI Only - Dummy Data)
Client-facing dashboard with:
- **Sidebar Navigation** - Overview, Call Logs, Analytics, Billing, Settings tabs
- **Stats Grid** - 4 stat cards (Total Calls, Active Agents, Revenue, Avg Duration)
- **Analytics Chart** - Line chart showing trends over time
- **Pie Chart** - Call distribution visualization
- **Recent Calls Table** - Table showing latest call records
- **Settings Panel** - Currency selection and preferences
- **Logout Button** - Non-functional placeholder

#### Tech Stack
- React 19.2.0 with Vite 7.2.4
- Tailwind CSS 4.1.18 for styling
- Framer Motion 12.29.0 for animations
- React Router 7.13.0 for routing
- Recharts 3.7.0 for data visualization
- Lucide React 0.563.0 for icons
- Lenis 1.3.17 for smooth scrolling

#### Design System
- **Color Palette:** Cyan, Purple, Blue gradients on dark background (#000103)
- **UI Pattern:** Glassmorphism with backdrop blur
- **Typography:** Bold headings, readable body text
- **Responsive:** Mobile-first, fully responsive layout
- **Animations:** Smooth transitions with Framer Motion

#### Routes
- `/` - Landing page
- `/dashboard` - Dashboard (not protected yet)

---

## Project Initialization - 2026-02-05

### Added
- Initial Vite + React project setup
- Package configuration with all dependencies
- ESLint configuration
- Tailwind CSS configuration
- Basic project structure

---

## Legend

- 🔐 Security/Authentication
- 🎨 UI/Design
- 🐛 Bug Fix
- 🚀 Performance
- 📝 Documentation
- ♻️ Refactor
- ✨ New Feature
- 🗑️ Removed

---

## Notes

- All changes are logged with date, version, and detailed descriptions
- Breaking changes are clearly marked
- Security updates are prioritized and highlighted
- Each version includes upgrade instructions if needed
