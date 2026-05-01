import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()


export const AuthProvider = ({ children}) =>{
    const [user, setUser] = useState(null)
    const[loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const bootstrapAuth = async () => {
            try {
                const data = await getMe()
                if (!cancelled) {
                    setUser(data?.user ?? null)
                }
            } catch {
                if (!cancelled) {
                    setUser(null)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        bootstrapAuth()

        return () => {
            cancelled = true
        }
    }, [])


    return(
        <AuthContext.Provider value = {{user,setUser,loading,setLoading}} >
            {children}
        </AuthContext.Provider>
    )
}
