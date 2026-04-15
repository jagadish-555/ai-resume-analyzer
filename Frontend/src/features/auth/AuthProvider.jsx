import { useState, useEffect } from 'react';
import { AuthContext } from './auth.context';
import { getSession } from './services/auth.api';

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const getAndSetUser = async () => {
            try {
                const userData = await getSession();
                if (isMounted) setUser(userData?.user ?? null);
            } catch (err) {
                console.error("Session bootstrap failed:", err?.message || err)
                if (isMounted) setUser(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        getAndSetUser();

        return () => {
            isMounted = false;
        };
    },[])

    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}
