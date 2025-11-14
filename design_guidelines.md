# Design Guidelines: Madagascar Driving License Learning Platform

## Design Approach
**System-Based with Educational Focus**: Drawing from Material Design principles and modern learning platforms (Duolingo, Khan Academy), prioritizing clarity, accessibility, and focused learning experiences.

## Typography System

**Font Stack**: Google Fonts via CDN
- Primary: Inter (UI elements, navigation, buttons)
- Secondary: Merriweather (lesson content, explanations for better readability)

**Hierarchy**:
- H1: text-4xl md:text-5xl font-bold (page titles)
- H2: text-3xl md:text-4xl font-semibold (section headers)
- H3: text-xl md:text-2xl font-medium (category titles, card headers)
- Body Large: text-lg (lesson content, question text)
- Body: text-base (descriptions, options)
- Small: text-sm (metadata, timestamps, helper text)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, and 16
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-16
- Card gaps: gap-6 to gap-8
- Margins: m-4, m-6, m-8

**Grid System**:
- Container: max-w-7xl mx-auto px-4
- Category cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Admin dashboard: 2-column layout (sidebar + content)

## Core Components

### Navigation & Header
- Sticky header with language toggle (FR/MG flags), dark mode toggle, user profile
- Admin/Student mode switcher (when logged in as admin)
- Clear visual separation between modes using distinct navigation styles
- Breadcrumb navigation for deep pages

### Dashboard Cards
- Elevated card design with subtle shadows
- Category icon + title + progress indicator + lesson count
- Hover state with slight scale transform (scale-105)
- Click area covers entire card

### Lesson Interface
- Single-column layout (max-w-3xl) for optimal reading
- Large image display with rounded corners (rounded-lg)
- Content sections with clear visual breaks using dividers
- Audio playback button integrated seamlessly with lesson title
- Navigation: Previous/Next lesson buttons fixed at bottom

### Exam Interface
- Clean, distraction-free full-screen layout
- Fixed header with timer (large, prominent), question counter, exit button
- Question number indicator sidebar (desktop) or dots (mobile)
- Large question text with image above (if applicable)
- 4 answer options as large, touchable cards (full-width stacked)
- Answer option states: default, selected, correct (post-submission), incorrect (post-submission)
- Navigation: Next/Submit button (bottom-right), Back button (bottom-left)
- Auto-advance after selection with 1-second delay

### Admin Panel
- Left sidebar navigation with sections (Lessons, Questions, Categories, Analytics)
- Content area with data tables and forms
- Action buttons (Add New, Edit, Delete) clearly visible
- Form layouts: 2-column on desktop, single-column on mobile
- Image upload with drag-drop zone and preview

### Results Page
- Score hero section (large circular progress indicator)
- Pass/Fail status with clear visual treatment
- Question review accordion (expandable sections)
- Each question shows: original question, selected answer, correct answer, explanation
- Retake exam CTA button prominently placed

## Icon System
**Heroicons** (via CDN): Outline style for navigation, solid for emphasis
- Categories: unique icon per category (road-sign, car, traffic-light, etc.)
- Actions: check, x-mark, arrow-right, play, volume-up
- Interface: moon/sun (dark mode), globe (language), user-circle (profile)

## Dark Mode Design Rules

**Philosophy**: High contrast with reduced eye strain
- Backgrounds: Deep grays (not pure black) - multiple layers for depth
- Text: Off-white for primary text, medium gray for secondary
- Cards: Subtle elevation using lighter gray backgrounds
- Borders: Subtle, low-contrast borders to define spaces
- Images: Slight opacity reduction (90%) to prevent glare
- Focus states: Enhanced visibility with brighter accent treatment
- Syntax: Dark mode should feel cohesive, not just inverted

**Component Adaptations**:
- Answer cards: More pronounced shadows in dark mode for depth
- Timer: High-contrast treatment (white text on dark)
- Form inputs: Darker backgrounds with visible borders
- Code/technical content: Darker syntax highlighting schemes

## Animations
**Minimal and Purposeful**:
- Page transitions: Subtle fade-in (200ms)
- Card hover: scale-105 transform (150ms)
- Answer selection: Smooth background transition (200ms)
- Timer warning: Gentle pulse when < 60 seconds (avoid distracting flashing)
- Modal entry/exit: Scale + fade (250ms)

## Accessibility
- Focus rings visible on all interactive elements
- Sufficient contrast ratios (WCAG AA minimum)
- Touch targets minimum 44x44px
- Keyboard navigation for entire exam flow
- Voice reading controls clearly labeled
- Skip navigation links for screen readers

## Images

**Hero Section**: Full-width hero on homepage featuring Madagascar road scene (market street or coastal highway) with overlay containing platform title, language selection, and dual CTAs (Start Learning / Admin Login). Use blur-backdrop for text legibility.

**Category Cards**: Representative icon-illustrations for each category (not photos)

**Lesson Images**: Educational diagrams and road scenarios - display at 16:9 ratio, centered, with rounded corners

**Exam Questions**: Traffic scenarios, road signs, vehicle diagrams - display above question text at consistent 4:3 ratio

**Results Page**: No hero image; focus on data visualization

## Responsive Behavior
- Mobile-first approach
- Exam interface: Stack all elements vertically on mobile
- Admin tables: Horizontal scroll on mobile with sticky first column
- Navigation: Hamburger menu on mobile, full nav on desktop
- Typography: Scale down by 1 size on mobile (text-4xl → text-3xl)