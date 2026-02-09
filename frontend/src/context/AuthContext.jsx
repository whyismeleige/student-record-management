import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/lib/api/auth.api";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authApi.getProfile();
        console.log("The response is", response.data.user);
        if (response.data?.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);


  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
      toast.success("Welcome back!");
      return true; 
    } catch (error) {
      throw error; 
    }
  };

  const register = async (credentials) => {
    try {
      const response = await authApi.register(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out");
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      console.error("Logout failed", error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};