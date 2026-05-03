import toast from 'react-hot-toast'
import supabase from './SupabaseClient'
import { data } from 'react-router'


// SignUp Method // SignUp Method // SignUp Method // SignUp Method
// SignUp Method // SignUp Method // SignUp Method // SignUp Method

export const signUp = async (email, password, username = "") => {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    })
    if (error) {
        console.error(error)
        return
    }
    console.log("User Created successfully in Auth-signup", data)

    if (data?.user) {
        const { data: { session } } = await supabase.auth.getSession()

        const displayName = username || session?.user.email.split("@")[0];
        console.log(displayName)
        console.log(data.user.id)
        console.log(session)

        // Create New Profile within Profiles Table
        const { data: CreateProfile, error: CreateProfileError } = await supabase
            .from("profiles")
            .insert({
                id: data.user.id,
                username: displayName,
            })
            .select()
            .single()

        if (CreateProfileError) {
            console.log(error)
            toast.error(error.message)
        } else {
            toast.success("Also You created New Profile")
        }
    }

    return data

}

// Login Method // Login Method // Login Method // Login Method
// Login Method // Login Method // Login Method // Login Method
export const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
        
    })

if (error) throw error
// here Check if profile exist, if does'nt create new One
if(data?.user){
const profile = await getUserProfile(data.user.id);

}
}

export const getUserProfile = async (sessionId) => {
    if (!sessionId) return null

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionId)
        .single()
        // console.log(data)
    if (error) {
        console.error("getUserProfile error", error)
        return null
    }

    return data
}

// OnAuth Change
// OnAuth Change
export const onAuthChange = (callback) => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null, event)
    })

    return () => data.subscription.unsubscribe();
}

// LogOut Method
// LogOut Method
export const logOut = async () => {
    const { data, error } = await supabase.auth.signOut()
    // if(error) throw
}