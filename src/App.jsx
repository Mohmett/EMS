import { Toaster } from 'react-hot-toast'
import { Outlet, Route, Routes } from 'react-router'
import Footer from './components/Footer'
import Header from './components/Header'
import { AuthProvider } from './context/AuthContext'
import Authenticated from './lib/Authenticated'
import UnAuthenticated from './lib/UnAuthenticated'
import Classess from './pages/Classess'
import CreateClass from './pages/CreateClass'
import CreateStudents from './pages/CreateStudents'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import SignUpPage from './pages/SignUpPage'
import Students from './pages/students'
import Teachers from './pages/Teachers'
import Exams from './pages/Exams'
import CreateExam from './pages/CreateExam'
import CreateResult from './pages/CreateResult'
import Results from './pages/Results'
import CreateSubject from './pages/CreateSubject'
import Subjects from './pages/Subjects'
import CreateSubjectClass from './pages/CreateSubjectClass'

export  const  MainLayout=()=> {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export  const AuthLayout=()=> {
  return <Outlet />;
}

function App() {

  return (
    <>
    <AuthProvider>
      <div className="App">
        
        <Header className="mb-4" />
        <main>
          <Routes>

            {/* Un protected Routes */}
            {/* <Route path='/' element={<HomePage />} /> */}
            <Route path='/' element={ <UnAuthenticated><HomePage /></UnAuthenticated> } />
            <Route path='/login' element={ <UnAuthenticated><LoginPage /></UnAuthenticated> } />
            <Route path='/signup' element={ <UnAuthenticated><SignUpPage /></UnAuthenticated> } />
            <Route path='*' element={<NotFoundPage />} />

            {/* Protected Routes */}
            <Route path='/teachers' element={<Authenticated><Teachers /></Authenticated>} />
            <Route path='/create-class' element={<Authenticated><CreateClass /></Authenticated>} />
            <Route path='/dashboard' element={<Authenticated><DashboardPage/></Authenticated>} />
            <Route path='/createstudent' element={<Authenticated><CreateStudents/></Authenticated>} />
            <Route path='/create-exam' element={<Authenticated><CreateExam/></Authenticated>} />
            <Route path='/classes' element={<Authenticated><Classess/></Authenticated>} />
            <Route path='/students' element={<Authenticated><Students/></Authenticated>} />
            <Route path='/exams' element={<Authenticated><Exams/></Authenticated>} />
            <Route path='/create-result' element={<Authenticated><CreateResult/></Authenticated>} />
            <Route path='/results' element={<Authenticated><Results/></Authenticated>} />
            <Route path='/create-subject' element={<Authenticated><CreateSubject/></Authenticated>} />
            <Route path='/subjects' element={<Authenticated><Subjects/></Authenticated>} />
            <Route path='/create-subject-class' element={<Authenticated><CreateSubjectClass/></Authenticated>} />
            



          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </AuthProvider>
    </>
  )
}

export default App
