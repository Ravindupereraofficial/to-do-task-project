# Todo Task Manager - Frontend

A modern, responsive React frontend for the Todo Task Manager application built with TypeScript, Vite, and featuring a beautiful glass-morphism design.

## Features

- ✨ Modern glass-morphism UI design
- 🎨 Animated gradient background
- 📱 Fully responsive layout
- 🔄 Real-time task management
- 💡 Smart error handling and user feedback
- ⌨️ Keyboard shortcuts (Enter to submit forms)
- ♿ Accessibility features (ARIA labels, focus management)
- 🚀 Fast performance with Vite
- 📦 TypeScript for type safety

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **React Icons** - Beautiful icon library
- **CSS3** - Modern styling with animations and glass-morphism

## Prerequisites

Before running the frontend, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- The backend server running on port 8080

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files (optional):
```bash
# Copy and modify environment variables
cp .env.example .env.local
```

## Environment Variables

The application supports the following environment variables:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api/tasks

# Application Information
VITE_APP_NAME=Todo Task Manager
VITE_APP_VERSION=1.0.0
```

### Environment Files

- `.env` - Default environment variables
- `.env.development` - Development-specific variables
- `.env.production` - Production-specific variables
- `.env.local` - Local overrides (not committed to git)

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server at `http://localhost:5173`

### Build
```bash
npm run build
```
Builds the app for production to the `dist` folder

### Preview
```bash
npm run preview
```
Serves the production build locally for testing

### Lint
```bash
npm run lint
```
Runs ESLint to check for code quality issues

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, etc.
│   ├── services/          # API service layer
│   │   └── taskService.ts # Task API operations
│   ├── App.tsx           # Main application component
│   ├── App.css           # Application styles
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables
├── .env.development      # Development environment
├── .env.production       # Production environment
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md            # This file
```

## API Integration

The frontend communicates with the backend through a dedicated service layer:

### TaskService

Located in `src/services/taskService.ts`, this service handles:

- Fetching all tasks
- Creating new tasks
- Completing tasks
- Error handling and user feedback

### API Endpoints Used

- `GET /api/tasks/recent` - Fetch recent tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}/complete` - Mark task as complete

## Usage

### Creating Tasks

1. Click the "Add Task" button
2. Enter a task title (required)
3. Optionally add a description
4. Press Enter or click "Create Task"

### Managing Tasks

- **Complete Task**: Click the checkmark button on any task
- **View Details**: All task information is displayed on the card
- **Timestamps**: Each task shows when it was created

### Keyboard Shortcuts

- **Enter**: Submit forms (create task)
- **Escape**: Close modals (planned feature)

## Error Handling

The application includes comprehensive error handling:

### Connection Issues
- Displays user-friendly messages when backend is unreachable
- Automatic retry suggestions
- Clear status indicators

### Validation
- Client-side form validation
- Real-time feedback
- Prevent invalid submissions

### User Feedback
- Success notifications for completed actions
- Error alerts with actionable information
- Loading states during operations

## Responsive Design

The application is fully responsive and works on:

- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

### Mobile Features
- Touch-friendly buttons
- Optimized layouts
- Readable text sizes
- Accessible touch targets

## Accessibility

The application follows accessibility best practices:

- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus handling
- **Color Contrast**: WCAG compliant colors
- **Semantic HTML**: Proper heading structure

## Performance Optimizations

- **Code Splitting**: Automatic with Vite
- **Asset Optimization**: Compressed images and fonts
- **Bundle Analysis**: Optimized build output
- **Lazy Loading**: Components loaded on demand

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

#### "Unable to connect to server"
- Ensure the backend is running on port 8080
- Check if CORS is properly configured
- Verify the API URL in environment variables

#### Build Fails
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)
- Verify all dependencies are installed

#### Development Server Won't Start
- Check if port 5173 is available
- Try running on a different port: `npm run dev -- --port 3000`

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Verify the backend is running and accessible
3. Review the environment configuration
4. Check the network tab for failed requests

## Development

### Code Style

The project uses:
- ESLint for code linting
- TypeScript for type checking
- Prettier for code formatting (recommended)

### Adding New Features

1. Create components in appropriate directories
2. Add TypeScript interfaces for new data types
3. Update the service layer for new API calls
4. Add proper error handling
5. Include accessibility features
6. Write responsive CSS

## Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Static Hosting

The built application can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

### Environment Configuration

For production deployment:

1. Set `VITE_API_URL` to your production backend URL
2. Configure any additional environment variables
3. Ensure CORS is configured on the backend for your domain

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Include proper error handling
4. Test on multiple screen sizes
5. Ensure accessibility compliance

## License

This project is part of the Todo Task Manager application.
