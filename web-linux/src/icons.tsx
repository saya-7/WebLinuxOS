import React from 'react';

export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

export const FileManagerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export const TerminalIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
    <path d="M6 10l2 2-2 2" />
    <path d="M12 14h4" />
  </svg>
);

export const TextEditorIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export const BrowserIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const CodeEditorIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export const CalculatorIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="16" y1="14" x2="16" y2="18" />
    <line x1="16" y1="10" x2="16" y2="10" />
    <line x1="12" y1="14" x2="12" y2="18" />
    <line x1="8" y1="14" x2="8" y2="18" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const WeatherIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

export const SystemMonitorIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51v-.09a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const NotepadIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export const ImageViewerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export const MusicPlayerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const VideoPlayerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="3" y1="10" x2="7" y2="10" />
    <line x1="3" y1="14" x2="7" y2="14" />
    <line x1="17" y1="10" x2="21" y2="10" />
    <line x1="17" y1="14" x2="21" y2="14" />
    <line x1="3" y1="18" x2="7" y2="18" />
    <line x1="17" y1="18" x2="21" y2="18" />
  </svg>
);

export const PDFViewerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);

export const PackageManagerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

export const SoftwareCenterIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export const DiskUsageIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

export const TaskManagerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
  </svg>
);

export const ProcessMonitorIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M2 12h10" />
    <path d="M20 6h-10" />
    <path d="M20 18h-10" />
    <circle cx="16" cy="12" r="4" />
  </svg>
);

export const NetworkMonitorIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

export const FirewallIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9.5 14.5l2.5-2.5 2.5 2.5" />
  </svg>
);

export const UserManagerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3 4 4 0 0 12,21 21" />
    <path d="M16 3.13a4 4 0 0 1 0 0 0 0" />
    <path d="M16 8a4 4 0 0 0-4-4" />
  </svg>
);

export const ScreenshotIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-2h6l2 2h4a2 2 0 0 1 2 2v11z" />
    <circle cx="12" cy="13" r="3" />
    <path d="M8 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    <path d="M16 4h5a2 2 0 0 1 2 2v11" />
  </svg>
);

export const PaintIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

export const SpreadsheetIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

export const PresentationIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
    <line x1="7" y1="10" x2="13" y2="10" />
    <line x1="9" y1="6" x2="9" y2="14" />
    <line x1="11" y1="14" x2="15" y2="10" />
  </svg>
);

export const EmailIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const ContactsIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <path d="M4 12h16" />
  </svg>
);

export const NotesIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);

export const TodoListIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export const PasswordManagerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const BackupToolIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M19 21H5a2 2 0 0 1-2-2v-9h18v9a2 2 0 0 1-2 2z" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const ArchiveManagerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <polyline points="8 7 8 3 16 3 16 7" />
    <rect x="6" y="7" width="12" height="14" rx="2" />
    <line x1="10" y1="12" x2="14" y2="12" />
    <line x1="10" y1="16" x2="14" y2="16" />
  </svg>
);

export const DiskUtilityIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const LogViewerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

export const CharacterMapIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="9" y2="10" />
    <line x1="15" y1="20" x2="15" y2="10" />
    <line x1="12" y1="15" x2="12" y2="8" />
  </svg>
);

export const FontViewerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="9" y2="10" />
    <line x1="15" y1="20" x2="15" y2="10" />
    <line x1="12" y1="13" x2="12" y2="13" />
  </svg>
);

export const DictionaryIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export const TranslatorIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M5 8l6 6" />
    <path d="M4 14l6-6 2-3 2 3 6-6" />
  </svg>
);

export const MapsIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <polygon points="22 12 18 22 2 18 6 2 22 12" />
    <polyline points="18 22 6 2" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-2h6l2 2h4a2 2 0 0 1 2 2v11z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const ScreenRecorderIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <circle cx="12" cy="12" r="5" />
  </svg>
);

export const SoundRecorderIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const BluetoothIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M6.5 6.5l11 11-5 5V2l5 5-11 11" />
  </svg>
);

export const WifiIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

export const PowerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    <line x1="12" y1="2" x2="12" y2="12" />
  </svg>
);

export const AboutIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const HelpIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const CommandRefIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

export const ColorPickerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

export const MagnifierIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export const SnakeIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="7" x2="9" y2="7" />
    <line x1="7" y1="11" x2="7" y2="13" />
    <line x1="7" y1="13" x2="9" y2="13" />
  </svg>
);

export const TetrisIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="7" x2="7" y2="9" />
    <line x1="9" y1="7" x2="9" y2="9" />
    <line x1="11" y1="7" x2="11" y2="9" />
    <line x1="13" y1="7" x2="13" y2="9" />
    <line x1="7" y1="9" x2="9" y2="9" />
  </svg>
);

export const PenguinIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <path d="M12 2L14 7H10L12 2Z" />
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
    <circle cx="9" cy="10" r="1.5" />
    <circle cx="15" cy="10" r="1.5" />
    <path d="M8 16C8 16 9.5 18 12 18C14.5 18 16 16 16 16" />
  </svg>
);

export type IconComponentType = React.FC<IconProps>;

export const Icons: Record<string, IconComponentType> = {
  files: FileManagerIcon,
  terminal: TerminalIcon,
  'text-editor': TextEditorIcon,
  browser: BrowserIcon,
  'code-editor': CodeEditorIcon,
  calculator: CalculatorIcon,
  calendar: CalendarIcon,
  clock: ClockIcon,
  weather: WeatherIcon,
  'system-monitor': SystemMonitorIcon,
  settings: SettingsIcon,
  notepad: NotepadIcon,
  'image-viewer': ImageViewerIcon,
  'music-player': MusicPlayerIcon,
  'video-player': VideoPlayerIcon,
  'pdf-viewer': PDFViewerIcon,
  'package-manager': PackageManagerIcon,
  'software-center': SoftwareCenterIcon,
  'disk-usage': DiskUsageIcon,
  'task-manager': TaskManagerIcon,
  'process-monitor': ProcessMonitorIcon,
  'network-monitor': NetworkMonitorIcon,
  firewall: FirewallIcon,
  'user-manager': UserManagerIcon,
  screenshot: ScreenshotIcon,
  paint: PaintIcon,
  spreadsheet: SpreadsheetIcon,
  presentation: PresentationIcon,
  email: EmailIcon,
  chat: ChatIcon,
  contacts: ContactsIcon,
  notes: NotesIcon,
  'todo-list': TodoListIcon,
  'password-manager': PasswordManagerIcon,
  'backup-tool': BackupToolIcon,
  'archive-manager': ArchiveManagerIcon,
  'disk-utility': DiskUtilityIcon,
  'log-viewer': LogViewerIcon,
  'character-map': CharacterMapIcon,
  'font-viewer': FontViewerIcon,
  dictionary: DictionaryIcon,
  translator: TranslatorIcon,
  maps: MapsIcon,
  camera: CameraIcon,
  'screen-recorder': ScreenRecorderIcon,
  'sound-recorder': SoundRecorderIcon,
  bluetooth: BluetoothIcon,
  wifi: WifiIcon,
  power: PowerIcon,
  about: AboutIcon,
  help: HelpIcon,
  'command-ref': CommandRefIcon,
  'color-picker': ColorPickerIcon,
  magnifier: MagnifierIcon,
  'game-snake': SnakeIcon,
  'game-tetris': TetrisIcon,
  penguin: PenguinIcon,
};
