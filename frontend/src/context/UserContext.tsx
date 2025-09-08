import {createContext, useEffect, useState, useContext} from 'react'

type User = {
    username: string,
    email: string,
    name: string,
    company: string,
    job: string,
    location: string,
}

type UserContextType = {
    user: User | null
    setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined >(undefined)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if(storedUser){
            try{
                setUser(JSON.parse(storedUser))
            } catch {
                setUser(null)
            }
        }
    },[])

    return(
        <UserContext.Provider value={{ user, setUser }}>
            { children }
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if(!context){
        throw new Error('useUser must be defined')
    }
    return context
}