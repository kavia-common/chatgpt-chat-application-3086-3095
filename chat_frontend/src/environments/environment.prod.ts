/* global window:readonly, location:readonly */
export const environment = {
  production: true,
  // PUBLIC_INTERFACE
  /** Base URL for REST API calls. Must be set via environment during deployment. */
  apiBaseUrl: (typeof window !== 'undefined' && (window as any).__APP_API_BASE__) || '/api',
  // PUBLIC_INTERFACE
  /** WebSocket endpoint URL. Must be set via environment during deployment. */
  wsUrl:
    (typeof window !== 'undefined' && (window as any).__APP_WS_URL__) ||
    (typeof location !== 'undefined'
      ? (location.protocol === 'https:' ? `wss://${location.host}/ws` : `ws://${location.host}/ws`)
      : 'wss://localhost/ws'),
};
