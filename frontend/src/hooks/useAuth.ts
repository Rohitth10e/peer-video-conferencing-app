import {useNavigate} from "react-router-dom";

export const useAuth = () => {
    const token = localStorage.getItem("authToken");

    const isAuthenticated = !!token;

    return { isAuthenticated };
}

function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    if(!isAuthenticated) {
        return navigate("/login")
    }
    return children;
}

export { ProtectedRoute };