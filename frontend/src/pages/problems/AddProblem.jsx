import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProblem } from "../../api/problemApi";
import Button from "../../components/common/Button";
import ProblemForm from "../../components/problems/ProblemForm";
import CodeViewer from "../../components/problems/CodeViewer";
import { ArrowLeft, Sparkles } from "lucide-react";
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

    setFormData((prev) => ({
      ...prev,
      userCode: value,
    }));

    if (errors.userCode) {
      setErrors((prev) => ({
        ...prev,
        userCode: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!formData.title.trim()) {
      validationErrors.title = "Problem title is required.";
    }

    if (!formData.userCode.trim()) {
      validationErrors.userCode = "Solution code cannot be empty.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await createProblem({
        ...formData,
        topics: selectedTopics,
      });

      if (response.success) {
        navigate(`/problems/${response.problem.id}/note/generate`, {
          state: {
            problem: response.problem,
          },
        });
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create problem entry.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] px-4 py-5 mt-10 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mx-auto max-w-7xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="h-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-light)]">
                    Problem Details
                  </h2>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Add platform, difficulty, language, and related topics.
                  </p>
                </div>

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
            </div>

            <div className="lg:col-span-7">
              <div className="h-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-light)]">
                      Solution Code
                    </h2>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Paste the final accepted solution that AI should explain.
                    </p>
                  </div>

                  <span className="rounded-full border border-[var(--border-default)] bg-[var(--bg-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                    {formData.language}
                  </span>
                </div>

                <CodeViewer
                  language={formData.language}
                  userCode={formData.userCode}
                  onChange={handleCodeChange}
                  error={errors.userCode}
                  loading={loading}
                />

                <div className="p-4 flex justify-center items-center">
                  <Button
                    variant="primary"
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    className="w-full"
                  >
                    <Sparkles size={16} />
                    Generate Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProblem;
