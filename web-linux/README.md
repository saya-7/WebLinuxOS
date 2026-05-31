# WebLinuxOS

A full-featured, browser-based Linux desktop environment. No backend required - everything runs client-side.

## Live Demo

Visit the live demo: [https://saya-ch.github.io/WebLinuxOS/](https://saya-ch.github.io/WebLinuxOS/)

## Overview

WebLinuxOS brings the Linux desktop experience to your browser. With a modern, responsive interface supporting multi-window management, virtual desktops, and 120+ applications - all running entirely client-side without backend dependencies.

This project demonstrates the possibilities of modern web technologies, combining the familiarity of traditional desktop environments with the accessibility of web applications.

## Key Features

### Desktop Environment

- **Multiple Virtual Desktops**: Switch between workspaces with customizable wallpapers
- **Advanced Window Management**: Smooth animations for opening, closing, minimizing, and maximizing windows
- **Smart Launcher**: Fuzzy search with categorized app lists
- **System Tray**: Network, volume, and battery indicators with quick controls
- **Global Search**: Search across apps and files
- **Command Palette**: Quick access to system commands
- **Context Menus**: Right-click menus for files and desktop
- **Dynamic Wallpapers**: Animated wallpapers with particles and interactive elements
- **Boot Screen**: Elegant startup animation

### Developer Tools

- **Code Editor**: Syntax highlighting for multiple languages with editing capabilities
- **API Tester**: Built-in REST API client supporting various HTTP methods
- **JSON Formatter**: Beautify, validate, and format JSON data
- **Regex Builder**: Interactive regex testing and building tool
- **GitHub Trending**: View trending repositories directly in the OS
- **Python REPL**: Full Python 3 runtime via Pyodide - run Python code in the browser
- **90+ Terminal Commands**: File operations, system monitoring, network tools, and utilities
- **Code Snippet Manager**: Save and organize code snippets for quick access
- **Component Sandbox**: Test and preview React components

### Office & Productivity

- **Text/Markdown Editor**: Rich text editing with live preview
- **Spreadsheet**: Basic spreadsheet functionality for data entry
- **Calendar**: Date and event management with calendar views
- **Todo List**: Task management with completion tracking
- **Kanban Board**: Visual task organization with drag-and-drop
- **Project Planner**: Timeline and milestone tracking
- **Smart Notes**: Smart notes with tags, colors, archiving, and import/export
- **Mind Map**: Node-based idea visualization
- **Presentation Creator**: Slide-based presentations
- **Flashcards**: Learning and memorization tool
- **Habit Tracker**: Track daily habits and progress
- **Smart Dashboard**: Real-time data dashboard with weather, crypto, and system stats

### Utilities

- **Calculator**: Scientific calculator with advanced functions and history
- **Password Manager**: Secure password storage with encryption
- **Pomodoro Timer**: Efficiency timer with customizable work sessions
- **Color Picker**: Color selection in various formats with clipboard copy
- **QR Code Generator**: Create QR codes for text, URLs, and contacts
- **Unit Converter**: Conversion between measurement units
- **Real-time Translator**: Multi-language translation
- **Online Toolkit**: JSON parsing, Base64 encoding, URL encoding
- **Clipboard Manager**: Advanced clipboard history and management
- **Screenshot Tool**: Desktop screenshots
- **Screen Recorder**: Record screen activity as video

### Multimedia

- **Music Player**: Audio playback with playlist support
- **Video Player**: Video playback with controls
- **Paint**: Basic drawing app with tools
- **Image Viewer**: View and zoom images
- **Camera**: Webcam access for video capture
- **Sound Recorder**: Audio recording with playback
- **Music Visualizer**: Audio visualization effects

### Entertainment

- **Weather App**: Current weather and forecast based on location data
- **World Clock**: Multiple timezone display
- **News Reader**: Latest news updates
- **Games**: Snake, Tetris, and other classic games
- **Virtual Pet**: Interactive pet simulation
- **Particle System**: Visual effect demonstrations

## Terminal Commands

The terminal supports over 90 commands, including:

### File Operations
- `ls`, `cd`, `pwd`, `cat`, `mkdir`, `touch`, `rm`, `cp`, `mv`, `tree`, `wc`, `du`

### System Information
- `whoami`, `hostname`, `date`, `uname`, `uptime`, `cal`, `free`, `df`, `ps`, `top`, `sysinfo`

### Network Tools
- `ping`, `ifconfig`, `curl`, `host`, `nslookup`, `dig`, `traceroute`, `nmap`

### System Monitoring
- `vmstat`, `iostat`, `netstat`, `ss`, `lsof`, `htop`, `btop`

### Utilities
- `echo`, `find`, `grep`, `env`, `export`, `which`, `file`

### Productivity Tools
- `translate`, `news`, `worldtime`, `todo`

### Security & Encryption
- `base64`, `hash`, `openssl`, `ssh-keygen`

### Math Tools
- `calc`, `bc`, `expr`, `seq`

### Fun Commands
- `cowsay`, `fortune`, `joke`, `advice`, `flip`, `rps`

## Quick Start

```bash
# Clone the repository
git clone https://github.com/saya-ch/WebLinuxOS.git
cd WebLinuxOS/web-linux

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+L | Open Launcher |
| Ctrl+K | Global Search |
| Ctrl+P | Command Palette |
| Alt+Tab | Switch Window |
| Ctrl+Q | Close Window |
| Ctrl+C | Copy |
| Ctrl+V | Paste |
| Ctrl+Shift+C | Terminal Interrupt |
| Ctrl+1-9 | Switch to Desktop |
| Ctrl+Alt+Arrow | Switch Desktop |
| Ctrl+Shift+1-9 | Move Window to Desktop |

## Tech Stack

- **React 19**: UI framework with latest features
- **TypeScript 6**: Type-safe development
- **Zustand 5**: Lightweight state management
- **Vite 8**: Optimized build tool
- **Pyodide**: Python runtime running entirely in the browser
- **Lucide React**: Beautiful icon library
- **Tailwind CSS**: Utility-first styling
- **IndexedDB**: Local storage for persistent data

## Architecture

WebLinuxOS follows a modular architecture:

```
src/
  apps/              # Individual applications
  components/
    desktop/         # Desktop environment components
  store/             # State management utilities
  types.ts           # TypeScript type definitions
  icons.tsx          # Icon components
  App.tsx            # Main application component
```

### Core Components

- **Desktop**: Main workspace with icons and wallpaper
- **WindowManager**: Handles window positioning and z-index
- **Taskbar**: System tray and window list
- **StartMenu**: Categorized app launcher
- **CommandPalette**: Quick command execution
- **GlobalSearch**: Cross-app search

### State Management

The application uses Zustand for state management, including:
- Window state tracking
- File system management
- Desktop configuration
- Theme and wallpaper settings
- User preferences

## Performance Optimization

WebLinuxOS is optimized for performance:

- **Code Splitting**: Applications load on demand
- **Lazy Loading**: Applications load only when opened
- **Memoization**: React components optimized with memo
- **Efficient Rendering**: Virtual lists and optimized updates
- **Caching**: localStorage for persistent data

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Note: Some features may require modern browser feature support.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run test`
5. Build: `npm run build`
6. Submit a pull request

### Development Guidelines

- All new code uses TypeScript
- Follow existing code patterns
- Add appropriate comments for complex logic
- Test thoroughly before committing
- Update documentation as needed

### Creating a New Application

To add a new application:

1. Create a new file in `src/apps/` (e.g., `MyApp.tsx`)
2. Export a default React component
3. Register the app in `src/apps.tsx`
4. Add app icon and metadata
5. Test the application

Example:

```typescript
import { memo } from 'react'

export default memo(function MyApp() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>My Application</h1>
      <p>Welcome to my new app!</p>
    </div>
  )
})
```

## License

MIT License - Free for personal or commercial use.

## Acknowledgments

- Inspired by various web-based operating systems and desktop environments
- Built using modern web technologies and best practices
- Community contributions and feedback welcome
- Special thanks to all contributors

## Statistics

- **120+ Applications**: Rich built-in application suite
- **90+ Terminal Commands**: Comprehensive command-line interface
- **150+ Source Files**: Modular and maintainable codebase
- **50+ Keyboard Shortcuts**: Efficient workflow

## Use Cases

WebLinuxOS is perfect for:

- **Learning**: Explore desktop environment concepts
- **Demonstration**: Showcase web application capabilities
- **Development**: Test web technologies
- **Accessibility**: Access your files from any device
- **Productivity**: Lightweight online workspace
- **Education**: Teaching programming and system concepts
- **Prototyping**: Rapid prototyping of desktop-class apps

## Support

If you encounter issues or have suggestions:

- Submit an issue on GitHub
- Check the documentation
- Review existing issues and solutions

## Roadmap

Planned future improvements:

- Enhanced mobile responsive design
- More applications and features
- Improved performance
- Additional language support
- Cloud synchronization
- PWA installation support
- Plugin system architecture
- Real-time collaboration features

## Changelog

### v5.0.0 (2026-05-31)

- Enhanced smart notes with tags, colors, archiving, and import/export
- New smart dashboard with real-time weather, crypto, and system monitoring
- Improved error handling and user feedback
- Better documentation and developer guides
- Performance optimizations
- Bug fixes and UI improvements

### v4.9.1 (Previous Release)

- 120+ applications
- Enhanced terminal with 90+ commands
- Improved window management
- New developer tools
- Better multimedia support

---

**Version**: 5.0.0
**Last Updated**: 2026-05-31
