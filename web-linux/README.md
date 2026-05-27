# WebLinuxOS

A complete Linux desktop environment running entirely in the browser. Experience the power of a full operating system with 100+ applications, all accessible from any modern web browser.

![WebLinuxOS Screenshot](https://raw.githubusercontent.com/saya-ch/WebLinuxOS/main/assets/screenshot.png)

## Overview

WebLinuxOS is a feature-rich web-based Linux desktop environment that brings the power of a full operating system experience directly to your browser. No installation required - simply visit the live demo and start using it immediately.

This project demonstrates advanced web technologies including React 19, TypeScript, and modern CSS to create an immersive desktop experience that rivals native applications.

## Key Features

### Desktop Environment

- **Multi Virtual Desktops** - Support for up to 9 virtual desktops with window management across desktops
- **Advanced Window Management** - Drag, resize, minimize, maximize, close with smooth animations
- **Dynamic Wallpapers** - Multiple live wallpaper effects including particles, interactive mode, and waves
- **Start Menu** - Quick access to all applications via Super key or click
- **Taskbar** - Window switching, desktop indicators, system tray with quick settings
- **Context Menus** - Right-click menus on desktop and windows
- **Global Keyboard Shortcuts** - Comprehensive shortcut support for power users

### Terminal Emulator

- **80+ Built-in Commands** - Comprehensive Linux command coverage
- **Python 3 Runtime** - Full Python support via Pyodide (in-browser execution)
- **Command History** - Persistent history with arrow key navigation
- **Auto-completion** - Smart tab completion for commands and file paths
- **Advanced Commands** - dig, nc, file, stat, chmod, chown, hostnamectl, timedatectl, ip, cheat sheets
- **Fun Commands** - cowsay, fortune, sl, matrix, asciiart

### Virtual File System

- **Persistent Storage** - Data saved to localStorage
- **Complete File Operations** - Create, read, write, rename, copy, move, delete
- **Undo/Redo** - Full operation history
- **File Search** - Global file search functionality
- **File Associations** - Open files with appropriate applications

### Applications (100+)

#### System Tools
File Manager, Terminal, System Monitor, Settings, Software Center, Disk Analyzer, Task Manager, Process Monitor, Network Monitor, Firewall, User Manager, Backup Tool, Archive Manager, System Dashboard, Performance Monitor, Log Viewer, System Health Check, System Toolbox, System Info, Power Manager

#### Development
Code Editor, Code Playground, Code Studio, API Tester, JSON Formatter, Regex Builder, Regex Tester, GitHub Trending, Code Snippets Manager, Data Visualization, Quick Commands, Command Reference, Task Automation, Developer Toolkit, Code Diff Viewer, Code Reviewer

#### Office
Text Editor, Markdown Editor, Spreadsheet, Presentation, Calendar, Todo List, Notes, Mind Map, Sticky Notes Wall, Kanban Board, Project Manager, Task Dashboard, Activity Tracker, Dictionary, Translator, Character Map

#### Network
Browser, IP & DNS Lookup, Weather, News Reader, Cryptocurrency Tracker, Cloud Sync, Email Client, Chat, AI Helper, Learning Platform

#### Multimedia
Music Player, Video Player, Paint, Image Viewer, Music Visualizer, Camera, Sound Recorder, Screen Recorder, PDF Viewer, Whiteboard

#### Utilities
Calculator, Password Manager, Pomodoro Timer, Color Picker, QR Generator, Unit Converter, Currency Converter, Voice Transcriber, Magnifier, Font Viewer, System Toolbox, Focus Mode, Quick Launcher, Clipboard Manager, Clipboard History

#### Games
Snake, Tetris, Virtual Pet, Particle System

### API Integrations

WebLinuxOS integrates several public APIs for real-time data:

- **Open-Meteo** - Weather data and forecasts
- **ipapi.co** - IP geolocation services
- **Cloudflare DNS** - DNS query tools
- **GitHub API** - GitHub trending repositories
- **ExchangeRate-API** - Currency exchange rates

## Technology Stack

- **React 19** - UI component framework with latest features
- **TypeScript 6** - Type-safe development
- **Zustand 5** - Lightweight state management
- **Vite 8** - Lightning-fast build tool
- **Pyodide 0.26** - In-browser Python runtime
- **Lucide React** - Consistent icon library
- **Terser** - Code minification and optimization

## Quick Start

```bash
# Clone the repository
git clone https://github.com/saya-ch/WebLinuxOS.git

# Navigate to project directory
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

| Shortcut | Action |
|----------|--------|
| `Super` | Open launcher |
| `Super + T` | Open terminal |
| `Super + E` | Open file manager |
| `Super + B` | Open browser |
| `Super + K` | Global search |
| `Super + P` | Command palette |
| `Alt + Tab` | Window switcher |
| `Ctrl + Alt + Arrow` | Switch desktop |
| `Ctrl + Alt + [1-9]` | Go to desktop |
| `Ctrl + Shift + Alt + [1-9]` | Move window to desktop |
| `Super + Q` | Close window |
| `Super + M` | Minimize window |
| `F11` | Toggle fullscreen |
| `PrintScreen` | Screenshot |

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Project Structure

```
web-linux/
├── public/              # Static assets and manifest
├── src/
│   ├── apps/            # 100+ application components
│   ├── components/      # Core UI components
│   │   └── desktop/     # Desktop, Taskbar, StartMenu, WindowManager
│   ├── icons/          # Custom SVG icons
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Entry point
│   ├── store.tsx       # Zustand state management
│   ├── apps.tsx        # Application registry
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Performance Optimizations

WebLinuxOS implements several performance optimizations:

- **Code Splitting** - Each application is loaded on-demand
- **GPU Acceleration** - CSS transforms and transitions use GPU
- **Debounced State Updates** - Efficient localStorage persistence
- **Virtualized Lists** - Large data sets render efficiently
- **Lazy Loading** - Heavy components load when needed
- **Content Visibility** - Automatic rendering optimization

## Accessibility

- Screen reader friendly with ARIA labels
- Keyboard navigation support
- High contrast mode support
- Focus management
- Semantic HTML structure

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests. When contributing:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Acknowledgments

- [Lucide Icons](https://lucide.dev/) - Beautiful open-source icons
- [Pyodide](https://pyodide.org/) - Python in the browser
- [Open-Meteo](https://open-meteo.com/) - Free weather API
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- All open source contributors

## Support

If you encounter any issues or have suggestions:

- Open an issue on GitHub
- Check the documentation
- Join our community discussions

## Live Demo

**Experience WebLinuxOS**: [https://saya-ch.github.io/WebLinuxOS/](https://saya-ch.github.io/WebLinuxOS/)

---

Built with modern web technologies. No installation required. Works everywhere.
