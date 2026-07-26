import { v4 as uuidv4 } from 'uuid';
import api from './api';

/**
 * Detect browser name from userAgent string
 */
const detectBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edge') || ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome') && !ua.includes('Chromium')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Chromium')) return 'Chromium';
  return 'Unknown';
};

/**
 * Detect operating system from userAgent
 */
const detectOS = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Windows NT 10.0')) return 'Windows 10/11';
  if (ua.includes('Windows NT')) return 'Windows';
  if (ua.includes('Mac OS X')) return 'macOS';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('CrOS')) return 'ChromeOS';
  return 'Unknown';
};

/**
 * Detect device type
 */
const detectDevice = () => {
  const ua = navigator.userAgent;
  if (/iPad|tablet/i.test(ua)) return 'Tablet';
  if (/Mobi|Android|iPhone/i.test(ua)) return 'Mobile';
  return 'Desktop';
};

/**
 * Get or create persistent visitor ID (stored in localStorage)
 */
const getVisitorId = () => {
  let id = localStorage.getItem('_va_visitor_id');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('_va_visitor_id', id);
  }
  return id;
};

/**
 * Get or create session ID (stored in sessionStorage — resets on tab close)
 */
const getSessionId = () => {
  let id = sessionStorage.getItem('_va_session_id');
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem('_va_session_id', id);
  }
  return id;
};

/**
 * Main tracker — collects visitor data and sends to backend.
 * Called once on app mount.
 */
export const trackVisitor = async () => {
  try {
    const payload = {
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      browser: detectBrowser(),
      os: detectOS(),
      device: detectDevice(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language || 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
      page: window.location.pathname,
      referrer: document.referrer || 'Direct',
    };

    await api.post('/visit', payload);
  } catch (error) {
    // Fail silently — tracking should never break the app
    console.warn('Visitor tracking failed:', error.message);
  }
};
