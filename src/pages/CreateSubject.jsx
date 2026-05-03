import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  HiOutlineBookOpen, 
  HiOutlineBookmark,
  HiOutlineTerminal,
  HiOutlineUserGroup,
  HiSave,
  HiX
} from 'react-icons/hi';
import supabase from '../lib/SupabaseClient';
import toast from 'react-hot-toast';

const CreateSubject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState(null); // You can implement class selection later
  const [classId, setClassId] = useState(""); // You can implement class selection later
  
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // You can fetch classes here for the class selection dropdown if needed
    const fetchClasses = async () => {
    const {data, error} = await supabase
    .from("classes")
    .select("*");
    setClasses(data.map(cls => ({ id: cls.id, name: cls.name })));
  }

   fetchClasses();
  },[])

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("subjects")
        .insert([{
          name: formData.name,
          code: formData.code || null, // Send null if empty
          class_id: classId || null // Send null if no class is selected
        

        }]);

      if (error) {
        // Handle unique constraint violations
        if (error.code === '23505') {
          if (error.message.includes('name')) {
            throw new Error("A subject with this name already exists.");
          }
          if (error.message.includes('code')) {
            throw new Error("This subject code is already in use.");
          }
        }
        throw error;
      }

      toast.success("Subject created successfully!");
      navigate("/subjects");
    } catch (error) {
      toast.error(error.message || "Error creating subject");
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
              <HiOutlineBookOpen size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Subject</h2>
              <p className="text-sm text-gray-500">Create a distinct branch of study for curriculum mapping.</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
          
          {/* Subject Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Subject Name</label>
            <div className="relative">
              <HiOutlineBookmark className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Advanced Mathematics"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
              />
            </div>
          </div>

          {/* Subject Code */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Subject Code (Optional)</label>
            <div className="relative">
              <HiOutlineTerminal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. MATH101"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
              />
            </div>
            <p className="text-xs text-gray-400">Codes help in quickly identifying subjects during scheduling.</p>
          </div>
                      {/* Class */}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Class</label>
                        <div className="relative">
                          <HiOutlineUserGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                          <select
                            value={classId}
                            onChange={(e) => setClassId(e.target.value)}
                            className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
                          >
                            <option value="">Select a class</option>
                            {classes?.map((cls) => (
                              <option key={cls.id} value={cls.id}>
                                {cls.name}
                              </option>
                            ))}
                          </select>
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
              Save Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubject;