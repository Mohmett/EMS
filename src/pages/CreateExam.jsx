import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  HiOutlineClipboardList, 
  HiOutlineCalendar, 
  HiOutlineBookmark, 
  HiOutlineBadgeCheck,
  HiSave,
  HiX
} from 'react-icons/hi';
import { MdOutlineClass } from 'react-icons/md';
import supabase from '../lib/SupabaseClient';
import toast from 'react-hot-toast';

const CreateExam = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classSubjects, setClassSubjects] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    examDate: '',
    totalMarks: ''
  });


  const handleSubmit=async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Insert new exam into the database
      const { data, error } = await supabase
      .from('exams')
      .insert({
        name: formData.name,
        exam_date: formData.examDate,
        max_marks: formData.totalMarks
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Exam created successfully!');
      navigate('/exams');
    } catch (error) {
      toast.error('Failed to create exam.');
    } finally {
      setLoading(false);
    }
  };

  console.log(formData)
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white shadow-xl shadow-gray-200/50">
        
        {/* Header */}
        <div className="border-b border-gray-100 bg-white p-6 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <HiOutlineClipboardList size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Exam</h2>
              <p className="text-sm text-gray-500">Schedule and configure a new assessment.</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
          
          {/* Exam Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Exam Name</label>
            <div className="relative">
              <HiOutlineBookmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Mid-Term Exam"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Exam Date */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Exam Date</label>
              <div className="relative">
                <HiOutlineCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="date" 
                  name="examDate"
                  required
                  value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                />
              </div>
            </div>

            {/* Total Marks */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Maximum Marks</label>
              <div className="relative">
                <HiOutlineBadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="number" 
                  name="totalMarks"
                  required
                  value={formData.totalMarks}
                  onChange={(e)=>setFormData({...formData,totalMarks: e.target.value})}
                  placeholder="e.g. 100"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-8">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 font-bold text-gray-500 transition-all hover:bg-gray-200"
            >
              <HiX size={18} />
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-8 py-2.5 font-bold text-white shadow-lg transition-all hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-green-400"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <HiSave size={18} />
              )}
              Create Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;