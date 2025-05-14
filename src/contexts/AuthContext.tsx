
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AccessConfig {
  canApproveInvoices: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  accessConfig: AccessConfig | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
  accessConfig: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check if there's existing auth data in localStorage
    const savedToken = localStorage.getItem("smartinvoice_token");
    const savedAccessConfig = localStorage.getItem("smartinvoice_accessConfig");
    
    if (savedToken && savedAccessConfig) {
      return {
        isAuthenticated: true,
        token: savedToken,
        accessConfig: JSON.parse(savedAccessConfig),
      };
    }
    
    return initialAuthState;
  });
  
  const navigate = useNavigate();

  // Save auth data to localStorage whenever it changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.token) {
      localStorage.setItem("smartinvoice_token", authState.token);
      localStorage.setItem("smartinvoice_accessConfig", JSON.stringify(authState.accessConfig));
    } else {
      localStorage.removeItem("smartinvoice_token");
      localStorage.removeItem("smartinvoice_accessConfig");
    }
  }, [authState]);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook-test/smartinvoice/login", {
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
      
      // Check if the login was successful by examining the status
      if (data.status !== 1) {
        toast.error("Invalid credentials");
        throw new Error("Invalid credentials");
      }
      
      // Only update state if login was successful
      if (data.token) {
        setAuthState({
          isAuthenticated: true,
          token: data.token,
          accessConfig: {
            canApproveInvoices: data.accessConfig?.canApproveInvoices || false,
          },
        });
        
        navigate("/");
      } else {
        toast.error("Login failed - No token received");
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setAuthState(initialAuthState);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
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
