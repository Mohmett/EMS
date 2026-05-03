import React, { useEffect, useState } from 'react'
import supabase from './SupabaseClient'
import { Navigate } from 'react-router'

const Authenticated = ({ children }) => {

    const [authenticated, setAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                setAuthenticated(!!session)
                setIsLoading(false)

            } catch (error) {
                console.error(error)
            }

        }
        getSession();
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">

                    <div className="min-h-1/3 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-2 border-green-600 "></div>
                    </div>
                </div>
            </div>
        );
    }
    else {
        if (authenticated) {
            return <>{children}</>
        }
        else return <Navigate to='/login'></Navigate>
    }
}

export default Authenticated