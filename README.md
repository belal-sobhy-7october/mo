# MoMasry - Performance Coaching System

A premium web-based fitness assessment system designed for professional coaching sessions, optimized for tablet use in real training environments.

## 🎯 Features

### Core Functionality
- **Client Management**: Complete CRUD system for client profiles with detailed information
- **Assessment Sessions**: Structured 8-step assessment flow with progress tracking
- **Body Composition**: Track weight, body fat %, and muscle mass over time
- **Body Measurements**: Comprehensive measurement tracking (waist, hips, chest, thigh, arm, etc.)
- **Mobility Assessment**: Hip, shoulder, ankle, and thoracic mobility tests
- **Stability & Core**: Plank variations, anti-rotation tests, balance assessments
- **Strength Assessment**: Push, pull, lower body, and core strength tests
- **Strength Benchmarks**: Track key exercises (push-up, pull-up, bench press, squat, deadlift, military press)
- **Photo System**: Front, side, and back progress photos with persistent storage
- **Analytics Dashboard**: Detailed progress charts and session-to-session comparisons

### Design & UX
- **Premium Dark Theme**: Professional black/grey/white with neon yellow accents
- **Tablet Optimized**: Perfect for 11-inch tablets in landscape orientation
- **Touch-Friendly**: Large buttons and minimal clicks for live session use
- **Professional Layout**: Left sidebar navigation with main content area

## 🏠 Home Screen

Premium landing screen featuring:
- Full-body coach background image
- Dark gradient overlay at top (behind logo)
- Bold "MoMasry" branding with neon yellow accents
- "ASSESS PRO • PERFORMANCE COACHING" subtitle
- "Performance Starts with Assessment" tagline on chest area
- Two primary actions: Clients and Start New Assessment

## 📋 Assessment Flow (8 Steps)

1. **Quick Check-in**: Pain level, sleep quality, general condition
2. **Body Composition**: Weight, body fat %, muscle mass %
3. **Body Measurements**: Waist, hips, chest, thigh, arm (+ optional calf, shoulders)
4. **Mobility Assessment**: Hip, shoulder, ankle, thoracic mobility tests
5. **Stability & Core**: Plank variations, anti-rotation, balance tests
6. **Strength Assessment**: Push, pull, lower body, core exercises
7. **Strength Benchmarks**: Key lift tracking (6 main exercises)
8. **Progress Photos**: Front, side, back photo capture

## 📊 Analytics Dashboard

- **Client Selection**: Switch between different clients
- **Metric Selection**: Body composition, measurements, or strength benchmarks
- **Progress Cards**: Current values with trend indicators
- **Interactive Charts**: Line charts showing progression over time
- **Session History**: Complete list of past assessments with key metrics

## 🛠 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom dark theme
- **Routing**: React Router DOM
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Storage**: LocalStorage for persistence

## 🎨 Design System

### Colors
- **Primary**: Neon Yellow (#FFFF00)
- **Background**: Black (#000000)
- **Cards**: Dark Grey (#1a1a1a)
- **Borders**: Medium Grey (#333333)
- **Text**: White (#ffffff)
- **Muted**: Light Grey (#666666)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, modern, high-contrast
- **Body**: Clean, readable for extended use

### Components
- **Buttons**: Large touch targets with clear hover states
- **Cards**: Dark backgrounds with subtle borders
- **Inputs**: High contrast with yellow focus states
- **Charts**: Dark theme with yellow accents

## 📱 Tablet Optimization

- **Layout**: Left sidebar (256px) + main content area
- **Responsive**: Grid layouts that adapt to screen size
- **Touch**: Minimum 44px touch targets
- **Orientation**: Optimized for landscape (11-inch tablets)
- **Performance**: Fast rendering for smooth live sessions

## 🧠 Data Structure

### Client Profile
```typescript
interface Client {
  id: string;
  name: string;
  age: number;
  height: number; // cm
  startingWeight: number; // kg
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced';
  trainingLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  injuryHistory: string;
  smoking: boolean;
  alcohol: boolean;
  sleepHours: number;
  profileImage?: string;
  createdAt: Date;
}
```

### Session Data
```typescript
interface Session {
  id: string;
  clientId: string;
  date: Date;
  quickCheckIn: { painLevel: number; sleepQuality: number; generalCondition: string; };
  bodyComposition: { weight: number; bodyFat: number; muscleMass: number; };
  measurements: { waist: number; hips: number; chest: number; thigh: number; arm: number; calf?: number; shoulders?: number; };
  mobility: { hip: MobilityTest[]; shoulder: MobilityTest[]; ankle: MobilityTest[]; thoracic: MobilityTest[]; };
  stability: StabilityTest[];
  strength: StrengthTest[];
  benchmarks: StrengthBenchmark[];
  photos: { front: string; side: string; back: string; };
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd momasry

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development
- Development server runs on `http://localhost:3000`
- Hot reload enabled for fast development
- TypeScript strict mode for type safety

## 💾 Data Persistence

- **Clients**: Stored in localStorage under `clients` key
- **Sessions**: Stored in localStorage under `sessions` key
- **Photos**: Base64 encoded and stored with session data
- **Auto-save**: Sessions are saved when clicking "Save Session"

## 🔧 Future Enhancements

- **Cloud Sync**: Firebase/Supabase integration for multi-device access
- **Export Features**: PDF reports, CSV data export
- **Advanced Analytics**: More sophisticated progress tracking algorithms
- **Mobile App**: React Native companion app
- **Video Integration**: Exercise demonstration videos
- **API Integration**: Wearable device data sync

## 📄 License

This project is proprietary and confidential.

## 🤝 Support

For support and feature requests, please contact the development team.

---

**MoMasry** - Where Performance Starts with Assessment
