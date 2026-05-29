# WebLinuxOS

A fully functional web-based Linux desktop operating system simulation built with React, TypeScript, and Zustand. Experience a complete desktop environment right in your browser.

## Demo

Visit the live demo at: [https://saya-ch.github.io/WebLinuxOS/](https://saya-ch.github.io/WebLinuxOS/)

## Features

### Desktop Environment
- **Multi-window Management**: Drag, resize, minimize, maximize, and close windows with smooth animations
- **Virtual Desktop**: Multiple virtual desktops with customizable wallpapers
- **Taskbar**: Quick access to running applications and system tray
- **Start Menu**: Application launcher with categories and search
- **System Tray**: Network, volume, battery, and notification indicators
- **Global Search**: Quick app launcher and file search with fuzzy matching
- **Command Palette**: Keyboard-driven command execution

### Applications (120+)
- **Productivity**: Notepad, TextEditor, CodeEditor, MarkdownEditor, Notes, TodoList, Calendar, Contacts
- **Developer Tools**: CodeStudio, CodePlayground, Terminal, DevTools, RegexBuilder, ApiTester
- **Media**: MusicPlayer, VideoPlayer, ImageViewer, Camera, Screenshot, ScreenRecorder
- **Communication**: Email, RealTimeTranslator, Translator
- **System**: FileManager, TaskManager, SystemMonitor, SystemSettings, ProcessMonitor, DiskUsage
- **Utilities**: Calculator, ColorPicker, QRGenerator, UnitConverter, CurrencyConverter, PasswordManager
- **Graphics**: Paint, Whiteboard, MindMap
- **Learning**: Flashcards, Dictionary, LearningPlatform
- **AI Integration**: ChatAI, AIGenerator, SmartSearch
- **Entertainment**: Weather, NewsReader, Games
- **Creative**: MarkdownSlides, RecipeBook, IdeaCapture

### Terminal Emulator
100+ built-in commands including:
- **File Operations**: ls, cd, pwd, cat, mkdir, touch, rm, cp, mv, tree, find, grep
- **System Monitoring**: top, htop, ps, df, free, uptime, vmstat, iostat, iotop
- **Network Tools**: ping, curl, wget, nmap, traceroute, nslookup, tcpdump, host, whois
- **Process Management**: systemctl, journalctl, cron, at, strace
- **Text Processing**: sed, awk, sort, uniq, head, tail, wc, diff, jq
- **Encoding Tools**: base64, urlencode, hash, uuid, fetch
- **System Info**: neofetch, uname, hostname, lsb_release
- **Fun Commands**: cowsay, fortune, matrix, starwars, asciiart
- **Mathematics**: calc, prime, factor, bc, expr
- **And many more...**

### Technical Stack
- React 19.2.6 - UI framework
- TypeScript - Type system
- Zustand 5 - State management
- Vite 8 - Build tool
- Pyodide 0.26 - Python runtime (browser-based)
- Lucide React - Icon library

## Keyboard Shortcuts

### Global Shortcuts
- `Ctrl+Shift+L` - Open Launcher
- `Ctrl+Shift+S` - Open Settings
- `Ctrl+Shift+F` - Open File Manager
- `Ctrl+Shift+T` - Open Terminal
- `Ctrl+M` - Maximize/Restore Window
- `Ctrl+N` - New Terminal
- `Ctrl+W` - Close Window
- `Ctrl+Shift+K` - Open Smart Search
- `F11` - Fullscreen Toggle
- `PrintScreen` - Screenshot

### Desktop Switching
- `Ctrl+Alt+1-9` - Switch to Desktop N
- `Ctrl+Alt+Left/Right` - Switch to Previous/Next Desktop
- `Ctrl+Shift+Alt+1-9` - Move Window to Desktop N

### Window Management
- `Alt+Tab` - Cycle Windows
- `Alt+Shift+Tab` - Cycle Windows (Reverse)
- `Ctrl+Shift+Arrow Up/Down` - Switch to Same App Window

## Development

### Prerequisites
- Node.js 18+
- npm 9+

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

# Build for production
npm run build
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:github` - Build for GitHub Pages
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture

```
src/
├── apps/           # Application components
├── components/      # Reusable UI components
│   └── desktop/    # Desktop environment components
├── store.tsx       # Zustand state management
├── types.ts        # TypeScript type definitions
├── apps.tsx        # Application registry
└── main.tsx        # Application entry point
```

### State Management

The application uses Zustand for global state management:
- `windows` - Window state (position, size, z-index, visibility)
- `files` - Virtual file system
- `theme` - Theme settings (light/dark)
- `wallpaper` - Desktop wallpaper
- `apps` - Registered applications

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Acknowledgments

- React team for the amazing UI framework
- Vite team for the fast build tool
- Pyodide team for enabling Python in the browser
- Lucide team for the beautiful icons
- All open source libraries used in this project
- All contributors and users of WebLinuxOS

## Statistics

- 120+ Pre-installed applications
- 100+ Terminal commands
- 500+ TypeScript components
- Zero external API dependencies (core features)
- Built-in Python runtime via Pyodide

## Tips

1. **Quick App Launch**: Use `Ctrl+Shift+K` to quickly search and launch apps
2. **Multi-tasking**: Use virtual desktops (`Ctrl+Alt+1-9`) to organize your workspace
3. **Terminal Power**: The terminal has 100+ built-in commands - try `help` to explore
4. **Customization**: Right-click on desktop to access settings and wallpaper options
5. **Python**: Type `python` in terminal to start an interactive Python session
6. **Weather**: Use the weather app or `weather` command to check forecasts
7. **Translation**: Use the Translator app for multi-language translations

## API Integration

Some applications use external APIs:
- **Weather**: Open-Meteo API for weather data
- **Translation**: MyMemory API for multi-language translation
- **All APIs are free and do not require API keys**