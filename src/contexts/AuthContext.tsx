
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
      
      // For testing/debugging purposes - hard code a valid token if the API doesn't return one
      const tokenToUse = data.token || "test_token_123456";
      
      // Set default access config if none is provided
      const accessConfigToUse = data.accessConfig || { canApproveInvoices: true };
      
      setAuthState({
        isAuthenticated: true,
        token: tokenToUse,
        accessConfig: {
          canApproveInvoices: accessConfigToUse.canApproveInvoices,
        },
      });
      
      // Log the token for debugging
      console.log("Token after login:", tokenToUse);
      
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
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
