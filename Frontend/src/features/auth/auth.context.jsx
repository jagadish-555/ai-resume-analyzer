import {useState, createContext, useEffect, useRef} from 'react';
import {getSession} from './services/auth.api';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const initialized = useRef(false)

    useEffect(() => {
        if (initialized.current) {
            return
        }
        initialized.current = true

        const getAndSetUser = async () => {
            try {
                const userData = await getSession();
                setUser(userData?.user ?? null);
            } catch (err) {
                console.error("Session bootstrap failed:", err?.message || err)
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        getAndSetUser();
    },[])

    return (
        <AuthContext.Provider value = {{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}