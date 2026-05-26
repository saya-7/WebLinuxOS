# WebLinuxOS

A complete Linux desktop environment running entirely in your browser. No installation required.

[Live Demo](https://saya-ch.github.io/WebLinuxOS/) | [中文文档](#中文介绍)

## Overview

WebLinuxOS is a feature-rich web-based Linux desktop environment that provides a realistic window management system, virtual file system, terminal emulator, and a rich ecosystem of 80+ applications. It runs completely in the browser without requiring any backend services.

**Core Features:**
- Complete desktop experience with multi-window management and virtual desktops
- Virtual file system with persistent storage and file operations
- Feature-rich terminal with 80+ commands and Python 3 runtime support
- 80+ pre-installed applications covering development, office, entertainment, and utilities
- Real API integrations for practical network tools
- Activity tracking and productivity insights
- Dark/Light theme support with smooth transitions

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

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

# Access at http://localhost:5173
```

### Build and Deploy

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Key Features

### Desktop Environment

| Feature | Description |
|---------|-------------|
| **Multi Virtual Desktops** | Support for up to 4 virtual desktops with window management |
| **Window Management** | Drag, resize, minimize, maximize, and close windows with smooth animations |
| **Right-click Context Menu** | Quick access to common actions and settings |
| **Dynamic Wallpapers** | Support for static and animated wallpapers |
| **Theme Support** | Dark and light themes with smooth transitions |
| **Global Shortcuts** | Comprehensive keyboard shortcuts for power users |
| **Activity Tracking** | Monitor application usage patterns and productivity |

### Terminal Emulator

- **80+ Built-in Commands**: `ls`, `cd`, `cat`, `mkdir`, `rm`, `neofetch`, etc.
- **Python 3 Runtime**: Based on Pyodide for in-browser Python execution
- **Command History**: Auto-completion and command history
- **Fun Commands**: `cowsay`, `fortune`, `sl`, `matrix`, `figlet`
- **Text Processing**: `base64`, `hash`, `calc`, `prime`
- **System Monitoring**: `top`, `ps`, `df`, `free`

### Applications

#### System Tools
- File Manager, Terminal, System Monitor, Settings
- Disk Analyzer, Task Manager, Process Monitor, Network Monitor
- Firewall, User Manager, Backup Tool, Archive Manager
- System Dashboard, Performance Monitor, Log Viewer

#### Development Tools
- Code Editor, Code Playground, Code Studio, API Tester
- JSON Formatter, Regex Tester, GitHub Trending
- Code Snippets Manager, Data Visualization, Quick Commands
- Command Reference, Task Automation

#### Office Tools
- Text Editor, Markdown Editor, Spreadsheet, Presentation
- Calendar, Todo List, Notes, Mind Map, Sticky Notes Wall
- Kanban Board, Project Manager, Task Dashboard, Activity Tracker
- Dictionary, Translator, Character Map

#### Network Tools
- Web Browser, IP & DNS Lookup, Weather, News Reader
- Cryptocurrency Tracker, Cloud Sync, Email Client, Chat
- Learning Platform, Command Reference

#### Multimedia
- Music Player, Video Player, Paint, Image Viewer
- Music Visualizer, Camera, Sound Recorder, Screen Recorder
- PDF Viewer, Whiteboard

#### Utilities
- Calculator, Password Manager, Pomodoro Timer, Color Picker
- QR Generator, Unit Converter, Currency Converter, Voice Transcriber
- Magnifier, Font Viewer, System Toolbox

#### Games
- Snake Game, Tetris, Virtual Pet, Particle System

## Keyboard Shortcuts

### Application Shortcuts
| Shortcut | Action |
|----------|--------|
| `Super + T` | Open Terminal |
| `Super + E` | Open File Manager |
| `Super + B` | Open Browser |
| `Super + ,` | Open Settings |
| `Super + K` | Smart Search |
| `Super + Shift + L` | Open Launcher |
| `Super + A` | Calculator |
| `Super + P` | Paint |
| `Super + G` | Code Editor |

### Window Management
| Shortcut | Action |
|----------|--------|
| `Alt + Tab` | Cycle Windows |
| `Alt + Shift + Tab` | Cycle Windows (Reverse) |
| `Ctrl + W` | Close Window |
| `Ctrl + M` | Minimize Window |
| `F11` | Toggle Fullscreen |
| `PrintScreen` | Screenshot Tool |

### Virtual Desktop
| Shortcut | Action |
|----------|--------|
| `Ctrl + Alt + 1-4` | Switch to Desktop |
| `Ctrl + Alt + Left/Right` | Previous/Next Desktop |
| `Ctrl + Shift + Alt + 1-4` | Move Window to Desktop |
| `Ctrl + Shift + Alt + Arrow` | Move Window to Adjacent Desktop |

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI component framework |
| TypeScript | 6.x | Type-safe development |
| Zustand | 5.x | Lightweight state management |
| Vite | 8.x | Fast build tool |
| Pyodide | 0.26.x | In-browser Python runtime |
| Lucide React | 1.16.x | Icon library |

## API Integrations

WebLinuxOS integrates the following public APIs for real-time data:

- **Open-Meteo** - Weather data and forecasts
- **ipapi.co** - IP geolocation services
- **Cloudflare DNS** - DNS lookup
- **GitHub API** - Trending repositories
- **NewsAPI** - News data and headlines

## Project Structure

```
web-linux/
├── src/
│   ├── apps/              # Application components (80+ apps)
│   │   ├── FileManager.tsx
│   │   ├── Terminal.tsx
│   │   ├── Calculator.tsx
│   │   └── ...
│   ├── components/
│   │   └── desktop/       # Desktop environment components
│   │       ├── Desktop.tsx
│   │       ├── Window.tsx
│   │       ├── WindowManager.tsx
│   │       ├── Taskbar.tsx
│   │       └── StartMenu.tsx
│   ├── store.tsx           # Zustand global state management
│   ├── apps.tsx            # Application registry
│   ├── types.ts            # TypeScript type definitions
│   ├── icons.tsx           # Custom icon components
│   └── index.css           # Global styles and themes
├── public/                 # Static assets
├── package.json            # Project configuration
└── vite.config.ts          # Build configuration
```

## Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome/Chromium | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Inspired by modern Linux desktop environments
- Built with modern web technologies
- Special thanks to all contributors

---

## 中文介绍

### 简介

WebLinuxOS 是一个功能丰富的基于 Web 的 Linux 桌面环境。它在浏览器中运行完整桌面体验，包括多窗口管理、虚拟文件系统、终端模拟器和 80+ 预装应用程序。无需安装，直接在浏览器中使用。

### 主要特性

- **完整桌面体验**：多窗口管理、虚拟桌面、右键菜单
- **虚拟文件系统**：支持文件操作和持久化存储
- **功能强大的终端**：80+ 命令和 Python 3 运行时
- **80+ 预装应用**：涵盖开发、办公、娱乐和工具
- **真实 API 集成**：天气、IP查询、新闻等实用功能
- **深色/浅色主题**：流畅的主题切换
- **活动追踪**：监控应用使用模式和生产力洞察

### 技术栈

- React 19 + TypeScript 6
- Zustand 5 状态管理
- Vite 8 构建工具
- Pyodide Python 运行时
- Lucide React 图标库

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/saya-ch/WebLinuxOS.git

# 进入目录
cd WebLinuxOS/web-linux

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 应用分类

**系统工具**：文件管理器、终端、系统监视器、设置、软件中心、磁盘分析器等

**开发工具**：代码编辑器、API测试器、JSON格式化、正则测试、GitHub热门等

**办公工具**：文本编辑器、Markdown编辑器、电子表格、日历、待办事项、笔记等

**网络工具**：浏览器、IP查询、天气、新闻阅读器、邮件客户端等

**多媒体**：音乐播放器、视频播放器、画图、图片查看器、摄像头等

**实用工具**：计算器、密码管理器、番茄钟、取色器、单位转换器等

**游戏**：贪吃蛇、俄罗斯方块、虚拟宠物等

### 快捷键

- `Super + T` - 打开终端
- `Super + E` - 打开文件管理器
- `Super + B` - 打开浏览器
- `Super + K` - 智慧搜索
- `Super + Shift + L` - 打开启动器
- `Alt + Tab` - 切换窗口
- `Ctrl + W` - 关闭窗口

### 许可证

MIT 许可证

---

**版本**: 3.6.0 | **更新日期**: 2026-05-26
