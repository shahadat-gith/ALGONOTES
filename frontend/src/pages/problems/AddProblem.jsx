
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProblem } from "../../api/problemApi";
import Button from "../../components/common/Button";
import ProblemForm from "../../components/problems/ProblemForm";
import CodeViewer from "../../components/problems/CodeViewer";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const AddProblem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    platform: "LeetCode",
    problemLink: "",
    difficulty: "Medium",
    language: "C++",
    userCode: "",
  });

  const [selectedTopics, setSelectedTopics] = useState([]);

  const handleCodeChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, userCode: value }));
    if (errors.userCode) setErrors((prev) => ({ ...prev, userCode: "" }));
  };

  const handleSubmit = async (e, shouldGenerateNotes = false) => {
    e.preventDefault();
    
    const validationErrors = {};
    if (!formData.title.trim()) validationErrors.title = "Problem title is required.";
    if (!formData.userCode.trim()) validationErrors.userCode = "Solution code cannot be empty.";
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await createProblem({ ...formData, topics: selectedTopics });
      if (response.success) {
        toast.success("Problem added successfully!");
        if (shouldGenerateNotes) {
          navigate(`/problems/${response.problem.id}/generate`);
        } else {
          navigate("/problems");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create problem entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Add New Problem</h1>
        <p className="text-sm text-[var(--text-muted)]">Store your compiler-ready solution and prepare your AI note extraction parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <ProblemForm
            formData={formData}
            setFormData={setFormData}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
            errors={errors}
            setErrors={setErrors}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col space-y-4">
          <CodeViewer
            language={formData.language}
            userCode={formData.userCode}
            onChange={handleCodeChange}
            error={errors.userCode}
            loading={loading}
          />
          
          {errors.userCode && (
            <p className="text-sm text-[var(--danger)] font-medium pl-1">{errors.userCode}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={(e) => handleSubmit(e, false)} disabled={loading} className="bg-white">
              <Save size={16} />
              Save problem
            </Button>
            <Button variant="primary" onClick={(e) => handleSubmit(e, true)} loading={loading} disabled={loading}>
              <Sparkles size={16} />
              Save problem & Generate AI Notes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProblem;