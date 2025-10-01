Ocean Professional Theme
- Primary: #2563EB (Ocean Blue)
- Secondary/Success: #F59E0B (Amber)
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827

Notes:
- Environment variables must define API and WS base URLs at runtime by setting window.__APP_API_BASE__ and window.__APP_WS_URL__ before Angular bootstraps.
- Example injection:
  <script>
    window.__APP_API_BASE__ = 'https://your-backend/api';
    window.__APP_WS_URL__ = 'wss://your-backend/ws';
  </script>
