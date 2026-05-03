import { Navigate, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"

const HomePage = () => {

  const navigate = useNavigate()

  const {isLogin}= useAuth()



  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <section className="relative overflow-hidden py-8 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 mb-6">
                ✨ Now with automated grading
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Streamline Your <span className="text-green-600">Exam Lifecycle</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                The ultimate Exam Management System (EMS) for modern educators.
                Schedule tests, track student progress, and generate insightful
                reports—all from one centralized, secure dashboard.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <button className="rounded-lg bg-green-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-green-700 hover:scale-105 active:scale-95 cursor-pointer"
                  onClick={(e)=> navigate("/login")
                    
                  }
                >
                  Get Started
                </button>

                
                <button className="text-base font-bold leading-6 text-gray-900 hover:text-green-600 transition-colors">
                  Watch Demo <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            {/* Visual Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-200 hover:border-green-200 transition-colors">
                  {/* <BookOpen className="text-green-600 mb-4" size={32} /> */}
                  <h3 className="font-bold">Course Control</h3>
                  <p className="text-sm text-gray-500">Organize exams by class and semester easily.</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-200 hover:border-green-200 transition-colors">
                  {/* <UserCheck className="text-green-600 mb-4" size={32} /> */}
                  <h3 className="font-bold">Teacher Hub</h3>
                  <p className="text-sm text-gray-500">Collaborative tools for paper moderation.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-200 hover:border-green-200 transition-colors">
                  {/* <FileText className="text-green-600 mb-4" size={32} /> */}
                  <h3 className="font-bold">Rapid Grading</h3>
                  <p className="text-sm text-gray-500">Automate MCQ and digital evaluation.</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-md border border-gray-200 hover:border-green-200 transition-colors">
                  {/* <Layout className="text-green-600 mb-4" size={32} /> */}
                  <h3 className="font-bold">Live Stats</h3>
                  <p className="text-sm text-gray-500">Real-time performance analytics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

  )
}

export default HomePage