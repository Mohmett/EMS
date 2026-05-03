import { createContext, use, useContext, useEffect, useState } from "react";
import supabase from "../lib/SupabaseClient";
import { useAuth } from "./AuthContext";


const ProfileContext = createContext(null)

export const ProfileProvider = ({ children }) => {

    const [profileInfo, setProfileInfo] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        if(!user) return
        const getProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single()
                    setProfileInfo(data)
            } catch (error) {
                console.log(error, "Cilad ayaa ka dhacday getProfile Context")
            }

        }

        getProfile()
    }, [user])

    const value = {
        profileInfo,
        // role:profileInfo.user_role,
    }

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    )
}

export const useProfile=()=>{
    const context = useContext(ProfileContext)

    if(context === null){
        console.log("The is no data in ProfileContext")
    }
    return context
}