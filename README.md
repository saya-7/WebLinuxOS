# WebLinuxOS

A complete Linux desktop environment running in the browser.

[Live Demo](https://saya-ch.github.io/WebLinuxOS/)

## Overview

WebLinuxOS is a feature-rich web-based Linux desktop environment that provides:

- Complete desktop experience with multi-window management and virtual desktops
- Virtual file system with persistent storage and file operations
- Feature-rich terminal with 80+ commands and Python 3 runtime support
- 80+ pre-installed applications covering development, office, entertainment, and utilities
- Real API integrations for practical network tools
- Activity tracking and productivity insights
- Dark/Light theme support

## Quick Start

```bash
# Clone repository
git clone https://github.com/saya-ch/WebLinuxOS.git

# Navigate to directory
cd WebLinuxOS/web-linux

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Key Features

### Desktop Environment
- Multi Virtual Desktops (up to 4)
- Window Management (drag, resize, minimize, maximize, close)
- Right-click Context Menu
- Dynamic Wallpapers
- Dark/Light Theme
- Global Shortcuts
- Activity Tracking

### Terminal Emulator
- 80+ built-in commands
- Python 3 runtime (Pyodide)
- Command history and auto-completion
- Fun commands (cowsay, fortune, sl, matrix)
- Text processing tools
- System monitoring commands

### Applications (80+)

**System Tools**: File Manager, Terminal, System Monitor, Settings, Software Center, Disk Analyzer, Task Manager, Process Monitor, Network Monitor, Firewall, User Manager, Backup Tool, Archive Manager, System Dashboard, Performance Monitor, Log Viewer

**Development**: Code Editor, Code Playground, Code Studio, API Tester, JSON Formatter, Regex Tester, GitHub Trending, Code Snippets Manager, Data Visualization, Quick Commands, Command Reference, Task Automation

**Office**: Text Editor, Markdown Editor, Spreadsheet, Presentation, Calendar, Todo List, Notes, Mind Map, Sticky Notes Wall, Kanban Board, Project Manager, Task Dashboard, Activity Tracker, Dictionary, Translator, Character Map

**Network**: Browser, IP & DNS Lookup, Weather, News Reader, Cryptocurrency Tracker, Cloud Sync, Email Client, Chat, Learning Platform

**Multimedia**: Music Player, Video Player, Paint, Image Viewer, Music Visualizer, Camera, Sound Recorder, Screen Recorder, PDF Viewer, Whiteboard

**Utilities**: Calculator, Password Manager, Pomodoro Timer, Color Picker, QR Generator, Unit Converter, Currency Converter, Voice Transcriber, Magnifier, Font Viewer, System Toolbox

**Games**: Snake, Tetris, Virtual Pet, Particle System

## Technology Stack

- React 19 - UI component framework
- TypeScript 6 - Type-safe development
- Zustand 5 - State management
- Vite 8 - Build tool
- Pyodide 0.26 - In-browser Python runtime
- Lucide React - Icon library

## Project Structure

```
web-linux/
├── src/
│   ├── apps/              # Application components (80+ apps)
│   ├── components/        # Core UI components
│   │   └── desktop/       # Desktop, Windows, Taskbar, Launcher
│   ├── store.tsx          # Zustand global state management
│   ├── apps.tsx           # Application registry
│   ├── types.ts           # TypeScript type definitions
│   ├── icons.tsx          # Custom icon components
│   └── index.css          # Global styles and themes
├── public/                # Static assets
└── package.json           # Project configuration
```

## Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `Super + T` | Open Terminal |
| `Super + E` | Open File Manager |
| `Super + B` | Open Browser |
| `Super + ,` | Open Settings |
| `Super + K` | Smart Search |
| `Super + Shift + L` | Open Launcher |
| `Alt + Tab` | Switch Windows |
| `Ctrl + Alt + 1-4` | Switch Virtual Desktop |
| `Ctrl + W` | Close Window |
| `F11` | Fullscreen Toggle |
| `PrintScreen` | Screenshot Tool |

## API Integrations

WebLinuxOS integrates the following public APIs:

- **Open-Meteo** - Weather data
- **ipapi.co** - IP geolocation
- **Cloudflare DNS** - DNS lookup
- **GitHub API** - GitHub trending repositories
- **NewsAPI** - News data

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Contributions are welcome! Please submit issues and pull requests.

## License

MIT License

## Changelog

### v3.6.0 (2026-05-26)
- System Health Check application - Comprehensive system health monitoring
- Enhanced weather app with better UI and detailed forecasts
- Health score visualization with animated conical progress indicator
- Fixed ActivityTracker pure function issue
- Code quality improvements

### v3.5.0 (2026-05-26)
- Activity Tracker application - Track application usage patterns
- Learning Platform application - Interactive learning resources
- Enhanced AI Helper with code generation
- System Dashboard with comprehensive metrics

### v3.4.0 (2026-05-26)
- System Dashboard application - Integrated monitoring and statistics
- IP & DNS Lookup tool - Real API integration
- Performance Monitor application - Real-time monitoring

### v3.3.0 (2026-05-26)
- System Monitor application - Real-time CPU, memory, disk, network monitoring
- Dynamic charts for CPU and memory trends

### v3.2.0 (2026-05-26)
- IP & DNS Lookup tool integration

### v3.1.0 (2026-05-26)
- Code Snippets Manager with 16 programming languages support
- Tag categorization and full-text search
- Import/export functionality
