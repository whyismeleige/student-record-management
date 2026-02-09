// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, UserCheck, Loader2 } from "lucide-react";
import { studentApi } from "@/lib/api/student.api";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGrade, setFilterGrade] = useState("");

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [filterGrade]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterGrade) params.grade = filterGrade;
      if (searchQuery) params.search = searchQuery;

      const response = await studentApi.getAll(params);
      setStudents(response.data.data.students);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await studentApi.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleSearch = () => {
    fetchStudents();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await studentApi.delete(id);
      toast.success("Student deleted successfully");
      fetchStudents();
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete student");
    }
  };

  const getColorByGrade = (grade) => {
    switch (grade) {
      case "10th":
        return "bg-blue-200";
      case "11th":
        return "bg-yellow-200";
      case "12th":
        return "bg-red-200";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-stone-900">
      <Navbar />

      <main className="container mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-black text-stone-900">
              Student Records
            </h1>
            <p className="text-stone-500 font-bold font-mono mt-1">
              :: Total Students: {stats?.totalStudents || 0}
            </p>
          </div>
          <Button
            onClick={() => navigate("/students/new")}
            className="h-12 bg-orange-500 hover:bg-orange-600 text-white border-2 border-stone-900 rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] active:shadow-none active:translate-y-1 transition-all"
          >
            <Plus className="mr-2 h-5 w-5" strokeWidth={3} /> Enrol New Student
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-3">
            <div className="bg-white border-2 border-stone-900 p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
              <p className="font-bold text-sm text-stone-500 mb-3 font-mono uppercase">
                Filter View
              </p>
              <div className="space-y-2">
                {["All Students", "10th", "11th", "12th"].map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setFilterGrade(item === "All Students" ? "" : item)
                    }
                    className={`w-full text-left px-3 py-2 rounded border-2 font-bold transition-all ${
                      (item === "All Students" && !filterGrade) ||
                      filterGrade === item
                        ? "bg-orange-100 border-stone-900 text-stone-900"
                        : "bg-transparent border-transparent text-stone-500 hover:bg-stone-100 hover:border-stone-200"
                    }`}
                  >
                    {item === "All Students" ? item : `Grade ${item}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats Card */}
            {stats && (
              <div className="bg-stone-900 text-white border-2 border-stone-900 p-5 rounded-lg shadow-[4px_4px_0px_0px_rgba(168,162,158,1)]">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck size={18} />
                  <span className="font-mono font-bold text-sm">
                    ATTENDANCE
                  </span>
                </div>
                <div className="text-4xl font-serif font-black">
                  {stats.attendanceStats?.avgAttendance?.toFixed(1) || 0}%
                </div>
                <div className="text-stone-400 text-sm mt-1">
                  Average overall
                </div>
              </div>
            )}
          </div>

          {/* Main List */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-3 text-stone-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by ID or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full h-11 pl-10 pr-4 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all font-medium"
                />
              </div>
              <button
                onClick={handleSearch}
                className="h-11 px-6 bg-white border-2 border-stone-900 rounded-lg font-bold hover:bg-stone-50"
              >
                Search
              </button>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin h-8 w-8 text-stone-500" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-stone-500 text-lg font-bold">
                  No students found
                </p>
                <p className="text-stone-400 mt-2">
                  Try adjusting your filters or add a new student
                </p>
              </div>
            ) : (
              /* Cards Grid */
              <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
                {students.map((student) => (
                  <div
                    key={student._id}
                    className="relative group bg-white border-2 border-stone-900 rounded-xl p-0 shadow-sm hover:shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] transition-all duration-200"
                  >
                    {/* Header Color Strip */}
                    <div
                      className={`h-3 w-full border-b-2 border-stone-900 rounded-t-lg ${getColorByGrade(
                        student.grade
                      )}`}
                    ></div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-stone-100 border-2 border-stone-900 rounded-full flex items-center justify-center font-serif font-black text-lg">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg leading-tight">
                              {student.name}
                            </h3>
                            <p className="text-stone-500 font-mono text-xs">
                              ID: #{student.studentId}
                            </p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-stone-400 hover:text-stone-900">
                              <MoreHorizontal />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 border-2 border-stone-900 rounded-lg bg-white shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/students/${student._id}`)
                              }
                              className="cursor-pointer font-bold hover:bg-orange-100"
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/students/${student._id}/edit`)
                              }
                              className="cursor-pointer font-bold hover:bg-blue-50"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete(student._id, student.name)
                              }
                              className="cursor-pointer font-bold text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-2 bg-stone-50 border border-stone-200 rounded">
                          <p className="text-xs text-stone-500 font-bold uppercase">
                            GPA
                          </p>
                          <p className="font-mono font-bold text-lg">
                            {student.gpa?.toFixed(1) || "N/A"}
                          </p>
                        </div>
                        <div className="p-2 bg-stone-50 border border-stone-200 rounded">
                          <p className="text-xs text-stone-500 font-bold uppercase">
                            Status
                          </p>
                          <p
                            className={`font-bold text-sm ${
                              student.attendanceStatus === "Absent"
                                ? "text-red-500"
                                : student.attendanceStatus === "Late"
                                ? "text-orange-500"
                                : "text-green-600"
                            }`}
                          >
                            {student.attendanceStatus}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => navigate(`/students/${student._id}`)}
                        className="w-full border-2 border-stone-200 hover:border-stone-900 hover:bg-white text-stone-600 hover:text-stone-900 font-bold"
                      >
                        View Full Record
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}