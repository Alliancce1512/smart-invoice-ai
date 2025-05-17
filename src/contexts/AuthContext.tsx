
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

interface AccessConfig {
  canApproveInvoices: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  accessConfig: AccessConfig | null;
}

interface LoginResponse {
  status: number;
  token: string;
  userId?: string;
  accessConfig: AccessConfig | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<LoginResponse | undefined>;
  logout: () => void;
  sessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
  userId: null,
  accessConfig: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check if there's existing auth data in localStorage
    const savedToken = localStorage.getItem("smartinvoice_token");
    const savedAccessConfig = localStorage.getItem("smartinvoice_accessConfig");
    const savedUserId = localStorage.getItem("smartinvoice_user_id");
    
    if (savedToken && savedAccessConfig) {
      return {
        isAuthenticated: true,
        token: savedToken,
        userId: savedUserId,
        accessConfig: JSON.parse(savedAccessConfig),
      };
    }
    
    return initialAuthState;
  });
  
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  // Save auth data to localStorage whenever it changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.token) {
      localStorage.setItem("smartinvoice_token", authState.token);
      localStorage.setItem("smartinvoice_accessConfig", JSON.stringify(authState.accessConfig));
      if (authState.userId) {
        localStorage.setItem("smartinvoice_user_id", authState.userId);
      }
    } else {
      localStorage.removeItem("smartinvoice_token");
      localStorage.removeItem("smartinvoice_accessConfig");
      localStorage.removeItem("smartinvoice_user_id");
    }
  }, [authState]);

  const login = async (username: string, password: string): Promise<LoginResponse | undefined> => {
    try {
      const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      
      // Check if login was successful
      if (data.status === 0) {
        setAuthState({
          isAuthenticated: true,
          token: data.token,
          userId: data.userId || username, // Store userId or fallback to username
          accessConfig: {
            canApproveInvoices: data.accessConfig?.canApproveInvoices || false,
          },
        });
        
        // Reset session expired state
        setSessionExpired(false);
        
        navigate("/");
      }
      
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    // Reset auth state
    setAuthState(initialAuthState);
    
    // Reset theme to light mode
    setTheme("light");
    
    // Clear session storage
    sessionStorage.clear();
    
    // Reset session expired state
    setSessionExpired(false);
    
    // Navigate to login
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        sessionExpired,
        setSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
