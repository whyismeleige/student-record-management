// pages/StudentDetail.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  User,
  Loader2,
} from "lucide-react";
import { studentApi } from "@/lib/api/student.api";
import toast from "react-hot-toast";

export default function StudentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await studentApi.getById(id);
      setStudent(response.data.data.student);
    } catch (error) {
      toast.error("Failed to load student details");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${student.name}?`))
      return;

    try {
      await studentApi.delete(id);
      toast.success("Student deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to delete student");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-stone-500" />
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const formatDate = (date) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 bg-stone-50 border border-stone-200 rounded-lg">
      <Icon className="text-stone-500 mt-0.5 flex-shrink-0" size={18} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-stone-500 uppercase mb-1">
          {label}
        </p>
        <p className="font-medium text-stone-900 break-words">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-stone-900">
      <Navbar />

      <main className="container mx-auto px-6 py-10 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 font-bold text-stone-700 hover:text-stone-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-serif font-black text-stone-900">
                {student.name}
              </h1>
              <p className="text-stone-500 font-mono mt-2">
                ID: #{student.studentId} • {student.department} •{" "}
                {student.grade} Grade
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => navigate(`/students/${id}/edit`)}
                className="bg-blue-500 hover:bg-blue-600 text-white border-2 border-stone-900 rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] active:shadow-none active:translate-y-1 transition-all"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 text-white border-2 border-stone-900 rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] active:shadow-none active:translate-y-1 transition-all"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Student Avatar & Key Stats */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div className="bg-white border-2 border-stone-900 rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)] text-center">
              <div className="w-32 h-32 mx-auto bg-stone-100 border-2 border-stone-900 rounded-full flex items-center justify-center font-serif font-black text-5xl mb-4">
                {student.name.charAt(0)}
              </div>
              <h3 className="font-bold text-xl mb-1">{student.name}</h3>
              <p className="text-stone-500 font-mono text-sm">
                {student.studentId}
              </p>
              <div
                className={`inline-block px-3 py-1 mt-3 rounded-full text-xs font-bold ${
                  student.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : student.status === "Graduated"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {student.status}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border-2 border-stone-900 rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-stone-200">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-bold text-blue-600 uppercase">
                    GPA
                  </p>
                  <p className="text-2xl font-mono font-black text-blue-700">
                    {student.gpa?.toFixed(2) || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs font-bold text-green-600 uppercase">
                    Attendance
                  </p>
                  <p className="text-2xl font-mono font-black text-green-700">
                    {student.attendancePercentage}%
                  </p>
                </div>
                <div
                  className={`p-3 border rounded-lg ${
                    student.attendanceStatus === "Present"
                      ? "bg-green-50 border-green-200"
                      : student.attendanceStatus === "Late"
                      ? "bg-orange-50 border-orange-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <p
                    className={`text-xs font-bold uppercase ${
                      student.attendanceStatus === "Present"
                        ? "text-green-600"
                        : student.attendanceStatus === "Late"
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    Status
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      student.attendanceStatus === "Present"
                        ? "text-green-700"
                        : student.attendanceStatus === "Late"
                        ? "text-orange-700"
                        : "text-red-700"
                    }`}
                  >
                    {student.attendanceStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white border-2 border-stone-900 rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-stone-200">
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <InfoRow icon={Mail} label="Email" value={student.email} />
                <InfoRow icon={Phone} label="Phone" value={student.phone} />
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={formatDate(student.dateOfBirth)}
                />
                <InfoRow icon={User} label="Gender" value={student.gender} />
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white border-2 border-stone-900 rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-stone-200">
                Academic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <InfoRow
                  icon={GraduationCap}
                  label="Grade"
                  value={student.grade}
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Department"
                  value={student.department}
                />
                <InfoRow
                  icon={Calendar}
                  label="Enrollment Year"
                  value={student.enrollmentYear}
                />
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                  <p className="text-xs font-bold text-stone-500 uppercase mb-1">
                    Created By
                  </p>
                  <p className="font-medium text-stone-900">
                    {student.createdBy?.name || "System"}
                  </p>
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="bg-white border-2 border-stone-900 rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-stone-200">
                Guardian Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <InfoRow
                  icon={User}
                  label="Guardian Name"
                  value={student.guardianName}
                />
                <InfoRow
                  icon={Phone}
                  label="Guardian Phone"
                  value={student.guardianPhone}
                />
                <div className="md:col-span-2">
                  <InfoRow
                    icon={Mail}
                    label="Guardian Email"
                    value={student.guardianEmail}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white border-2 border-stone-900 rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
              <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-stone-200">
                Address
              </h3>
              <InfoRow
                icon={MapPin}
                label="Full Address"
                value={
                  student.address?.street ||
                  student.address?.city ||
                  student.address?.state ||
                  student.address?.zipCode
                    ? `${student.address.street || ""}${
                        student.address.street ? ", " : ""
                      }${student.address.city || ""}${
                        student.address.city ? ", " : ""
                      }${student.address.state || ""} ${
                        student.address.zipCode || ""
                      }`.trim()
                    : "Not provided"
                }
              />
            </div>

            {/* Notes */}
            {student.notes && (
              <div className="bg-white border-2 border-stone-900 rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
                <h3 className="font-bold text-lg mb-4 pb-2 border-b-2 border-stone-200">
                  Additional Notes
                </h3>
                <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                  {student.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}