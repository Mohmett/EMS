import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router'
import { login } from '../lib/Auth'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = React.useState('')
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const {profile}= useAuth()


  // useEffect(() => {
  //   const checkData = async () => {
  //     const { data, error } = await supabase.auth.getSession();
  //     setUserData(data)
  //   }


  // }, [])

  // const handleLogin = async (e) => {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   try {

  //     const { data, error } = await supabase.auth.signInWithPassword({
  //       email: email,
  //       password: password,
  //     })

  //     // console.log(data)
  //     if (error) {
  //       toast.error(error.message)
  //     } else {
  //       setUserData(data)
  //       // console.log("Your Data is:",data)
  //       navigate("/")
  //       toast.success("Login successful!")
  //     }

  //   } catch (error) {
  //     console.error(error)
  //   } finally {
  //     setIsLoading(false)
  //     setEmail("")
  //     setPassword("")
  //   }
  // }


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true)

    if (email === "" || password === "") {
      toast.error("Please fill the Fields")
      setIsLoading(false)
      return
    }

    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (error) {
      toast.error(error.message)
      return
    } finally {
      setIsLoading(false)
      setEmail("")
      setPassword("")
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Sign in</h2>
          <p className="text-gray-500 mt-2">Welcome back! Please enter your details</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"

          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button> */}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Login......
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            I dont't have an account?{' '}
            <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium transition">
              Create New Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage