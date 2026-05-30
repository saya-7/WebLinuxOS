# WebLinuxOS

A fully functional web-based Linux desktop environment that runs entirely in the browser.

## Live Demo

Visit the live demo at: [https://saya-ch.github.io/WebLinuxOS/](https://saya-ch.github.io/WebLinuxOS/)

## Overview

WebLinuxOS brings the power of a Linux desktop to your browser. It features a modern, responsive interface with multi-window management, virtual desktops, and over 120 applications - all running client-side with no backend dependencies.

## Features

### Desktop Environment

- Multi Virtual Desktops with customizable wallpapers
- Advanced Window Management with smooth animations
- Smart Launcher with fuzzy search and categorized app listing
- System Tray with network, volume, battery indicators
- Global Search and Command Palette
- Context Menus and Live Wallpapers
- Boot Splash screen

### Development Tools

- Code Editor with syntax highlighting
- API Tester, JSON Formatter, Regex Builder
- GitHub Trending viewer
- Python REPL via Pyodide
- Terminal with 90+ commands

### Office & Productivity

- Text/Markdown Editors, Spreadsheet
- Calendar, Todo List, Kanban Board
- Project Planner, Notes, Mind Map
- Presentation creator, Flashcards

### Utilities

- Calculator, Password Manager, Pomodoro Timer
- Color Picker, QR Generator, Unit Converter
- Real-time Translator
- Online Toolkit (JSON, Base64, URL encoding)

### Multimedia

- Music/Video Players
- Paint, Image Viewer
- Camera, Screen Recorder, Sound Recorder

### Entertainment

- Weather app, World Clock, News Reader
- Snake and Tetris games
- Virtual Pet, Particle System

### Terminal Features

- 90+ built-in shell commands
- Python 3 via Pyodide
- Command history and auto-completion
- File system operations
- Calculator, weather, translate functions

## Quick Start

```bash
# Clone and install
git clone https://github.com/saya-ch/WebLinuxOS.git
cd WebLinuxOS/web-linux
npm install

# Development
npm run dev

# Build and deploy
npm run build
npm run deploy
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+L | Open launcher |
| Ctrl+K | Global search |
| Ctrl+P | Command palette |
| Alt+Tab | Cycle windows |
| Ctrl+Q | Close window |

## Technology Stack

- React 19 + TypeScript 6
- Zustand 5 for state management
- Vite 8 for build
- Pyodide for Python runtime
- Lucide React for icons

## License

MIT License
