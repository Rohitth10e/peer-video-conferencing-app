import {Navigate} from "react-router-dom";

export const useAuth = () => {
    const token = localStorage.getItem("authToken");

    const isAuthenticated = !!token;

    return { isAuthenticated };
}

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if(!isAuthenticated) {
        return <Navigate to="/" />
    }
    return children;
}

export { ProtectedRoute };