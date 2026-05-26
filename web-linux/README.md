# WebLinuxOS

A complete Linux desktop environment running entirely in your browser.

## Introduction

WebLinuxOS is a feature-rich web-based operating system that provides a realistic Linux-like desktop experience without any installation. Built with modern web technologies, it offers a comprehensive suite of applications and tools for productivity, development, and entertainment.

## Key Features

### Desktop Environment
- Multi-window management with drag, resize, minimize, maximize, and close operations
- Virtual desktops (up to 4) with seamless switching
- Right-click context menus for quick actions
- Dark/Light theme support with smooth transitions
- Interactive and animated wallpaper effects
- Global keyboard shortcuts for power users

### File System
- Virtual file system with persistent localStorage
- Full file operations: create, delete, rename, move, copy
- Directory navigation with breadcrumb path bar
- File preview for text, images, and other formats
- Recent files and favorites tracking

### Terminal Emulator
- 80+ built-in commands mimicking real Linux terminal
- Python 3 runtime support via Pyodide
- Command history with persistence
- Auto-completion for commands
- Fun commands: cowsay, fortune, matrix, figlet
- System monitoring commands: top, ps, df, free
- Network tools: ping, curl, ifconfig

### Application Ecosystem

#### Development Tools
- **Code Editor**: Syntax highlighting for multiple languages
- **Code Studio**: Full IDE experience with multiple panels
- **API Tester**: Test REST APIs with intuitive interface
- **JSON Formatter**: Format and validate JSON data
- **Regex Tester**: Test and debug regular expressions
- **GitHub Trending**: Browse popular repositories
- **Code Snippets Manager**: Organize and search code snippets

#### Productivity Suite
- **Notes**: Rich note-taking with organization
- **Todo List**: Task management with priorities
- **Calendar**: Event management and scheduling
- **Mind Map**: Visual thinking and brainstorming
- **Kanban Board**: Project management with boards
- **Pomodoro**: Time management technique timer
- **Sticky Notes Wall**: Visual task board

#### System Utilities
- **System Monitor**: Real-time CPU, memory, disk monitoring
- **Process Monitor**: View and manage system processes
- **Network Monitor**: Network traffic visualization
- **Disk Usage Analyzer**: Visual disk space analysis
- **Log Viewer**: System and application logs
- **Task Manager**: Application and process management

#### Network & Communication
- **Web Browser**: Built-in browser with address bar
- **Email Client**: Email management interface
- **Chat**: Instant messaging application
- **News Reader**: RSS news feed reader
- **Weather**: Real-time weather with 7-day forecast

#### Multimedia
- **Music Player**: Audio playback with playlist support
- **Video Player**: Video playback capabilities
- **Paint**: Drawing and image editing
- **Image Viewer**: Image gallery and viewer
- **Music Visualizer**: Audio visualization effects

#### Utilities
- **Calculator**: Scientific calculator
- **Weather**: Weather information and forecasts
- **Password Manager**: Secure password storage
- **Translator**: Text translation tool
- **Unit Converter**: Measurement conversions
- **QR Generator**: Generate QR codes
- **Voice Transcriber**: Speech to text

### API Integrations

WebLinuxOS integrates with real-world APIs for practical functionality:
- **Open-Meteo**: Weather data and forecasts
- **ipapi.co**: IP geolocation services
- **GitHub API**: Trending repositories
- **Cloudflare DNS**: DNS lookup tools

## Technology Stack

- **React 19**: Modern React with concurrent features
- **TypeScript**: Type-safe development
- **Zustand 5**: Lightweight state management
- **Vite 8**: Fast build tool and dev server
- **Pyodide**: In-browser Python runtime
- **Lucide React**: Beautiful icon library

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/saya-ch/WebLinuxOS.git

# Navigate to project directory
cd WebLinuxOS/web-linux

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Deployment

#### GitHub Pages

```bash
# Deploy to GitHub Pages
npm run deploy
```

The application will be deployed to `https://saya-ch.github.io/WebLinuxOS/`

#### Manual Deployment

