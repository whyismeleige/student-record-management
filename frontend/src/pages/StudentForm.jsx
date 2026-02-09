// pages/StudentForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { studentApi } from "@/lib/api/student.api";
import toast from "react-hot-toast";

export default function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    grade: "10th",
    department: "Science",
    enrollmentYear: new Date().getFullYear(),
    gpa: "",
    attendanceStatus: "Present",
    attendancePercentage: "100",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    notes: "",
    status: "Active",
  });

  // Fetch student data if editing
  useEffect(() => {
    if (isEditMode) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setInitialLoading(true);
      const response = await studentApi.getById(id);
      const student = response.data.data.student;

      // Format date for input
      const formattedDate = student.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().split("T")[0]
        : "";

      setFormData({
        name: student.name || "",
        studentId: student.studentId || "",
        email: student.email || "",
        phone: student.phone || "",
        dateOfBirth: formattedDate,
        gender: student.gender || "Male",
        grade: student.grade || "10th",
        department: student.department || "Science",
        enrollmentYear: student.enrollmentYear || new Date().getFullYear(),
        gpa: student.gpa || "",
        attendanceStatus: student.attendanceStatus || "Present",
        attendancePercentage: student.attendancePercentage || "100",
        guardianName: student.guardianName || "",
        guardianPhone: student.guardianPhone || "",
        guardianEmail: student.guardianEmail || "",
        address: {
          street: student.address?.street || "",
          city: student.address?.city || "",
          state: student.address?.state || "",
          zipCode: student.address?.zipCode || "",
        },
        notes: student.notes || "",
        status: student.status || "Active",
      });
    } catch (error) {
      toast.error("Failed to load student data");
      navigate("/dashboard");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert empty strings to appropriate values
      const submitData = {
        ...formData,
        gpa: formData.gpa ? parseFloat(formData.gpa) : 0,
        attendancePercentage: formData.attendancePercentage
          ? parseFloat(formData.attendancePercentage)
          : 100,
        enrollmentYear: parseInt(formData.enrollmentYear),
      };

      if (isEditMode) {
        await studentApi.update(id, submitData);
        toast.success("Student updated successfully!");
      } else {
        await studentApi.create(submitData);
        toast.success("Student created successfully!");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Form submission error:", error);
      // Error toast is handled by api-client
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-stone-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-stone-900">
      <Navbar />

      <main className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 font-bold text-stone-700 hover:text-stone-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="text-4xl font-serif font-black text-stone-900">
            {isEditMode ? "Edit Student Record" : "Enrol New Student"}
          </h1>
          <p className="text-stone-500 font-mono mt-2">
            {isEditMode
              ? "Update student information below"
              : "Fill in the details to add a new student"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-stone-900 rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]"
        >
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-stone-200">
              Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Student ID *
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="STU260001"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="john.doe@student.edu"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-stone-200">
              Academic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Grade *
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                >
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                >
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Enrollment Year *
                </label>
                <input
                  type="number"
                  name="enrollmentYear"
                  value={formData.enrollmentYear}
                  onChange={handleChange}
                  required
                  min="2000"
                  max="2100"
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  GPA (0.0 - 4.0)
                </label>
                <input
                  type="number"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="4"
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="3.5"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Attendance Status
                </label>
                <select
                  name="attendanceStatus"
                  value={formData.attendanceStatus}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Attendance % (0-100)
                </label>
                <input
                  type="number"
                  name="attendancePercentage"
                  value={formData.attendancePercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="95"
                />
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-stone-200">
              Guardian Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Guardian Name
                </label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Guardian Phone
                </label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Guardian Email
                </label>
                <input
                  type="email"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="jane.doe@email.com"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-stone-200">
              Address
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Street
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="Springfield"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="California"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                  placeholder="12345"
                />
              </div>

              <div>
                <label className="block font-bold text-sm uppercase text-stone-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-stone-200">
              Additional Notes
            </h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 bg-white border-2 border-stone-900 rounded-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all"
              placeholder="Any additional notes about the student..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white border-2 border-stone-900 rounded-lg font-bold shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] active:shadow-none active:translate-y-1 transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              {isEditMode ? "Update Student" : "Create Student"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="h-12 px-8 border-2 border-stone-900 font-bold"
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}