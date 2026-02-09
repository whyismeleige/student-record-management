import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  
  const isSignup = location.pathname === "/register";
  const [loading, setLoading] = useState(false);
  
  // 1. Initialize role in state (default to faculty)
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    name: "",
    role: "faculty" 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate delay
    setTimeout(async () => {
        try {
          if (isSignup) await register(formData);
          else await login(formData);
          navigate("/dashboard");
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-amber-50 font-sans text-stone-900">
      
      {/* Left: The "Poster" (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-stone-900 text-amber-50 p-12 flex-col justify-between border-r-4 border-stone-900 relative overflow-hidden">
         {/* Decorative Grid */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         
         <div className="relative z-10">
            <div className="w-16 h-16 bg-orange-500 border-2 border-white rounded-lg flex items-center justify-center text-white mb-8 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
               <GraduationCap size={32} />
            </div>
            <h1 className="text-6xl font-serif font-black leading-tight mb-4">
               Build the <br/> future.
            </h1>
            <p className="text-xl text-stone-400 font-medium">Class of '26 Record System</p>
         </div>

         <div className="relative z-10 p-6 bg-stone-800 border-2 border-stone-700 rounded-xl max-w-sm">
            <p className="font-mono text-sm leading-relaxed">
               "ScholarSync replaced our entire filing room with a single laptop. It's robust, fast, and actually fun to use."
            </p>
            <div className="mt-4 flex items-center gap-3">
               <div className="w-10 h-10 bg-stone-600 rounded-full"></div>
               <div>
                  <p className="font-bold text-sm">Principal Skinner</p>
                  <p className="text-xs text-stone-400">Springfield Elementary</p>
               </div>
            </div>
         </div>
      </div>

      {/* Right: The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
         <div className="w-full max-w-md">
            <div className="text-center mb-10">
               <h2 className="text-3xl font-serif font-black text-stone-900 mb-2">
                  {isSignup ? "Faculty Registration" : "Portal Access"}
               </h2>
               <p className="text-stone-500 font-medium">Please enter your credentials.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               {isSignup && (
                 <>
                   <div className="space-y-1">
                      <label className="font-bold text-sm uppercase text-stone-700">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                        placeholder="e.g. Prof. X"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                   </div>

                   {/* 2. Added Role Selection Dropdown */}
                   <div className="space-y-1">
                      <label className="font-bold text-sm uppercase text-stone-700">Role</label>
                      <select 
                        className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all cursor-pointer"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      >
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                   </div>
                 </>
               )}

               <div className="space-y-1">
                  <label className="font-bold text-sm uppercase text-stone-700">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                    placeholder="name@school.edu"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
               </div>

               <div className="space-y-1">
                  <label className="font-bold text-sm uppercase text-stone-700">Password</label>
                  <input 
                    type="password" 
                    className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                    placeholder="••••••••"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
               </div>

               <Button className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white border-2 border-stone-900 rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] active:shadow-none active:translate-y-1 transition-all" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : (isSignup ? "Complete Registration" : "Enter System")}
               </Button>
            </form>

            <div className="mt-8 text-center">
               <Link to={isSignup ? "/login" : "/register"} className="font-bold text-stone-900 hover:text-orange-600 hover:underline decoration-2 underline-offset-4">
                  {isSignup ? "Already have an ID? Log In" : "New staff? Register here"}
               </Link>
            </div>
         </div>
      </div>

    </div>
  );
}