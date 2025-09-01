import React from "react";
import { Navigate } from "react-router-dom";
// import { Permissions } from "../types/Permissions";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allow?: Permissions[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = localStorage.getItem("userData");

    if (user) {
        return <Navigate to="/organization" replace />;
    }

//   if (!user) {
//     return (
//       <Navigate
//         to="/status/unauthenticated"
//         replace
//         state={{ message: "Efetue login para continuar." }}
//       />
//     );
//   }

//   if (user.userRole === Permissions.INTERN) {
//     return <>{children}</>;
//   }

//   if (!allow || allow.length === 0) {
//     return <>{children}</>;
//   }

//   if (!allow.includes(user.userRole)) {
//     return (
//       <Navigate
//         to="/status/forbidden"
//         replace
//         state={{ message: "Você não tem permissão para acessar esta página." }}
//       />
//     );
//   }

  return <>{children}</>;
};

export default ProtectedRoute;
