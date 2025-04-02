import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AllApi } from "../CommonApiContainer/AllApi";

const authContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 const  [department , setDepartments] = useState();


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
    if (backendUser) {
    //  localStorage.setItem("token",tokens); // Store token
      setUser(backendUser); // Update user state
    }
    else{
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");

  };


//fetch department
   const fetchDataResponce = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `${AllApi.getDepartment.url}`,{
            headers : {
              "Authorization" : `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
         if(response.data.sucess){
          setLoading(false);
            setDepartments(response?.data?.data);

         }
        
      } catch (error) {
        console.log(error);
      } finally{
        setLoading(false);
      }
    
    };

    //call the department function
    useEffect(()=>{
      fetchDataResponce();
    },[user])


  return (
    <authContext.Provider value={{ user, login, logout, loading  , fetchDataResponce , department , setDepartments}}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
export default AuthContextProvider;
