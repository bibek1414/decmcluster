"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Code,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  RemoveFormatting,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your email content here...",
  className,
  minHeight = "300px",
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  const handleInput = () => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    const currentHtml = editorRef.current.innerHTML;
    const cleanHtml =
      currentHtml === "<br>" || currentHtml === "<p><br></p>" ? "" : currentHtml;
    onChange(cleanHtml);
    updateActiveFormats();
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  };

  const updateActiveFormats = () => {
    if (typeof window === "undefined" || !document) return;
    try {
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough"),
        insertOrderedList: document.queryCommandState("insertOrderedList"),
        insertUnorderedList: document.queryCommandState("insertUnorderedList"),
        justifyLeft: document.queryCommandState("justifyLeft"),
        justifyCenter: document.queryCommandState("justifyCenter"),
        justifyRight: document.queryCommandState("justifyRight"),
        justifyFull: document.queryCommandState("justifyFull"),
      });
    } catch {
      // Ignore queryCommandState errors if selection is out of focus
    }
  };

  const executeCommand = (command: string, value: string | null = null) => {
    if (disabled) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value ?? undefined);
    handleInput();
  };

  const applyHeading = (tag: string) => {
    if (tag === "p") {
      executeCommand("formatBlock", "<p>");
    } else {
      executeCommand("formatBlock", `<${tag}>`);
    }
  };

  const handleInsertLink = () => {
    if (disabled) return;
    const url = prompt("Enter link URL (e.g. https://example.com):");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const handleRemoveLink = () => {
    executeCommand("unlink");
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card text-card-foreground overflow-hidden transition-all focus-within:border-primary/60",
        disabled && "opacity-60 pointer-events-none bg-muted/30",
        className
      )}
    >
      {/* Clean Toolbar Header */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-1.5 text-xs">
        {/* Headings */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-border">
          <button
            type="button"
            onClick={() => applyHeading("p")}
            title="Paragraph"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Pilcrow className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyHeading("h1")}
            title="Heading 1"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyHeading("h2")}
            title="Heading 2"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyHeading("h3")}
            title="Heading 3"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyHeading("h4")}
            title="Heading 4"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Heading4 className="w-4 h-4" />
          </button>
        </div>

        {/* Basic Styles */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-border">
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            title="Bold"
            className={cn(
              "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              activeFormats.bold && "bg-primary/15 text-primary font-bold"
            )}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            title="Italic"
            className={cn(
              "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              activeFormats.italic && "bg-primary/15 text-primary"
            )}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("underline")}
            title="Underline"
            className={cn(
              "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              activeFormats.underline && "bg-primary/15 text-primary"
            )}
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("strikeThrough")}
            title="Strikethrough"
            className={cn(
              "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              activeFormats.strikeThrough && "bg-primary/15 text-primary"
            )}
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-border">
          <button
            type="button"
            onClick={() => executeCommand("justifyLeft")}
            title="Align Left"
            className={cn(
              "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              activeFormats.justifyLeft && "bg-primary/15 text-primary"
            )}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyCenter")}
            title="Align Center"
            className={cn(
              "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              activeFormats.justifyCenter && "bg-primary/15 text-primary"
            )}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyRight")}
            title="Align Right"
            className={cn(
              "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              activeFormats.justifyRight && "bg-primary/15 text-primary"
            )}
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyFull")}
            title="Justify"
            className={cn(
              "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              activeFormats.justifyFull && "bg-primary/15 text-primary"
            )}
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Blocks */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-border">
          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            title="Bulleted List"
            className={cn(
              "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              activeFormats.insertUnorderedList && "bg-primary/15 text-primary"
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            title="Numbered List"
            className={cn(
              "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              activeFormats.insertOrderedList && "bg-primary/15 text-primary"
            )}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "blockquote")}
            title="Quote"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "pre")}
            title="Code Block"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertHorizontalRule")}
            title="Horizontal Divider"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Link & Actions */}
        <div className="flex items-center gap-0.5 pl-1.5">
          <button
            type="button"
            onClick={handleInsertLink}
            title="Insert Link"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRemoveLink}
            title="Remove Link"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Unlink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("removeFormat")}
            title="Clear Formatting"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-border mx-1" />

          <button
            type="button"
            onClick={() => executeCommand("undo")}
            title="Undo"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("redo")}
            title="Redo"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 bg-background">
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          style={{ minHeight }}
          className="prose dark:prose-invert max-w-none p-4 text-sm focus:outline-none overflow-y-auto leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-3 [&_blockquote]:italic [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_a]:text-primary [&_a]:underline"
        />
        {!value && (
          <div
            onClick={() => editorRef.current?.focus()}
            className="absolute top-4 left-4 text-sm text-muted-foreground/60 pointer-events-none select-none italic"
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
