import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getLeetCodeProfile } from "../../api/leetcodeApi";

import SetupForm from "../../components/leetcode/SetupForm";
import ProfileHeader from "../../components/leetcode/ProfileHeader";
import StatsGrid from "../../components/leetcode/StatsGrid";
import ProgressBars from "../../components/leetcode/ProgressBars";
import ContestCard from "../../components/leetcode/ContestCard";
import SkillsCard from "../../components/leetcode/SkillsCard";
import BadgesGrid from "../../components/leetcode/BadgesGrid";
import LanguagesCard from "../../components/leetcode/LanguagesCard";
import SubmissionsCard from "../../components/leetcode/SubmissionsCard";
import LeetcodeSkeleton from "../../components/skeletons/LeetcodeSkeleton";

const LeetcodeProfile = () => {
  const { user } = useAuth(); 
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.leetcode_username) {
      fetchProfile();
    } else {
      setLoading(false);
      setProfile(null);
      setError(""); 
    }
  }, [user?.leetcode_username]);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getLeetCodeProfile();
      
      if (res?.success && res.data && res.data.user) {
        setProfile(res.data);
      } else {
        setProfile(null);
        setError("We could not find details with the given username. Please check the username on LeetCode and update it.");
      }
    } catch (err) {
      setProfile(null);
      setError("Failed to load LeetCode data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-8 text-text-main font-sans select-none animate-fade-in relative z-10">

      {/* Loading State */}
      {loading && <LeetcodeSkeleton />}

      {/* Setup Form View */}
      {!loading && (!user?.leetcode_username || error) && (
        <SetupForm
          currentUsername={user?.leetcode_username}
          error={error}
          onSuccess={fetchProfile}
        />
      )}

      {/* Profile Content Grid */}
      {!loading && !error && profile?.user && (
        <div className="space-y-6">
          <ProfileHeader data={profile.user} />
          <StatsGrid data={profile.solved} />
          <ProgressBars data={profile.solved} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContestCard data={profile.contest} />
            <SkillsCard data={profile.skill} />
          </div>

          <BadgesGrid data={profile.badges} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LanguagesCard data={profile.language} />
            <SubmissionsCard submissions={profile.profile?.recentSubmissions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeetcodeProfile;