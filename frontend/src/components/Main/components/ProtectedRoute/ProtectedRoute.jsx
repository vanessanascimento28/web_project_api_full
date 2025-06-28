import { Navigate } from "react-router-dom";

function ProtectedRoute({ isLoggedIn, children}) {
    console.log(isLoggedIn)
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;