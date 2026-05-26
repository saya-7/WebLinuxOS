# WebLinuxOS

A complete Linux desktop environment running in the browser.

## Overview

WebLinuxOS is a feature-rich web-based Linux desktop environment that runs entirely in your browser without requiring any installation. It provides a realistic window management system, virtual file system, terminal emulator, and a rich ecosystem of applications.

**Key Features:**
- Complete desktop experience with multi-window management and virtual desktops
- Virtual file system with file operations and persistent storage
- Feature-rich terminal with 80+ commands and Python runtime support
- 70+ pre-installed applications covering development, office, entertainment, and utilities
- Real API integrations providing practical network tools

## Desktop Environment

- **Multi Virtual Desktops**: Support for up to 4 desktops with window management
- **Window Management**: Drag, resize, minimize, maximize, and close windows
- **Right-click Context Menu**: Quick access to common actions
- **Dynamic Wallpaper**: Support for static and animated wallpapers
- **Dark/Light Theme**: Theme switching support
- **Global Shortcuts**: Comprehensive keyboard shortcuts

## Terminal Emulator

- 80+ built-in commands (ls, cd, cat, mkdir, rm, neofetch, etc.)
- Python 3 runtime support (based on Pyodide)
- Command history and auto-completion
- Fun commands (cowsay, fortune, sl, matrix, figlet)
- Text processing tools (base64, hash, calc, prime)

## Applications

### System Tools
- File Manager, Terminal, System Monitor, Settings, Software Center, Disk Analyzer, Task Manager

### Development Tools
- Code Editor, Code Playground, API Tester, JSON Formatter, Regex Tester, GitHub Trending, Code Snippets Manager

### Office Tools
- Text Editor, Markdown Editor, Spreadsheet, Presentation, Calendar, Todo List, Notes, Mind Map, Sticky Notes Wall

### Network Tools
- Browser, IP & DNS Lookup, Weather, News Reader, Cryptocurrency Tracker

### Multimedia
- Music Player, Video Player, Paint, Image Viewer, Music Visualizer, Camera, Sound Recorder

### Utilities
- Calculator, Password Manager, Pomodoro Timer, Color Picker, QR Generator, Unit Converter, Currency Converter, Voice Transcriber

## Technology Stack

- React 19 - UI component framework
- TypeScript - Type-safe development
- Zustand 5 - State management
- Vite 8 - Build tool
- Pyodide 0.26 - In-browser Python runtime
- Lucide React - Icon library

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone repository
git clone https://github.com/saya-ch/WebLinuxOS.git

# Navigate to directory
cd WebLinuxOS/web-linux

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
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
| `Ctrl + M` | Minimize Window |
| `Ctrl + Shift + M` | Maximize Window |
| `F11` | Fullscreen Toggle |
| `PrintScreen` | Screenshot Tool |

## Project Structure

```
web-linux/
├── src/
│   ├── apps/              # Application components (70+ apps)
│   ├── components/        # Core UI components
│   │   └── desktop/       # Desktop, Windows, Taskbar, Launcher
│   ├── store.tsx          # Zustand global state management
│   ├── apps.tsx           # Application registry
│   ├── types.ts           # TypeScript type definitions
│   ├── icons.tsx          # Custom icon components
│   └── index.css          # Global styles and theme variables
├── public/                # Static assets
└── package.json           # Project configuration
```

## API Integrations

WebLinuxOS integrates the following public APIs:

- **Open-Meteo** - Weather data
- **ipapi.co** - IP geolocation
- **Cloudflare DNS** - DNS lookup
- **GitHub Trending** - GitHub trending repositories
- **NewsAPI** - News data

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Contributions are welcome. Please submit issues and pull requests.

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## License

MIT License

## Changelog

### v3.4.0 (2026-05-26)

**New Features**
- System Dashboard application - Integrates system monitoring, process management, and resource usage statistics
- IP & DNS Lookup tool - Supports IP geolocation and DNS record lookup
- Performance Monitor application - Real-time monitoring of CPU, memory, and network activity

**Code Quality Improvements**
- Fixed TypeScript type definition issues
- Optimized component rendering performance
- Improved build configuration
- Enhanced error handling mechanisms

### v3.3.0 (2026-05-26)

**New Features**
- System Monitor application - Real-time monitoring of CPU, memory, disk, and network activity
- Integrated system dashboard displaying system information and process list
- Dynamic charts showing CPU and memory usage trends

**Code Quality Improvements**
- Fixed Date.now() impure function call in AIHelper component
- Fixed useEffect setState cascade rendering issue in ActivityTracker component
- Removed unused variables and functions in SystemMonitor component
- Optimized component rendering performance

### v3.2.0 (2026-05-26)

**New Features**
- IP & DNS Lookup tool - Integrates real APIs for IP geolocation and DNS record lookup

**Code Quality Improvements**
- Fixed ESLint errors and unnecessary escape characters
- Fixed React 19 purity warnings and optimized component rendering performance
- Improved code formatting in code snippets manager
- Optimized TypeScript type definitions in IPLookup component

### v3.1.0 (2026-05-26)

- Added Code Snippets Manager application
- Support for 16 programming languages
- Tag categorization and full-text search
- Import/export functionality