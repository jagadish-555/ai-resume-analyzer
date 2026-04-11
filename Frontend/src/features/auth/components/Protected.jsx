import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import LoadingScreen from "../../../components/LoadingScreen";


const Protected = ({ children }) => {

    const { loading, user } = useAuth();
    if (loading) {
        return <LoadingScreen message="Loading..." />
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}
export default Protected;