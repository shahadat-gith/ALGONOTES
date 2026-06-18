import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeContainer = ({ code, language }) => {
  const PRISM_LANGUAGE_MAP = {
    "C++": "cpp",
    "Java": "java",
    "Python": "python",
    "JavaScript": "javascript",
    "TypeScript": "typescript",
    "C": "c",
  };

  const targetLanguage = PRISM_LANGUAGE_MAP[language] || language?.toLowerCase() || 'cpp';

  return (
    <div className="rounded-sm overflow-hidden border border-border-default">
      <SyntaxHighlighter 
        language={targetLanguage} 
        style={oneDark}
        codeTagProps={{
          style: {
            background: 'transparent',
            fontFamily: 'inherit',
          }
        }}
        customStyle={{ 
          margin: 0, 
          padding: '1rem', 
          background: '#010409',
          fontSize: '14px',
          lineHeight: '1.625'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeContainer;