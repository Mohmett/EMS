import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  HiOutlineClipboardCheck,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineSearch,
  HiPlus,
  HiOutlineStar
} from 'react-icons/hi';
import supabase from '../lib/SupabaseClient';
import toast from 'react-hot-toast';

const Results = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from("results")
      .select(`
        id, marks_obtained, grade, remarks,
        students ( name ),
        exams ( name, max_marks )
      `);

    if (error) {
      toast.error("Failed to fetch results");
      return;
    }

    setResults(data.map(result => ({
      id: result.id,
      studentName: result.students?.name || "Unknown",
      examName: result.exams?.name || "N/A",
      marks: parseFloat(result.marks_obtained),
      maxMarks: result.exams?.max_marks || 100,
      grade: result.grade || "N/A",
      remarks: result.remarks || "No remarks"
    })));
  };

  useEffect(() => { fetchResults(); }, []);

  const deleteResult = async (id) => {
    const { error } = await supabase.from("results").delete().eq("id", id);
    if (error) toast.error("Error deleting result");
    else {
      toast.success("Result deleted successfully");
      fetchResults();
    }
  };

  const filteredResults = results.filter(result =>
    result.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.examName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <HiOutlineClipboardCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
              <p className="text-sm text-gray-500">Track student scores with decimal support.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/create-result")}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-bold text-white hover:bg-green-700"
          >
            <HiPlus size={18} /> Record Result
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by student or exam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Student Name</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Exam</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Marks</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Grade</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredResults.map((result) => {
                  const percentage = (result.marks / result.maxMarks) * 100;
                  return (
                    <tr key={result.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-bold text-gray-900">{result.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{result.examName}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{result.marks.toFixed(1)} / {result.maxMarks}</span>
                          <span className="text-xs text-gray-400">{percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          <HiOutlineStar size={14} /> {result.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={async () => {
                              if (window.confirm("Delete this result?")) {
                                setDeletingId(result.id);
                                await deleteResult(result.id);
                                setDeletingId(null);
                              }
                            }}
                            disabled={deletingId === result.id}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                          >
                            {deletingId === result.id ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" /> : <HiOutlineTrash size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;