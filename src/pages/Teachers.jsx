import { useNavigate } from 'react-router';
import { 
  HiOutlineUserGroup, 
  HiOutlinePencilAlt, 
  HiOutlineTrash,
  HiOutlineSearch,
  HiPlus,
  HiBackspace,
  HiArrowLeft
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { HiArrowDownLeft } from 'react-icons/hi2';
import supabase from '../lib/SupabaseClient';

const Teachers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState([])

  // /////////////////////////////////////////////////////////////
  useEffect(()=>{
        const fetchTeachers= async()=>{
        try {
        const {data,error}= await supabase
        .from("profiles")
        .select("*")
        .eq("user_role","teacher")
        setTeachers(data.map(teacher => ({ 
          id: teacher.id,
          name: teacher.username,
          email: teacher.email,
          subject: teacher.subject || "N/A"
        })))

        } catch (error) {
            console.log(error, "Cilad ayaa ka dhacday fetchTeachers DashboardPage")
        }

    }
    fetchTeachers();
  },[])

  console.log(teachers)

  // Mock Teachers Data (Replace with your database fetch)
  // const [teachers, setTeachers] = useState([
  //   { id: "TCH-2026-01", name: "Sarah Jenkins", email: "s.jenkins@school.com", subject: "Mathematics" },
  //   { id: "TCH-2026-02", name: "Michael Obeng", email: "m.obeng@school.com", subject: "Physics" },
  //   { id: "TCH-2026-03", name: "Elena Rostova", email: "e.rostova@school.com", subject: "English Literature" },
  //   { id: "TCH-2026-04", name: "David Kim", email: "d.kim@school.com", subject: "Computer Science" },
  // ]);

  const handleDelete = (id) => {
    // Add Supabase delete logic here
    setTeachers(teachers.filter(teacher => teacher.id !== id));
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.id.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* 🌟 Header & Action Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <HiOutlineUserGroup size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teachers Directory</h1>
                <p className="text-sm text-gray-500">Manage school faculty members and their profiles.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95"
          >
            <HiArrowLeft size={18} />
            Go Back!
          </button>
        </div>

        {/* 🔍 Search and Filter Bar */}
        <div className="relative max-w-md">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
          />
        </div>

        {/* 📁 Teachers Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-gray-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Teacher ID</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Name</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Email</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Subject</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-green-600">
                      {teacher.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="font-bold text-gray-900">{teacher.name}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {teacher.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        {teacher.subject}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => navigate(`/edit-teacher/${teacher.id}`)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-green-50 hover:text-green-600"
                          title="Edit Teacher"
                        >
                          <HiOutlinePencilAlt size={18} />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
                              handleDelete(teacher.id);
                            }
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
                          title="Delete Teacher"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredTeachers.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <HiOutlineUserGroup size={32} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">No teachers found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new record.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Teachers