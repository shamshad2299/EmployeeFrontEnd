import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AllApi } from "../CommonApiContainer/AllApi";

const authContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const verifyUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setLoading(true);
        const { data } = await axios.get(AllApi.verifyUser.url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data?.success) {
          setUser(data.user);
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, [user?._id]);

  const login = (backendUser) => {
    if (backendUser?.token) {
      localStorage.setItem("token", backendUser.token); // Store token
      setUser(backendUser.user); // Update user state
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");

  };

  return (
    <authContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
export default AuthContextProvider;
