import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProblemById, updateProblem } from "../../api/problemApi";
import Button from "../../components/common/Button";
import ProblemForm from "../../components/problems/ProblemForm";
import CodeViewer from "../../components/problems/CodeViewer";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Operational Layout States
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Unified Field Forms Container State
  const [formData, setFormData] = useState({
    title: "",
    platform: "LeetCode",
    problemLink: "",
    difficulty: "Medium",
    language: "C++",
    userCode: "",
  });

  // Individual Tag Chip State Array Tracker
  const [selectedTopics, setSelectedTopics] = useState([]);

  // Hydrate Form fields on page entry
  useEffect(() => {
    const hydrateWorkspace = async () => {
      try {
        const response = await getProblemById(id);
        if (response.success) {
          const { title, platform, problemLink, difficulty, language, userCode, topics } = response.problem;
          
          setFormData({
            title: title || "",
            platform: platform || "LeetCode",
            problemLink: problemLink || "",
            difficulty: difficulty || "Medium",
            language: language || "C++",
            userCode: userCode || "",
          });
          
          setSelectedTopics(topics || []);
        }
      } catch (err) {
        toast.error("Failed to recover problem instance configurations.");
        navigate("/problems");
      } {
        setLoading(false);
      }
    };
    hydrateWorkspace();
  }, [id, navigate]);

  const handleCodeChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, userCode: value }));
    if (errors.userCode) setErrors((prev) => ({ ...prev, userCode: "" }));
  };

  // Commit changes back to DB cluster
  const handleUpdateSubmission = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.title.trim()) validationErrors.title = "Problem title is required.";
    if (!formData.userCode.trim()) validationErrors.userCode = "Solution code cannot be empty.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please resolve form completion requirements.");
      return;
    }

    setSaveLoading(true);
    try {
      const payload = {
        ...formData,
        topics: selectedTopics,
      };

      const response = await updateProblem(id, payload);
      if (response.success) {
        toast.success("Problem modifications successfully committed!");
        navigate(`/problems/${id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to finalize modifications.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-[var(--primary)]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent mb-2" />
        <span className="text-sm font-semibold text-[var(--text-muted)]">Hydrating workspace modules...</span>
      </div>
    );
  }

  return (
    <div  className="min-h-screen bg-[var(--bg-base)] p-4 sm:p-6 lg:p-8 animate-fade-in space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Modify Solved Problem</h1>
        <p className="text-sm text-[var(--text-muted)]">Alter your metadata mapping boundaries or refactor source logic frameworks.</p>
      </div>

      {/* Shared Reusable Component Configuration Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Isolated Input Form Controls Container */}
        <div className="lg:col-span-5">
          <ProblemForm
            formData={formData}
            setFormData={setFormData}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
            errors={errors}
            setErrors={setErrors}
            loading={saveLoading}
          />
        </div>

        {/* Dynamic Editor Workspace Column */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <CodeViewer
            language={formData.language}
            userCode={formData.userCode}
            onChange={handleCodeChange}
            error={errors.userCode}
            loading={saveLoading}
          />

          {errors.userCode && (
            <p className="text-sm text-[var(--danger)] font-medium pl-1">{errors.userCode}</p>
          )}

          {/* Action Commit Control Row */}
          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              onClick={handleUpdateSubmission}
              loading={saveLoading}
              className="w-full sm:w-auto px-8 shadow-sm shadow-[var(--primary)]/10"
            >
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default EditProblem;