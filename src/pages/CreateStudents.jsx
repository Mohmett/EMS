import React, { useEffect, useState } from 'react'
import { HiIdentification, HiOutlineMail, HiOutlineUserAdd, HiSave, HiX } from 'react-icons/hi'
import { MdOutlineEscalatorWarning } from 'react-icons/md'
import { PiStudentBold } from 'react-icons/pi'
import supabase from '../lib/SupabaseClient'
import toast from 'react-hot-toast'

const CreateStudents = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [studentName, setStudentName] = useState("")
  const [rollNumber, setRollNumber] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedGradeId, setSelectedGradeId] = useState("")


  // const grades = [
  //   { id: 1, name: "Grade 1" },
  //   { id: 2, name: "Grade 2" },]


  // This is From Grades Table
  const [grades, setGrades] = useState([])
  // Fetching Grades from Classes Table to Choose as Drop down
  useEffect(() => {

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
    fetchGrades()
  }, [])


  const createStudent = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    if(studentName == "" || rollNumber == ""){
      toast.error("Please fill the form")
      return
      setIsLoading(false)
    }
    try {
      const {data, error} = await supabase
        .from("students")
        .insert({
          name: studentName,
          roll_number: rollNumber,
          class_id: selectedGradeId,
        })
      if(error?.code ==="42501"){
        toast.error("Only Admins can register the Students")
      }else{
        console.log(data)
      toast.success(`Create successfuly add ${studentName}`)

      }
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
      setRollNumber("")
      setStudentName("")
    }

  }



  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-xl shadow-gray-200/50">

        {/* 🏷️ Form Header */}
        <div className="border-b border-gray-100 bg-white p-6 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <HiOutlineUserAdd size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Student Registration</h2>
              <p className="text-sm text-gray-500">Enroll a new student and assign them a grade.</p>
            </div>
          </div>
        </div>

        {/* 📝 Form Body */}
        <form className="p-6 sm:p-10 space-y-8"
        onSubmit={createStudent}
        >

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Student Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Full Name</label>
              <div className="relative">
                <PiStudentBold className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Grades Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Assigned Grade</label>
              <div className="relative">
                <MdOutlineEscalatorWarning className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedGradeId}
                  onChange={(e) => setSelectedGradeId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                  required
                >
                  <option value="">Select a grade</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Roll Number */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Roll Number</label>
              <div className="relative">
                <HiIdentification className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="EMS-01"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* 🔘 Form Actions */}
          <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-8">
            <button
              onClick={() => navigate("/")}
              type="button"
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 font-bold text-gray-500 transition-all hover:bg-gray-200"
            >
              <HiX size={18} />
              Discard
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-8 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95 disabled:bg-gray-400 disabled:scale-100"
            >
              <HiSave size={18} />
              {isLoading ? "Saving..." : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateStudents