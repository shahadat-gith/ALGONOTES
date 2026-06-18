import React from "react";
import { useParams } from "react-router-dom";
import { useTheoryEditor } from "../../hooks/useTheoryEditor";

import Alert from "../../components/common/Alert";
import Header from "../../components/theory/editor/Header";
import Toolbar from "../../components/theory/editor/Toolbar";
import AssetModal from "../../components/theory/editor/AssetModal";
import TheoryEditorSkeleton from "../../components/skeletons/TheoryEditorSkeleton"; // Imported here

import "./Theory.css";

const TheoryEditor = () => {
  const { id } = useParams();

  const {
    editorRef,
    topic,
    loading,
    saving,
    apiError,
    activePlaceholderKey,
    handleSaveChanges,
    executeFormattingCommand,
    handleAssetResolved,
  } = useTheoryEditor(id);

  // Swapped the simple spinner out for the comprehensive dashboard layout skeleton
  if (loading) {
    return <TheoryEditorSkeleton />;
  }

  if (apiError) {
    return (
      <div className="min-h-screen bg-bg-base w-full flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-bg-surface border border-border-default rounded-md p-2">
          <Alert title="Error Loading Note" message={apiError} variant="danger" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-bg-base text-text-main selection:bg-primary/20 flex flex-col font-sans relative z-10 animate-fade-in select-none">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex flex-col flex-1 h-screen max-h-screen overflow-hidden">
        
        <label id="algonotes-asset-modal-trigger" htmlFor="asset-modal" className="hidden"></label>

        <AssetModal
          id={id}
          activePlaceholderKey={activePlaceholderKey}
          onAssetResolved={handleAssetResolved}
        />

        <Header 
          topic={topic}
          saving={saving}
          onSaveChanges={handleSaveChanges}
        />

        <Toolbar onFormatCommand={executeFormattingCommand} />

        <div className="w-full flex-1 rounded-b-md border-x border-b border-border-default bg-bg-surface overflow-hidden shadow-card focus-within:border-primary/20 transition-all duration-300 min-h-0 mb-4 flex flex-col">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="algonotes-article w-full flex-1 p-6 md:p-10 bg-bg-surface outline-none overflow-y-auto"
            placeholder="Type your notes or document study details here..."
          />
        </div>

      </div>
    </div>
  );
};

export default TheoryEditor;