'use client';

import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';

// Load Prism components
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup-templating';

// Prism styles for dark theme (customized for Atelier Dark)
const prismStyles = `
  .prism-editor-container {
    background-color: transparent !important;
  }
  .prism-editor-container textarea {
    outline: none !important;
    padding: 24px !important;
  }
  .prism-editor-container pre {
    padding: 24px !important;
    pointer-events: none;
  }
  code[class*="language-"],
  pre[class*="language-"] {
    color: #f8fafc;
    background: none;
    font-family: var(--font-mono);
    font-size: 13px;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.7;
    tab-size: 4;
    hyphens: none;
  }
  .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #4b5563; font-style: italic; }
  .token.punctuation { color: #94a3b8; }
  .token.namespace { opacity: .7; }
  .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted { color: #fb7185; }
  .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #34d399; }
  .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string { color: #fbbf24; }
  .token.atrule, .token.attr-value, .token.keyword { color: #a78bfa; }
  .token.function, .token.class-name { color: #60a5fa; }
  .token.regex, .token.important, .token.variable { color: #f472b6; }
`;

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  className?: string;
}

export function CodeEditor({ value, onChange, language, placeholder, className }: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPrismLanguage = (lang: string) => {
    switch (lang.toUpperCase()) {
      case 'PYTHON': return Prism.languages.python;
      case 'PHP_NATIVE':
      case 'LARAVEL': return Prism.languages.php;
      case 'JAVASCRIPT':
      case 'VUE': return Prism.languages.javascript;
      default: return Prism.languages.javascript;
    }
  };

  if (!mounted) {
    return (
      <div className="w-full min-h-[400px] bg-black/40 rounded-2xl flex items-center justify-center">
        <span className="text-xs text-muted-foreground animate-pulse">Initializing terminal...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <style dangerouslySetInnerHTML={{ __html: prismStyles }} />
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={code => Prism.highlight(code, getPrismLanguage(language), language.toLowerCase())}
        padding={0}
        placeholder={placeholder}
        className="font-mono text-sm min-h-[400px] outline-none prism-editor-container"
        textareaId="submittedCode"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          backgroundColor: 'transparent',
          minHeight: '400px'
        }}
      />
    </div>
  );
}
