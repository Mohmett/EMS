import React, { useEffect, useState } from 'react'
import { HiOutlineBookOpen, HiOutlineCalendar, HiOutlineUserGroup, HiSave, HiX } from 'react-icons/hi';
import { MdOutlineClass, MdOutlineRoomPreferences } from 'react-icons/md';
import { SiGoogleclassroom } from 'react-icons/si';
import { useNavigate } from 'react-router';
import supabase from '../lib/SupabaseClient';
import toast from 'react-hot-toast';

const CreateClass = () => {
  const navigate = useNavigate()

  const [teachers, setTeachers] = useState([])
  const [className, setClassName] = useState("")
  const [selectedTeacherId, setSelectedTeacherId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch teachers from the database (replace with your actual data fetching logic)
  useEffect(() => {
    const fetchTeachers = async () => {
      const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .eq("user_role", "teacher")

      if (error) {
        console.error("Error fetching teachers:", error)
      } else {
        setTeachers(data)
      }
    }
    fetchTeachers()
  }, [])

 
  const handleCreateClass = async (e) => {
    e.preventDefault()
    if (className.trim() === "" || selectedTeacherId === "") {
      toast.error("Please fill in all fields")
      return
    }

    setIsLoading(true)
    const { data, error } = await supabase
      .from("classes")
      .insert({
        name: className,
        teacher_id: selectedTeacherId,
      })
    if (error) {
      toast.error("Error creating class")
      console.error("Error creating class:", error)
    } else {
      toast.success("Class created successfully")
      setClassName("")
      setSelectedTeacherId("")
    }
    setIsLoading(false)
    navigate("/classes")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-xl shadow-gray-200/50">

        {/* Form Header */}
        <div className="border-b border-gray-100 bg-white p-6 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <MdOutlineClass size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Class Register</h2>
              <p className="text-sm text-gray-500">Add new academic groups to the system.</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form className="p-6 sm:p-10 space-y-8" onSubmit={handleCreateClass}>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Class Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Class Name</label>
              <div className="relative">
                <SiGoogleclassroom className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="e.g. Senior Year B"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
            </div>

            {/* Teacher */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Teacher</label>
              <div className="relative">
                <HiOutlineUserGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
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
              className="flex items-center gap-2 rounded-lg bg-green-600 px-8 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95"
            >
              <HiSave size={18} />
              {isLoading ? "Saving..." : "Save Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateClass