import React from "react";
import NoteBlockViewer from "./NoteBlockViewer";

const NoteEdgeCaseViewer = ({ cases = [] }) => {
  // Re-routes data processing straight to the polymorphic layout component engine
  return <NoteBlockViewer blocks={cases} />;
};

export default NoteEdgeCaseViewer;