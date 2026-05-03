import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  HiOutlineAcademicCap, 
  HiOutlineClipboardCheck, 
  HiOutlineUser, 
  HiOutlineBookmark,
  HiOutlineSparkles,
  HiOutlineChatAlt,
  HiSave,
  HiX
} from 'react-icons/hi';
import supabase from '../lib/SupabaseClient';
import toast from 'react-hot-toast';

const CreateResult = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [formData, setFormData] = useState({
    studentId: '',
    examId: '',
    marksObtained: '',
    grade: '',
    remarks: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch exams with max marks
      const { data: examData } = await supabase
        .from("exams")
        .select("id, name, max_marks");
      setExams(examData || []);

      // Fetch students
      const { data: studentData } = await supabase
        .from("students")
        .select("id, name");
      setStudents(studentData || []);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const selectedExam = exams.find(ex => ex.id === formData.examId);
    const marks = parseFloat(formData.marksObtained); // Allows decimals

    // Validate marks against maximum
    if (selectedExam && marks > selectedExam.max_marks) {
      toast.error(`Marks cannot exceed ${selectedExam.max_marks}`);
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("results")
        .insert([{
          student_id: formData.studentId,
          exam_id: formData.examId,
          marks_obtained: marks,
          grade: formData.grade || null,
          remarks: formData.remarks || null
        }]);

      if (error) {
        if (error.code === '23505') {
          throw new Error("Result already exists for this student.");
        }
        throw error;
      }

      toast.success("Result recorded successfully!");
      navigate("/results");
    } catch (error) {
      toast.error(error.message || "Error creating result");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-max-w-3xl rounded-2xl bg-white shadow-xl">
        
        {/* Header */}
        <div className="border-b p-6 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <HiOutlineClipboardCheck size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Record Result</h2>
              <p className="text-sm text-gray-500">Insert performance data with decimals.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
          
          {/* Exam Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Exam</label>
            <div className="relative">
              <HiOutlineBookmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select 
                name="examId"
                required
                value={formData.examId}
                onChange={handleChange}
                className="w-full rounded-lg border bg-gray-50 py-3 pl-10 pr-4 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
              >
                <option value="">Choose an exam...</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>{exam.name} (Max: {exam.max_marks})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Student</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select 
                name="studentId"
                required
                value={formData.studentId}
                onChange={handleChange}
                className="w-full rounded-lg border bg-gray-50 py-3 pl-10 pr-4 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Marks */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Marks Obtained</label>
              <div className="relative">
                <HiOutlineAcademicCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="number" 
                  step="0.01"
                  name="marksObtained"
                  required
                  value={formData.marksObtained}
                  onChange={handleChange}
                  placeholder="e.g. 85.5"
                  className="w-full rounded-lg border bg-gray-50 py-3 pl-10 pr-4 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                />
              </div>
            </div>

            {/* Grade */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Grade</label>
              <div className="relative">
                <HiOutlineSparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="e.g. A"
                  className="w-full rounded-lg border bg-gray-50 py-3 pl-10 pr-4 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Remarks</label>
            <div className="relative">
              <HiOutlineChatAlt className="absolute left-3 top-4 text-gray-400" size={20} />
              <textarea 
                name="remarks"
                rows="3"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Add teacher feedback..."
                className="w-full rounded-lg border bg-gray-50 p-3 pl-10 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
              ></textarea>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 border-t pt-8">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 font-bold text-gray-500 hover:bg-gray-200"
            >
              <HiX size={18} /> Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-8 py-2.5 font-bold text-white hover:bg-green-700 disabled:bg-green-400"
            >
              {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <HiSave size={18} />}
              Save Result
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResult;