# WebLinuxOS

> A fully functional Linux desktop environment running entirely in the browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react)](https://react.dev/)
[![TypeScript 6](https://img.shields.io/badge/TypeScript-6-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite)](https://vite.dev/)

**[Live Demo](https://saya-ch.github.io/WebLinuxOS/)**

---

## Overview

WebLinuxOS is a complete Linux desktop environment simulator that runs entirely in the browser with zero backend dependencies. It features a full window management system, a virtual file system, a terminal emulator with 40+ built-in commands and Python runtime support, and 56 pre-installed applications spanning system utilities, office tools, internet clients, multimedia editors, development tools, and games.

Every component -- from the file manager to the terminal, from the code editor to the camera -- is built from scratch using modern web technologies. The entire desktop experience loads in a single page and requires no server, no installation, and no setup.

## Features

- **Window Management** -- Drag, resize, minimize, maximize, and focus management with z-index stacking
- **Virtual File System** -- Hierarchical file tree with cross-application file sharing via CustomEvent
- **Terminal Emulator** -- 40+ built-in commands with Python runtime powered by Pyodide
- **Code Editor** -- Syntax highlighting and live Python execution in the browser
- **Web Browser** -- Real webpage loading via iframe with navigation controls
- **Music Player** -- Audio playback using the Web Audio API
- **Camera** -- Real webcam access with live filters
- **Sound Recorder** -- Audio recording via the MediaRecorder API
- **Screen Recorder** -- Screen capture via the getDisplayMedia API
- **System Monitoring** -- Real-time CPU, memory, and network charts rendered with Canvas
- **Glassmorphism UI** -- Translucent panels, smooth animations, and micro-interactions
- **Zero Backend** -- Everything runs client-side; no server required

## Screenshots

[Screenshot placeholder]

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
git clone https://github.com/saya-ch/WebLinuxOS.git
cd WebLinuxOS/web-linux
npm install
```

### Development

```bash
npm run dev
```

Open the local development server URL shown in your terminal.

### Production Build

```bash
npm run build
npm run preview
```

## Applications

WebLinuxOS ships with 56 applications organized into seven categories.

### System (20)

| Application | Description |
|---|---|
| File Manager | Browse and manage the virtual file system |
| Terminal | Command-line interface with 40+ commands and Python runtime |
| System Monitor | Real-time CPU, memory, and network monitoring with charts |
| System Settings | Desktop theme, wallpaper, and system configuration |
| Software Center | Browse and install available applications |
| Package Manager | Manage system packages and dependencies |
| Disk Usage Analyzer | Visualize disk space usage across directories |
| Disk Utility | Manage virtual disk partitions and storage |
| Process Monitor | View and manage running processes |
| Network Monitor | Monitor network traffic and connections |
| Firewall | Configure firewall rules and security policies |
| User Manager | Manage user accounts and permissions |
| Power Manager | Monitor power status and battery settings |
| Bluetooth Manager | Manage Bluetooth devices and connections |
| Wi-Fi Manager | Configure wireless network connections |
| Log Viewer | Browse and search system logs |
| Backup Tool | Create and restore system backups |
| Task Manager | Manage running tasks and applications |
| About | System information and version details |
| Help | User guide and documentation |

### Office (11)

| Application | Description |
|---|---|
| Text Editor | Full-featured text editing with syntax support |
| Notepad | Lightweight plain text editor |
| Calendar | Date picker and event management |
| PDF Viewer | View PDF documents |
| Spreadsheet | Create and edit spreadsheets |
| Presentation | Create and present slides |
| Contacts | Manage contact information |
| Notes | Rich-text note-taking |
| Todo List | Task tracking and management |
| Dictionary | Word definitions and lookup |
| Translator | Translate text between languages |

### Internet (4)

| Application | Description |
|---|---|
| Web Browser | Browse the web with iframe-based page loading |
| Email Client | Compose and manage email messages |
| Instant Messenger | Real-time chat interface |
| Maps | Interactive map viewer |

### Multimedia (6)

| Application | Description |
|---|---|
| Image Viewer | View and browse image files |
| Music Player | Audio playback with Web Audio API |
| Video Player | Play video files |
| Paint | Drawing and image editing canvas |
| Camera | Webcam access with live filters |
| Screen Recorder | Record screen via getDisplayMedia |
| Sound Recorder | Record audio via MediaRecorder API |

### Utilities (10)

| Application | Description |
|---|---|
| Calculator | Standard and scientific calculations |
| Clock | World clock, timer, and stopwatch |
| Weather | Current conditions and forecast display |
| Password Manager | Store and manage credentials securely |
| Screenshot Tool | Capture screen regions |
| Color Picker | Select and convert color values |
| Character Map | Browse and insert Unicode characters |
| Font Viewer | Preview installed fonts |
| Magnifier | Screen magnification tool |
| Archive Manager | Create and extract archives |

### Development (2)

| Application | Description |
|---|---|
| Code Editor | Syntax highlighting with Python execution via Pyodide |
| Command Reference | Searchable terminal command documentation |

### Games (2)

| Application | Description |
|---|---|
| Snake | Classic snake arcade game |
| Tetris | Classic tetris puzzle game |

## Architecture

WebLinuxOS follows a component-driven architecture built on React 19 with centralized state management via Zustand. The desktop environment is composed of four core UI layers:

- **Desktop** -- Renders the wallpaper, desktop icons, and handles right-click context menus
- **Window Manager** -- Manages window lifecycle, z-index stacking, and focus order
- **Window** -- Individual window chrome with drag, resize, minimize, maximize, and close controls
- **Taskbar** -- Application launcher, running app indicators, and system tray

Applications communicate through a shared virtual file system and cross-application messaging via CustomEvent. Each application is registered in a central app registry that defines its metadata, default dimensions, resize behavior, and whether multiple instances are allowed.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI component framework |
| TypeScript | 6 | Type-safe development |
| Zustand | 5 | Global state management |
| Vite | 8 | Build tool and dev server |
| Pyodide | - | In-browser Python runtime |
| Web Audio API | - | Audio playback and processing |
| MediaRecorder API | - | Audio recording |
| getDisplayMedia API | - | Screen capture |
| Canvas API | - | Real-time chart rendering |

## Project Structure

```
web-linux/
  src/
    apps/           # 56 application components
    components/     # Desktop, Window, Taskbar, StartMenu
    store.ts        # Zustand global state
    apps.tsx        # Application registry
    icons.tsx       # SVG icon components
    types.ts        # TypeScript type definitions
    index.css       # Global styles
    App.tsx         # Root component
    main.tsx        # Entry point
```

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please ensure your code passes linting (`npm run lint`) and builds successfully (`npm run build`) before submitting.

## License

[MIT](https://opensource.org/licenses/MIT)
