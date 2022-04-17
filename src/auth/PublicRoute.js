import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
const Public = () => {
  const {isAuth} = useAuth()
  return !isAuth ? <Outlet /> : <Navigate to="/posts" replace/>;
};
export default Public;