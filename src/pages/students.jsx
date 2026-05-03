import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  HiOutlineUserGroup,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineSearch,
  HiPlus
} from 'react-icons/hi';
import { MdOutlineSortByAlpha } from 'react-icons/md';
import supabase from '../lib/SupabaseClient';
import toast from 'react-hot-toast';

const Students = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // One useeffects doing CRUD
  useEffect(() => {

    fetchStudents();
  }, []);

  // 1. Fetch Students from Supabase (including joined class name)
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from("students")
        .select(`
            id,
          roll_number, 
          name, 
          classes (
            name
          )
        `);

      if (error) {
        toast.error("Failed to fetch students");
        console.error(error);
        return;
      }

      setStudents(data.map(student => ({
        id:student.id,
        rollNumber: student.roll_number,
        name: student.name,
        className: student.classes?.name || "Unassigned"
      })));

      console.log()
    };

  // 2. Search Logic
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(student.rollNumber).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 3. Sorting Logic by Class Name
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.className.localeCompare(b.className);
    } else {
      return b.className.localeCompare(a.className);
    }
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

    //////////////////////DELETE GRADES FROM SUPABASE////////////////////////////////////// 
  const deleteStudent = async (id) => {
    
    try {
      const { data, error } = await supabase
        .from("students")
        .delete()
        .eq("id", id)
      toast.success(`You successfuly deleted`)
      fetchStudents()
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
                <HiOutlineUserGroup size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
                <p className="text-sm text-gray-500">View and manage enrolled students across all classes.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/createstudent")}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95"
          >
            <HiPlus size={18} />
            Add New Student
          </button>
        </div>

        {/* 🔍 Search Bar & Sort Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
            />
          </div>

          {/* Sort Control */}
          <button
            onClick={toggleSort}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-green-600"
          >
            <MdOutlineSortByAlpha size={20} />
            Sort by Class ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
          </button>
        </div>

        {/* 📁 Students Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-gray-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Roll Number</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Student Name</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Class Name</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedStudents.map((student) => (
                  <tr key={student.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-green-600">
                      #{student.rollNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="font-bold text-gray-900">{student.name}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        student.className === 'Unassigned' 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-green-50 text-green-700'
                      }`}>
                        {student.className}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => navigate(`/edit-student/${student.rollNumber}`)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-green-50 hover:text-green-600"
                          title="Edit Student"
                        >
                          <HiOutlinePencilAlt size={18} />
                        </button>
                        {/* Delete Button */}
                        {/* <button
                        onClick={()=>deleteStudent(student.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
                          title="Delete Student"
                        >
                          <HiOutlineTrash size={18} />
                        </button> */}
                        <button
  onClick={async () => {
    if (window.confirm(`Are you sure you want to delete this student?`)) {
      setDeletingId(student.id);
      await deleteStudent(student.id);
      setDeletingId(null); // Reset after deletion completes
    }
  }}
  disabled={deletingId === student.id}
  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed"
  title="Delete Student"
>
  {deletingId === student.id ? (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
  ) : (
    <HiOutlineTrash size={18} />
  )}
</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {sortedStudents.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <HiOutlineUserGroup size={32} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or add a new record.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;