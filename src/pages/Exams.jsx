import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  HiOutlineClipboardList,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineSearch,
  HiPlus,
  HiOutlineCalendar,
  HiOutlineBookmark
} from 'react-icons/hi';
import supabase from '../lib/SupabaseClient';
import toast from 'react-hot-toast';

const Exams = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [exams, setExams] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // 1. Fetch Exams with joined class and subject data
  const fetchExams = async () => {
    const { data, error } = await supabase
      .from("exams")
      .select(
        "id, name, exam_date, max_marks"
      );

    if (error) {
      toast.error("Failed to fetch exams");
      console.error(error);
      return;
    }

    setExams(data.map(exam => ({
      id: exam.id,
      name: exam.name,
      date: exam.exam_date,
      marks: exam.max_marks,
      // className: exam.class_subjects?.classes?.name || "N/A",
      // subjectName: exam.class_subjects?.subjects?.name || "N/A"
    })));

    console.log( data);
  };

  useEffect(() => {
    fetchExams();
    
  }, []);

  // 2. Delete Exam Function
  const deleteExam = async (id, name) => {
    const { error } = await supabase
      .from("exams")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error deleting exam");
      console.error(error);
    } else {
      toast.success(`${name} deleted successfully`);
      fetchExams();
    }
  };

  // 3. Search Logic
  const filteredExams = exams.filter(exam =>
    exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // exam.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // exam.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
    false // Remove this line when className and subjectName are enabled
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* 🌟 Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-sm">
              <HiOutlineClipboardList size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Exams List</h1>
              <p className="text-sm text-gray-500">Manage scheduled assessments and mapped curriculum subjects.</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/create-exam")}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 hover:scale-[1.02] active:scale-95"
          >
            <HiPlus size={20} />
            Schedule Exam
          </button>
        </div>

        {/* 🔍 Search Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="relative w-full max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by exam, class, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
            />
          </div>
        </div>

        {/* 📁 Exams Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-xl shadow-gray-200/40 border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Exam Name</th>
                  {/* <th className="px-6 py-4 text-sm font-bold text-gray-600">Assigned Mapping</th> */}
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Exam Date</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Max Marks</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredExams.map((exam) => {
                  const formattedDate = exam.date ? new Date(exam.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : "N/A";

                  return (
                    <tr key={exam.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          <HiOutlineBookmark className="text-green-600" size={18} />
                          <span className="font-bold text-gray-900">{exam.name}</span>
                        </div>
                      </td>
                      {/* <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{exam.className}</span>
                          <span className="text-xs text-gray-500">{exam.subjectName}</span>
                        </div>
                      </td> */}
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <HiOutlineCalendar size={16} className="text-gray-400" />
                          {formattedDate}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">
                        {exam.marks} pts
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setLoadingId(exam.id);
                              navigate(`/edit-exam/${exam.id}`);
                            }}
                            disabled={loadingId === exam.id}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition-all hover:bg-green-50 hover:text-green-600 border border-gray-100 disabled:cursor-not-allowed"
                            title="Edit Exam"
                          >
                            {loadingId === exam.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                            ) : (
                              <HiOutlinePencilAlt size={18} />
                            )}
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to delete ${exam.name}?`)) {
                                setDeletingId(exam.id);
                                await deleteExam(exam.id, exam.name);
                                setDeletingId(null);
                              }
                            }}
                            disabled={deletingId === exam.id}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition-all hover:bg-red-50 hover:text-red-600 border border-gray-100 disabled:cursor-not-allowed"
                            title="Delete Exam"
                          >
                            {deletingId === exam.id ? (
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
          {filteredExams.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                <HiOutlineClipboardList size={32} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">No exams found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or schedule a new assessment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exams;