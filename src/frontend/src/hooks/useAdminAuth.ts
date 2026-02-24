import { useState, useEffect } from 'react';
import { useActor } from './useActor';

interface AdminSession {
  email: string;
  timestamp: number;
}

const SESSION_KEY = 'adminSession';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useAdminAuth() {
  const { actor } = useActor();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = () => {
      try {
        const sessionData = sessionStorage.getItem(SESSION_KEY);
        if (sessionData) {
          const session: AdminSession = JSON.parse(sessionData);
          const now = Date.now();
          
          // Check if session is still valid
          if (now - session.timestamp < SESSION_DURATION) {
            setIsAuthenticated(true);
            setAdminEmail(session.email);
          } else {
            // Session expired
            sessionStorage.removeItem(SESSION_KEY);
            setIsAuthenticated(false);
            setAdminEmail(null);
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        sessionStorage.removeItem(SESSION_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    if (!actor) {
      throw new Error('Actor not available');
    }

    try {
      const isValid = await actor.adminLogin(email, password);
      
      if (isValid) {
        const session: AdminSession = {
          email,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setIsAuthenticated(true);
        setAdminEmail(email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  const adminLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setAdminEmail(null);
  };

  return {
    isAuthenticated,
    isLoading,
    adminEmail,
    adminLogin,
    adminLogout,
  };
}
