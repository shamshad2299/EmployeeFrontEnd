import { createContext, useContext, useEffect, useState } from "react";
//import {useNavigate} from "react-router-dom"
import axios from "axios";
import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom";
import { AllApi } from "../CommonApiContainer/AllApi";

const authContext = createContext();

const AuthContextProvider = ({ children }) => {
 
  const [user, setuser] = useState(null);
  const [loading , setLoading] = useState(true);

  //const[viewEmployee, setViewEmployee] = useState(false);


     const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setLoading(true);
          const dataResponce = await axios.get(
            AllApi.verifyUser.url,
            {
              headers: {
                Authorization: `bearer ${token}`,
              },
            }
          );
        //  console.log(dataResponce);
          if(dataResponce?.data?.success){
            setuser(dataResponce?.data?.user);
            setLoading(false);
          }
          else{
           setuser(null);
         
          }
        }
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false);
      }
    };


    // call the function inSide useEffect hook
  useEffect(()=>{
  verifyUser();
  },[])
 

  const login = (backendUser) => {
    setuser(backendUser);

    
  };
  const logout = () => {

    setuser(null);
    localStorage.removeItem("token");
    toast.success("Logout successfully");


  };


  return (
    <authContext.Provider value={{ user, login, logout,loading }}>
      {children}
    </authContext.Provider>
  );
};
export const useAuth = () => useContext(authContext);
export default AuthContextProvider;
