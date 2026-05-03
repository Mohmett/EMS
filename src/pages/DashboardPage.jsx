import { Link, useNavigate } from "react-router";
import {
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineClipboardList,
  HiOutlineFolderOpen,
  HiOutlinePlus
} from 'react-icons/hi';
import { PiStudentBold } from 'react-icons/pi';


import { useAuth } from "../context/AuthContext"
import { useEffect, useState } from "react";
import supabase from "../lib/SupabaseClient";
import toast from "react-hot-toast";

const DashboardPage = () => {

  const navigate = useNavigate();

  const { user, profile } = useAuth()


  ///////////////////////////-STATES-////////////////////////////////////
  const [teachers, setTeachers] = useState([])
  const [grades, setGrades] = useState([])
  const [students, setStudents] = useState([])
  const [exams, setExams] = useState([])

  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  // Mock statistics data (Replace with database counts)
  const stats = [
    { title: "Total Students", count: students.length, icon: PiStudentBold, color: "text-green-600", bg: "bg-green-50", path: "students" },
    { title: "Total Teachers", count: teachers.length, icon: HiOutlineUserGroup, color: "text-blue-600", bg: "bg-blue-50", path: "teachers" },
    { title: "Total Grades", count: grades.length, icon: HiOutlineFolderOpen, color: "text-purple-600", bg: "bg-purple-50", path: "classes" },
    { title: "Active Exams", count: exams.length, icon: HiOutlineClipboardList, color: "text-amber-600", bg: "bg-amber-50", path: "exams" },
  ];

  // Quick Action Buttons
  const actions = [
    { label: "Register Student", path: "/createstudent", icon: PiStudentBold },
    { label: "Add Teacher", path: "/signup", icon: HiOutlineUserGroup },
    { label: "Create Exam", path: "/create-exam", icon: HiOutlineClipboardList },
    { label: "New Grade", path: "/new-grade", icon: HiOutlineFolderOpen },
  ];

  ////////////////// --FETCH TEACHERS, GRADES AND STUDENTS //////////////////////////////

  useEffect(() => {

    ////////////FETCH TEACHERS TO DISPLAY DASHBAORD//////////////////////
    const fetchTeachers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_role", "teacher")
        setTeachers(data)
      } catch (error) {
        console.log(error, "Cilad ayaa ka dhacday fetchTeachers DashboardPage")
      }

    }

    ////////////FETCH GRADES TO DISPLAY DASHBAORD//////////////////////
    const fetchGrades = async () => {
      try {
        const { data, error } = await supabase
          .from("classes")
          .select("*")
        setGrades(data)
      } catch (error) {
        console.log(error, "Cilad ayaa ka dhacday fetchGrades DashboardPage")
      }
    }

    ////////////FETCH GRADES TO DISPLAY DASHBAORD//////////////////////
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from("students")
          .select("*")
        setStudents(data)
      } catch (error) {
        console.log(error, "Cilad ayaa ka dhacday fetchGrades DashboardPage")
      }
    }

    const fecthExams= async()=>{
      const { data, error } = await supabase
        .from("exams")
        .select("*")
      setExams(data)
    }


    fetchTeachers()
    fetchGrades()
    fetchStudents()
    fecthExams()
  }, [])

  /////////////////////---- RETURN START HERE ----//////////////////////////////


  return (
    <div className="min-h-screen mt-4 bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">School Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back! Here is what's happening today.</p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <HiOutlineAcademicCap size={32} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link to={`/${item.path}`} key={index} className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50 transition-all hover:scale-[1.02]">
                <div key={index} className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50 transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{item.title}</p>
                      <p className="mt-2 text-3xl font-bold text-gray-900">{item?.count || <span className="animate-pulse text-gray-500 text-sm">Loading...</span>}</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                      <Icon size={26} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions Section */}
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500">Fast access to administrative registers.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-green-600 hover:bg-green-50 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-all group-hover:text-green-600">
                      <ActionIcon size={20} />
                    </div>
                    <span className="font-bold text-gray-700 transition-all group-hover:text-green-700">
                      {action.label}
                    </span>
                  </div>
                  <HiOutlinePlus className="text-gray-400 transition-all group-hover:text-green-600" size={18} />
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  )

}

export default DashboardPage
