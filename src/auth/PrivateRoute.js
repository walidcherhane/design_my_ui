import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
const Private = () => {
  const {isAuth} = useAuth()
  return isAuth ? <Outlet /> : <Navigate to="/login" replace/>;
};
export default Private;