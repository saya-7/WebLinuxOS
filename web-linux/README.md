# WebLinuxOS

A fully functional web-based Linux desktop environment that runs entirely in the browser. Built with React, TypeScript, and modern web technologies, it provides a complete desktop experience without any installation required.

## Live Demo

Visit the live demo at: [https://saya-ch.github.io/WebLinuxOS/](https://saya-ch.github.io/WebLinuxOS/)

## Overview

WebLinuxOS brings the power of a Linux desktop to your browser. It features a modern, responsive interface with multi-window management, virtual desktops, and over 120 applications - all running client-side with no backend dependencies.

## Key Features

### Complete Desktop Environment

WebLinuxOS delivers a fully functional Linux desktop experience directly in your browser:

- **Multi Virtual Desktops** - Create and switch between multiple workspaces with customizable wallpapers
- **Advanced Window Management** - Drag, resize, minimize, maximize, and close windows with smooth animations
- **Smart Launcher** - Application launcher with fuzzy search and categorized app listing (120+ apps)
- **System Tray** - Quick access to network, volume, battery, and notification indicators
- **Global Search** - Fast app launcher and file search powered by fuzzy matching
- **Command Palette** - Keyboard-driven command execution for power users (Ctrl+P)
- **Context Menus** - Right-click menus with file operations and quick actions
- **Live Wallpapers** - Interactive particle effects and dynamic backgrounds
- **Boot Splash** - Elegant animated loading screen

### Development Tools

A comprehensive suite for developers:

- **Code Editor** with syntax highlighting and multiple themes
- **API Tester** with request builder and history
- **JSON Formatter & Validator** with syntax highlighting
- **Regex Builder & Tester** with real-time validation
- **GitHub Trending** repository viewer
- **Command Reference** documentation
- **Task Automation** workflow builder
- **Code Snippets Manager** for storing and organizing code
- **Python REPL** via Pyodide (Python 3 runtime in browser)
- **Terminal Emulator** with 90+ built-in commands

### Office & Productivity

Essential tools for productivity:

- **Text Editor** with formatting options
- **Markdown Editor** with live preview
- **Spreadsheet** application with formula support
- **Calendar** with event management
- **Todo List & Kanban Board** for task management
- **Project Planner** with timeline views and Gantt charts
- **Notes & Mind Map** tools for organization
- **Presentation** creator with slides
- **Flashcards** for learning and memorization

### Utilities & Tools

Handy utilities for everyday tasks:

- **Calculator** with scientific functions
- **Password Manager** with encryption
- **Pomodoro Timer** for productivity
- **Color Picker** with palette generation
- **QR Code Generator** with customization
- **Unit & Currency Converter** with real-time rates
- **Real-time Translator** supporting multiple languages
- **Online Toolkit** - JSON, Base64, URL encoding/decoding, hash calculation

### Multimedia

Media applications:

- **Music Player** with playlist support and visualization
- **Video Player** with controls and subtitle support
- **Paint** application with drawing tools
- **Image Viewer** with zoom and navigation
- **Camera & Screen Recorder** for capture
- **Sound Recorder** for audio recording
- **Image Optimizer** for compression

### Entertainment & Lifestyle

Fun applications:

- **Weather** application with forecasts and hourly data
- **World Clock** with multiple time zones
- **News Reader** with RSS feed support
- **Classic games** (Snake, Tetris)
- **Virtual Pet** companion
- **Particle System** visualizer

### Terminal Emulator

The built-in terminal provides a full-featured command-line experience:

- 90+ built-in shell commands (ls, cd, cat, mkdir, rm, cp, mv, find, grep, etc.)
- Python 3 runtime via Pyodide
- Command history and auto-completion
- File system navigation and operations
- System information commands (neofetch, uptime, df, free, ps, top)
- Calculator and utility functions
- Fun commands (cowsay, fortune, ASCII art, sl)
- Git, npm, node commands
- Network commands (ping, curl, wget)

### Web Services Integration

Real-time data from public APIs:

- Weather data from Open-Meteo
- IP geolocation from ipapi.co
- Cryptocurrency prices from CoinGecko
- Currency conversion rates
- Air quality index data
- GitHub trending repositories

## Quick Start

```bash
# Clone the repository
git clone https://github.com/saya-ch/WebLinuxOS.git

# Navigate to the project directory
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

## Keyboard Shortcuts

### System Navigation

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+L | Open launcher |
| Ctrl+K | Open global search |
| Ctrl+P | Command palette |
| Alt+Tab | Cycle windows |
| Ctrl+Alt+Tab | Cycle windows reverse |
| F11 | Toggle fullscreen |
| PrintScreen | Screenshot |
| Ctrl+Q | Close window |
| Ctrl+M | Minimize window |

### Application Launch

| Shortcut | Application |
|----------|-------------|
| Super+T | Terminal |
| Super+E | File Manager |
| Super+, | Settings |
| Super+B | Browser |
| Super+A | Calculator |
| Super+G | Code Editor |
| Super+H | Help |
| Super+D | System Monitor |

### Virtual Desktops

| Shortcut | Action |
|----------|--------|
| Ctrl+Alt+1-9 | Switch to desktop |
| Ctrl+Alt+Arrow | Switch workspace |
| Ctrl+Shift+Alt+1-9 | Move window to desktop |
| Ctrl+Shift+Alt+Arrow | Move window and follow |

## Technology Stack

WebLinuxOS is built with modern, production-ready technologies:

- **React 19** - UI component framework with concurrent features
- **TypeScript 6** - Type-safe development with advanced type inference
- **Zustand 5** - Lightweight state management
- **Vite 8** - Fast build tool with hot module replacement
- **Pyodide** - Python runtime in the browser
- **Lucide React** - Beautiful, consistent icon library
- **Marked** - Markdown parsing and rendering

## Performance Optimizations

WebLinuxOS includes several performance optimizations:

- **Code Splitting** - Applications are split into separate chunks for faster loading
- **Lazy Loading** - Components load on demand to reduce initial bundle size
- **GPU Acceleration** - CSS animations leverage hardware acceleration
- **Memoization** - React.memo and useMemo prevent unnecessary re-renders
- **Content Visibility** - Optimized rendering for long lists
- **Tree Shaking** - Unused code is eliminated during build
- **Debounced Storage** - LocalStorage operations are optimized
- **Virtual Scrolling** - Efficient rendering for large lists

## Browser Compatibility

WebLinuxOS supports all modern browsers:

- Chrome 90+ (Recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Features

- Input sanitization for all user inputs
- Safe expression evaluation in terminal calculator
- Local storage encryption for sensitive data
- No external API keys exposed in client code
- Content Security Policy headers for XSS protection

## Architecture Highlights

### Window Management

The sophisticated window management system supports:

- Z-index based window layering
- Window minimize/maximize/restore with animations
- Window drag and resize with constraints
- Multi-monitor awareness
- Window state persistence across sessions
- Focus management with keyboard navigation

### Virtual File System

Complete file system with:

- Hierarchical folder structure
- Full file operations (create, delete, rename, move, copy)
- Undo/redo support
- LocalStorage persistence
- File type icons and metadata
- Drag and drop support

### State Management

Zustand-powered centralized state:

- Application registry
- Window state tracking
- Desktop icons management
- Theme and wallpaper settings
- User preferences
- File system operations
- Notification system

## Project Structure

```
web-linux/
├── src/
│   ├── apps/           # Application components (120+ apps)
│   ├── components/     # Desktop UI components
│   │   └── desktop/   # Desktop, Taskbar, Window management
│   ├── store.tsx      # Zustand state management
│   ├── apps.tsx       # Application registry
│   ├── icons.tsx      # Icon definitions
│   └── types.ts       # TypeScript type definitions
├── public/            # Static assets
├── index.html         # Entry HTML
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Pyodide for enabling Python in the browser
- Lucide for beautiful icons
- React team for the component framework
- Vite team for the build tool
- All open source libraries used in this project

---

Built with React, TypeScript, and modern web technologies
