// routes/PublicRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";


type PublicRouteProps = {
  children: React.ReactNode;
};

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const user = localStorage.getItem("userData");

  

  return <>{children}</>;
};

export default PublicRoute;
