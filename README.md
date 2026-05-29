# WebLinuxOS

A fully-featured Linux desktop environment running entirely in the browser. Experience a complete operating system without installation.

## Overview

WebLinuxOS brings the power of a Linux desktop to your browser. Built with modern web technologies, it delivers a native-like desktop experience with window management, file system, terminal emulator, and over 100 applications.

## Key Features

### Desktop Environment
- Multi virtual desktops (up to 9 workspaces)
- Advanced window management with smooth animations
- Dynamic live wallpapers with particle effects
- Start menu with Super key support
- Taskbar with window switching and system tray
- Context menus and global keyboard shortcuts

### Terminal Emulator
- 90+ built-in Linux commands
- Full Python 3 runtime via Pyodide
- Command history with arrow key navigation
- Smart tab completion
- System monitoring tools (vmstat, iostat, df, free, ps, top)
- Entertainment commands (cowsay, fortune, sl, matrix, figlet)

### Virtual File System
- Persistent storage using localStorage
- Complete file operations (create, read, write, rename, copy, move, delete)
- Undo/redo support (Ctrl+Z/Ctrl+Y)
- Global file search
- File associations

### Web Services Integration
- Real-time weather forecasts
- IP geolocation
- World clock with multiple timezones
- Real-time currency conversion
- Cryptocurrency tracking

## Applications

**System Tools**: File Manager, Terminal, System Monitor, Settings, Software Center, Disk Analyzer, Task Manager, Network Monitor, Firewall, Backup Tool, Archive Manager, Performance Monitor, Log Viewer, System Health Check

**Development**: Code Editor, Code Playground, API Tester, JSON Formatter, Regex Builder, GitHub Trending, Code Snippets Manager, Data Visualization, AI Code Assistant, Code Generator

**Office**: Text Editor, Markdown Editor, Spreadsheet, Presentation, Calendar, Todo List, Notes, Mind Map, Kanban Board, Project Planner, Translator, Dictionary

**Network**: Browser, Weather, News Reader, Cryptocurrency Tracker, Email Client, Chat, AI Helper, Learning Platform

**Multimedia**: Music Player, Video Player, Paint, Image Viewer, Camera, Sound Recorder, Screen Recorder, PDF Viewer, Whiteboard

**Utilities**: Calculator, Password Manager, Pomodoro Timer, Color Picker, QR Generator, Unit Converter, Voice Transcriber, Clipboard Manager, Quick Launcher

**Games**: Snake, Tetris, Virtual Pet, Particle System

## Technology Stack

- React 19 with Concurrent Features
- TypeScript 6
- Zustand 5 (state management)
- Vite 8 (build tool)
- Pyodide 0.26 (Python runtime)
- Lucide React (icons)

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
| `Super` or `Ctrl+Shift+L` | Open launcher |
| `Super + T` | Open terminal |
| `Super + E` | Open file manager |
| `Super + B` | Open browser |
| `Super + K` | Global search |
| `Super + P` | Command palette |
| `Alt + Tab` | Window switcher |
| `Ctrl + Alt + Arrow` | Switch desktop |
| `Ctrl + Alt + [1-9]` | Go to desktop |
| `Super + Q` | Close window |
| `Super + M` | Minimize window |
| `F11` | Toggle fullscreen |
| `PrintScreen` | Screenshot |

## API Integrations

WebLinuxOS integrates several public APIs:

- Open-Meteo (weather data)
- ipapi.co (IP geolocation)
- Cloudflare DNS (DNS resolution)
- GitHub API (trending repositories)
- ExchangeRate-API (currency exchange)
- CoinGecko (cryptocurrency prices)

## Browser Compatibility

- Chrome 90+ (Recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## Project Structure

```
web-linux/
├── public/              # Static assets
├── src/
│   ├── apps/            # Application components
│   ├── components/      # UI components
│   │   └── desktop/     # Desktop environment components
│   ├── icons/           # Custom icons
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Entry point
│   ├── store.tsx        # Zustand state management
│   ├── apps.tsx         # Application registry
│   └── index.css        # Global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Development

### Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript type checking
npm run format           # Format code with Prettier
npm run deploy           # Deploy to GitHub Pages
```

## Contributing

Contributions are welcome. Please submit issues and pull requests following these steps:

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run lint and typecheck
5. Submit a pull request

## License

MIT License

## Acknowledgments

Special thanks to:
- Lucide Icons (https://lucide.dev/)
- Pyodide (https://pyodide.org/)
- Open-Meteo (https://open-meteo.com/)
- CoinGecko (https://coingecko.com/)

## Live Demo

Visit the live demo at: [https://saya-ch.github.io/WebLinuxOS/](https://saya-ch.github.io/WebLinuxOS/)

---

Version: 4.3.0 | License: MIT