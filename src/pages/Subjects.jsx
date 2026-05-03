import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  HiOutlineBookOpen, 
  HiOutlineSearch, 
  HiPlus, 
  HiOutlinePencilAlt, 
  HiOutlineTrash,
  HiOutlineTerminal,
  HiOutlineCalendar
} from 'react-icons/hi';
import supabase from '../lib/SupabaseClient';
import toast from 'react-hot-toast';

const Subjects = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // 1. Fetch Subjects from Supabase
  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order('name', { ascending: true });

    if (error) {
      toast.error("Failed to fetch subjects");
      console.error(error);
      return;
    }
    setSubjects(data || []);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // 2. Delete Subject Function
  const deleteSubject = async (id, name) => {
    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error deleting subject");
      console.error(error);
    } else {
      toast.success(`${name} deleted successfully`);
      fetchSubjects();
    }
  };

  // 3. Search Logic
  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (subject.code && subject.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* 🌟 Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 shadow-sm">
              <HiOutlineBookOpen size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Curriculum Subjects</h1>
              <p className="text-sm text-gray-500">Manage and organize courses across all academic programs.</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/create-subject")}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 hover:scale-[1.02] active:scale-95"
          >
            <HiPlus size={20} />
            Add New Subject
          </button>
        </div>

        {/* 🔍 Search Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="relative w-full max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by subject name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
            />
          </div>
        </div>

        {/* 📁 Subjects Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-xl shadow-gray-200/40 border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Subject Code</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Subject Name</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Creation Date</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubjects.map((subject) => {
                  const formattedDate = new Date(subject.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <tr key={subject.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                          <HiOutlineTerminal size={16} />
                          {subject.code || "N/A"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-bold text-gray-900">{subject.name}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <HiOutlineCalendar size={16} className="text-gray-400" />
                          {formattedDate}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setLoadingId(subject.id);
                              navigate(`/edit-subject/${subject.id}`);
                            }}
                            disabled={loadingId === subject.id}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition-all hover:bg-green-50 hover:text-green-600 border border-gray-100 disabled:cursor-not-allowed"
                            title="Edit Subject"
                          >
                            {loadingId === subject.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                            ) : (
                              <HiOutlinePencilAlt size={18} />
                            )}
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to delete ${subject.name}?`)) {
                                setDeletingId(subject.id);
                                await deleteSubject(subject.id, subject.name);
                                setDeletingId(null);
                              }
                            }}
                            disabled={deletingId === subject.id}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition-all hover:bg-red-50 hover:text-red-600 border border-gray-100 disabled:cursor-not-allowed"
                            title="Delete Subject"
                          >
                            {deletingId === subject.id ? (
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
          {filteredSubjects.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                <HiOutlineBookOpen size={32} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">No subjects found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or running a new search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subjects;