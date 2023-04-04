import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hook/UseAuth";

export const SpecialRoute = () => {
  const user = useAuth();
  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};
