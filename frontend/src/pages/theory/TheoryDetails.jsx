import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTheoryNote } from "../../api/theoryApi";

import Alert from "../../components/common/Alert";
import ViewerHeader from "../../components/theory/viewer/ViewerHeader";
import ViewerContent from "../../components/theory/viewer/ViewerContent";

import "./Theory.css";
import Glow from "../../components/common/Glow";


const TheoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchTheoryData = async () => {
      try {
        const res = await getTheoryNote(id);
        if (res?.success && isMounted) {
          setTopic(res.theory.topic);
          setContent(res.theory.content || "");
        } else {
          throw new Error();
        }
      } catch (err) {
        if (isMounted) setApiError("We couldn't load your study note content at the moment.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTheoryData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center font-mono text-sm text-text-muted select-none">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="animate-pulse tracking-wide">Loading study guide...</span>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen bg-bg-base w-full flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-bg-surface border border-border-default rounded-md p-2">
          <Alert title="Loading Error" message={apiError} variant="danger" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-bg-base text-text-main selection:bg-primary/20 flex flex-col relative overflow-hidden">
      <Glow preset="subtle" />
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex flex-col flex-1">
        
        <ViewerHeader 
          topic={topic} 
          onBackClick={() => navigate("/dashboard")} 
        />

        <ViewerContent 
          content={content} 
        />

      </div>
    </div>
  );
};

export default TheoryDetails;