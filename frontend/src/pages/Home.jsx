import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Book, Users, ClipboardCheck } from "lucide-react";
import { APP_CONFIG } from "@/config";

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-900 font-sans selection:bg-orange-200">
      <Navbar />

      {/* Notebook Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#44403c 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <main className="relative z-10 pt-20 pb-20 container mx-auto px-6">
        
        {/* --- HERO --- */}
        <section className="text-center max-w-4xl mx-auto mb-24">
          <div className="inline-block px-4 py-1.5 mb-6 bg-white border-2 border-stone-900 rounded-full font-mono text-sm font-bold shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] -rotate-2">
             📚 Academic Year 2025-2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-8 text-stone-900 leading-[0.95]">
            Manage students, <br/>
            <span className="relative inline-block">
               <span className="absolute inset-x-0 bottom-2 h-4 bg-orange-300 -z-10 -rotate-1"></span>
               not paperwork.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            {APP_CONFIG.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/dashboard">
              <Button className="h-14 px-10 text-lg bg-stone-900 text-white border-2 border-stone-900 hover:bg-stone-800 rounded-xl font-bold shadow-[6px_6px_0px_0px_rgba(249,115,22,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all">
                Try the Demo
              </Button>
            </Link>
            <Button variant="outline" className="h-14 px-10 text-lg bg-white text-stone-900 border-2 border-stone-900 rounded-xl font-bold shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all">
               Documentation
            </Button>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Student Directory", icon: Users, color: "bg-blue-100", text: "Centralized profiles with academic history and contact info." },
            { title: "Grade Book", icon: Book, color: "bg-green-100", text: "Automated GPA calculation and report card generation." },
            { title: "Attendance", icon: ClipboardCheck, color: "bg-pink-100", text: "Daily tracking with instant alerts for absentees." },
          ].map((f, i) => (
            <div key={i} className="group bg-white border-2 border-stone-900 rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] hover:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
               <div className={`w-14 h-14 ${f.color} border-2 border-stone-900 rounded-lg flex items-center justify-center mb-6`}>
                 <f.icon size={28} className="text-stone-900" strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3">{f.title}</h3>
               <p className="text-stone-600 font-medium leading-relaxed">{f.text}</p>
            </div>
          ))}
        </section>

        <footer className="mt-24 pt-12 border-t-2 border-stone-900/10 text-center font-mono text-stone-500 text-sm">
           <p>© 2026 ScholarSync Systems. Education First.</p>
        </footer>

      </main>
    </div>
  );
}