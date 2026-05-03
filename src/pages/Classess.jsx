import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  HiOutlineFolderOpen,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineSearch,
  HiPlus
} from 'react-icons/hi';
import supabase from '../lib/SupabaseClient';
import toast from 'react-hot-toast';



const Classess = () => {

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [grades, setGrades] = useState([])
  const [deletingId, setDeletingId] = useState(null);
  const [isLoading, setIsloading]= useState(false)


  const filteredGrades = grades.filter(grade =>
    grade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grade.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // useEffect shows data on Screen of the Classes
  useEffect(() => {

    fetchGrades();

  }, [])

  //////////////////////FETCH GRADES FROM SUPABASE////////////////////////////////////// 
  const fetchGrades = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("id, name, profiles!classes_teacher_id_fkey(username)")

    setGrades(data.map(grade => ({
      id: grade.id,
      name: grade.name,
      formMaster: grade.profiles?.username || "N/A"

    })))
    // console.log(data)
  }

  //////////////////////DELETE GRADES FROM SUPABASE////////////////////////////////////// 
  const DeleteClass = async (id) => {
    try {
      const { data, error } = await supabase
        .from("classes")
        .delete()
        .eq("id", id)
      toast.success(`You successfuly deleted`)
    fetchGrades();
    } catch (error) {
      console.log(error)
    }

  }



  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* 🌟 Header & Action Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <HiOutlineFolderOpen size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Academic Grades</h1>
                <p className="text-sm text-gray-500">Organize and manage student homeroom grades and allocations.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/create-class")}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95"
          >
            <HiPlus size={18} />
            Add New Grade
          </button>
        </div>

        {/* 🔍 Search Bar */}
        <div className="relative max-w-md">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by grade name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
          />
        </div>

        {/* 📁 Grades Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-gray-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Grade ID</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Grade Name</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Form Master</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGrades.map((grade) => {
                  const isFull = grade.studentCount >= grade.capacity;

                  return (
                    <tr key={grade.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-green-600">
                        {grade.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-bold text-gray-900">{grade.name}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-bold text-gray-900">{grade.formMaster}</span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => navigate(`/edit-grade/${grade.id}`)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-green-50 hover:text-green-600"
                            title="Edit Grade"
                          >
                            <HiOutlinePencilAlt size={18} />
                          </button>
                          {/* Delete Button */}
                          {/* <button
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
                            title="Delete Grade"
                          >
                            <HiOutlineTrash size={18} />
                          </button> */}

                          <button
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to delete this student?`)) {
                                setDeletingId(grade.id);
                                await DeleteClass(grade.id);
                                setDeletingId(null); // Reset after deletion completes
                              }
                            }}
                            disabled={deletingId === grade.id}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed"
                            title="Delete Student"
                          >
                            {deletingId === grade.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                            ) : (
                              <HiOutlineTrash size={18} />
                            )}
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredGrades.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <HiOutlineFolderOpen size={32} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">No grades found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new record.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Classess