1. Run `npm run build`
2. Copy the contents of the `web-linux/dist` directory to your web server
3. Configure your server for single-page application routing

## Keyboard Shortcuts

### Window Management
| Shortcut | Action |
|----------|--------|
| `Super + T` | Open Terminal |
| `Super + E` | Open File Manager |
| `Super + B` | Open Browser |
| `Super + ,` | Open Settings |
| `Ctrl + W` | Close Window |
| `Ctrl + M` | Minimize Window |
| `Alt + Tab` | Cycle Through Windows |

### Desktop Navigation
| Shortcut | Action |
|----------|--------|
| `Ctrl + Alt + 1-4` | Switch to Desktop |
| `Ctrl + Alt + Arrow` | Switch to Prev/Next Desktop |
| `Super + K` | Open Smart Search |
| `Super + Shift + L` | Open Launcher |

### Application Shortcuts
| Shortcut | Application |
|----------|-------------|
| `Super + 1-9` | Open pinned applications |
| `PrintScreen` | Screenshot Tool |

## Project Structure

```
web-linux/
├── src/
│   ├── apps/              # Application components (100+ apps)
│   │   ├── Terminal.tsx
│   │   ├── FileManager.tsx
│   │   ├── Weather.tsx
│   │   └── ...
│   ├── components/
│   │   ├── desktop/       # Desktop environment components
│   │   │   ├── Desktop.tsx
│   │   │   ├── Window.tsx
│   │   │   ├── Taskbar.tsx
│   │   │   └── StartMenu.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── CommandPalette.tsx
│   ├── store.tsx          # Zustand state management
│   ├── apps.tsx           # Application registry
│   ├── types.ts           # TypeScript definitions
│   ├── icons.tsx          # Custom SVG icons
│   └── index.css          # Global styles and themes
├── public/                # Static assets
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Architecture

### State Management
The application uses Zustand for global state management with persistence:
- Window states and positions
- File system operations
- User preferences and themes
- Application registry

### Component Design
- Functional components with React hooks
- Memoized components for performance
- Error boundaries for resilience
- Responsive design patterns

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading for applications
- Virtualized lists for large datasets
- GPU-accelerated animations
- Debounced state updates
- Code splitting for faster initial load

## Development

### Adding New Applications

1. Create your application component in `src/apps/`
2. Import it in `src/apps.tsx`
3. Register it in the app registry
4. The app will automatically appear in the launcher

Example:
```tsx
// src/apps/MyApp.tsx
export default function MyApp() {
  return <div>My new application</div>
}
```

```tsx
// src/apps.tsx
import MyApp from './apps/MyApp'

// Add to appRegistry
{ id: 'my-app', name: 'My App', icon: <Icon />, component: 'MyApp', ... }
```

### Code Style

- Use functional components with hooks
- Prefer `useCallback` and `useMemo` for performance
- Use TypeScript for type safety
- Follow existing naming conventions

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- React team for the amazing framework
- Zustand for simple state management
- Vite for fast development experience
- Pyodide for bringing Python to the browser
- All contributors and users of this project

## Changelog

### v3.5.0
- Activity Tracker application for productivity insights
- Learning Platform for interactive tutorials
- Enhanced AI Helper with code generation
- System Dashboard with comprehensive metrics
- Code quality improvements and bug fixes

### v3.4.0
- System Dashboard integration
- IP & DNS Lookup tool
- Performance Monitor enhancements
- Improved error handling

### v3.3.0
- Real-time System Monitor
- Dynamic resource charts
- Process management

### v3.2.0
- IP geolocation integration
- DNS lookup capabilities
- React 19 compatibility fixes

### v3.1.0
- Code Snippets Manager
- Multi-language support
- Import/export functionality

## Support

If you encounter any issues or have suggestions:
- Open an issue on GitHub
- Submit a pull request
- Contact the maintainers

## Future Roadmap

- [ ] Mobile responsive design
- [ ] PWA support for offline usage
- [ ] Cloud sync functionality
- [ ] More API integrations
- [ ] Enhanced accessibility features
- [ ] Plugin system for custom apps

## Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
