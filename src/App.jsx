import React from "react";
import Signup from "./components/signup/Signup";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/signin/SignIn";
import { ProtectedRoute } from "./routes/PrivateRoutes";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import Donor from "./components/donors/Donor";


function App() {
  return (
    
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route exact path="/profile" element={<Profile />} /> 
        <Route exact path="/donor" element={<Donor />} />
        </Route>
      <Route exact path="/" element={<Signup />} />
      <Route exact path="/signin" element={<SignIn />} />
    </Routes>
  );
}

export default App;
