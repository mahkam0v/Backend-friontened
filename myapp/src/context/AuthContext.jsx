import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { loginApi } from '../api';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const refreshTimerRef = useRef(null);

  // Bug 3 fix: refreshToken bilan accessToken ni avtomatik yangilash
  const scheduleRefresh = useCallback((accessToken) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    try {
      const pl = parseJwt(accessToken);
      const expiresIn = pl.exp * 1000 - Date.now();
      // Muddati tugashidan 1 daqiqa oldin yangilash
      const refreshIn = Math.max(expiresIn - 60 * 1000, 0);

      refreshTimerRef.current = setTimeout(async () => {
        const storedRefresh = localStorage.getItem('refreshToken');
        if (!storedRefresh) return;
        try {
          const res = await fetch('http://localhost:3002/api/users/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: storedRefresh }),
          });
          if (!res.ok) throw new Error('Refresh failed');
          const data = await res.json();
          const newAccess = data.accessToken;
          localStorage.setItem('token', newAccess);
          setToken(newAccess);
          scheduleRefresh(newAccess);
        } catch {
          // Refresh muvaffaqiyatsiz — logout
          logout();
        }
      }, refreshIn);
    } catch {
      // Token parse qilib bo'lmadi
    }
  }, []);

  useEffect(() => {
    if (token) scheduleRefresh(token);
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginApi(email, password);
    const tok = data.token || data.access_token || data.accessToken;
    if (!tok) throw new Error('Serverdan token kelmadi');

    // Bug 3 fix: refreshToken ni ham saqlaymiz
    const refreshTok = data.refreshToken || data.refresh_token;

    const pl = parseJwt(tok);
    const userData = {
      name: data.user?.name || data.name || pl.name || email.split('@')[0],
      email: data.user?.email || data.email || pl.email || email,
      role: data.user?.role || data.role || pl.role || 'user',
      id: data.user?.id || data.id || pl.id || pl.sub || '',
    };

    localStorage.setItem('token', tok);
    localStorage.setItem('user', JSON.stringify(userData));
    if (refreshTok) {
      localStorage.setItem('refreshToken', refreshTok);
    }

    setToken(tok);
    setUser(userData);
    scheduleRefresh(tok);
    return userData;
  }, [scheduleRefresh]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
