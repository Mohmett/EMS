import React, { Children, createContext, useContext, useEffect, useState } from 'react'
import supabase from '../lib/SupabaseClient'

import {getUserProfile, onAuthChange,} from '../lib/Auth';


export const AuthContext = createContext(null)
export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)



    useEffect(()=>{
        const cleanUp= onAuthChange ( async (user)=>{
            setUser(user);
            // console.log("Auth Change Detected, Current User:", user)
            if(user){
                try {
                    const userProfile= await getUserProfile()
                    setProfile(userProfile)
                } catch (error) {
                    console.error("Error fetching user Profile",error)
                }
            }else{
                setProfile(null)
            }
            setIsLoading(false)
        })

        return cleanUp;
    },[])
    
  const values = {
    profile,
    user,
    isLoading,
    isLogin: !!user,
  }


  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {

  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be within AuthProvider")
  }

  return context;
}
