import { Navigate } from "react-router";

interface IProps {
    children: React.ReactNode;
    isAuthenticated: boolean;
}

export default function ProtectedRoute({ children, isAuthenticated}: IProps) {
    if (!isAuthenticated){
        return <Navigate to={"/login"}/>
    }
    return children;
}