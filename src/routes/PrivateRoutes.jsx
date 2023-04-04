import { CircularProgress, Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import SignIn from "../components/signin/SignIn"
import useAuth from '../hook/UseAuth'

export const ProtectedRoute = () => {
  const user = useAuth();

  console.log("/////user autheticated", user);

  return typeof user === "undefined" ? (
    <Stack display="flex" justifyContent="center" alignItems="center" mt={30}>
      <CircularProgress
        color="success"
      />
    </Stack>
  ) : user ? (
    <Outlet />
  ) : (
    <SignIn />
  );
};
