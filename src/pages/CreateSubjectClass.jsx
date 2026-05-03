import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  HiOutlineClipboardList, 
  HiOutlineBookOpen, 
  HiOutlineUser,
  HiSave,
  HiX
} from 'react-icons/hi';
import { MdOutlineClass } from 'react-icons/md';
import supabase from '../lib/SupabaseClient';
import toast from 'react-hot-toast';

const CreateSubjectClass = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Data lists for dropdowns
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    classId: '',
    subjectId: '',
    teacherId: ''
  });

  // Fetch Classes, Subjects, and Teachers on mount
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Classes
      const { data: classData, error: classError } = await supabase
        .from("classes")
        .select("id, name")
        .order('name', { ascending: true });
      
      if (classError) toast.error("Failed to load classes");
      else setClasses(classData || []);

      // 2. Fetch Subjects
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("id, name")
        .order('name', { ascending: true });
      
      if (subjectError) toast.error("Failed to load subjects");
      else setSubjects(subjectData || []);

      // 3. Fetch Teachers (from profiles table)
      const { data: teacherData, error: teacherError } = await supabase
        .from("profiles")
        .select("id, username")
        .order('username', { ascending: true });
      
      if (teacherError) toast.error("Failed to load teachers");
      else setTeachers(teacherData || []);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("class_subjects")
        .insert([{
          class_id: formData.classId,
          subject_id: formData.subjectId,
          teacher_id: formData.teacherId || null // Teacher is optional in schema
        }]);

      if (error) {
        // Handle unique constraint violation (class_id, subject_id)
        if (error.code === '23505') {
          throw new Error("This subject has already been assigned to this class.");
        }
        throw error;
      }

      toast.success("Subject assigned to class successfully!");
      navigate("/class-subjects");
    } catch (error) {
      toast.error(error.message || "Error assigning subject to class");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
              <h2 className="text-2xl font-bold text-gray-900">Map Subject to Class</h2>
              <p className="text-sm text-gray-500">Assign curriculum subjects and teachers to specific classes.</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
          
          {/* Class Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Select Class</label>
            <div className="relative">
              <MdOutlineClass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select 
                name="classId"
                required
                value={formData.classId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Select Subject</label>
            <div className="relative">
              <HiOutlineBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select 
                name="subjectId"
                required
                value={formData.subjectId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
              >
                <option value="">Choose a subject...</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Teacher Selection (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Assign Teacher (Optional)</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select 
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
              >
                <option value="">Choose a teacher...</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>{teacher.username || 'No Name'}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-400">You can leave this blank and assign a teacher at a later time.</p>
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
              Save Mapping
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubjectClass;