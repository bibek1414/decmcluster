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
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  height?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your email content here...",
  className,
  minHeight = "300px",
  maxHeight = "500px",
  height,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const existingAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
  const isUpdatingRef = useRef(false);

  // Inline Link Editor States
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [isEditingExistingLink, setIsEditingExistingLink] = useState(false);

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
      let isLink = false;
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
        while (node && node !== editorRef.current) {
          if (node.nodeName === "A") {
            isLink = true;
            break;
          }
          node = node.parentNode;
        }
      }

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
        link: isLink,
      });
    } catch {
      // Ignore queryCommandState errors if selection is out of focus
    }
  };

  const executeCommand = (command: string, val: string | null = null) => {
    if (disabled) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val ?? undefined);
    handleInput();
  };

  const applyHeading = (tag: string) => {
    if (tag === "p") {
      executeCommand("formatBlock", "<p>");
    } else {
      executeCommand("formatBlock", `<${tag}>`);
    }
  };

  // Open inline link popover bar without window.prompt
  const handleOpenLinkInput = () => {
    if (disabled) return;

    if (showLinkInput) {
      handleCloseLinkInput();
      return;
    }

    const sel = window.getSelection();
    let range: Range | null = null;
    if (sel && sel.rangeCount > 0) {
      const r = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(r.commonAncestorContainer)) {
        range = r.cloneRange();
      }
    }

    savedRangeRef.current = range;
    const txt = range ? range.toString() : "";
    setSelectedText(txt);

    let existingAnchor: HTMLAnchorElement | null = null;
    if (range) {
      let node: Node | null = range.commonAncestorContainer;
      while (node && node !== editorRef.current) {
        if (node.nodeName === "A") {
          existingAnchor = node as HTMLAnchorElement;
          break;
        }
        node = node.parentNode;
      }
    }

    existingAnchorRef.current = existingAnchor;

    if (existingAnchor) {
      setLinkUrl(existingAnchor.getAttribute("href") || "");
      setLinkText(existingAnchor.textContent || txt);
      setIsEditingExistingLink(true);
    } else {
      setLinkUrl("");
      setLinkText(txt);
      setIsEditingExistingLink(false);
    }

    setShowLinkInput(true);
  };

  const handleCloseLinkInput = () => {
    setShowLinkInput(false);
    setLinkUrl("");
    setLinkText("");
    setSelectedText("");
    setIsEditingExistingLink(false);
    existingAnchorRef.current = null;
  };

  const handleApplyLink = () => {
    if (disabled) return;

    let url = linkUrl.trim();
    if (!url) {
      if (isEditingExistingLink) {
        handleRemoveLink();
      } else {
        handleCloseLinkInput();
      }
      return;
    }

    if (
      !/^https?:\/\//i.test(url) &&
      !url.startsWith("mailto:") &&
      !url.startsWith("tel:") &&
      !url.startsWith("#") &&
      !url.startsWith("/")
    ) {
      url = `https://${url}`;
    }

    if (editorRef.current) {
      editorRef.current.focus();
    }

    // Case 1: Editing an existing link element directly
    if (existingAnchorRef.current && editorRef.current?.contains(existingAnchorRef.current)) {
      existingAnchorRef.current.setAttribute("href", url);
      existingAnchorRef.current.setAttribute("target", "_blank");
      existingAnchorRef.current.setAttribute("rel", "noopener noreferrer");
      existingAnchorRef.current.className = "text-primary underline";
      if (linkText.trim() && linkText.trim() !== existingAnchorRef.current.textContent) {
        existingAnchorRef.current.textContent = linkText.trim();
      }
    }
    // Case 2: Selected text range exists
    else if (savedRangeRef.current && !savedRangeRef.current.collapsed) {
      try {
        const range = savedRangeRef.current;
        const extracted = range.extractContents();
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "text-primary underline";

        const textOverride = linkText.trim();
        if (textOverride && textOverride !== selectedText) {
          a.textContent = textOverride;
        } else if (extracted.textContent && extracted.textContent.length > 0) {
          a.appendChild(extracted);
        } else {
          a.textContent = textOverride || url;
        }

        range.insertNode(a);

        // Position selection caret right after inserted link
        const sel = window.getSelection();
        if (sel) {
          const newRange = document.createRange();
          newRange.setStartAfter(a);
          newRange.setEndAfter(a);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      } catch {
        const sel = window.getSelection();
        if (sel && savedRangeRef.current) {
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        }
        document.execCommand("createLink", false, url);
      }
    }
    // Case 3: No text selected (collapsed selection range)
    else {
      const textToInsert = linkText.trim() || url;
      const a = document.createElement("a");
      a.href = url;
      a.textContent = textToInsert;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "text-primary underline";

      if (savedRangeRef.current) {
        savedRangeRef.current.insertNode(a);
        const sel = window.getSelection();
        if (sel) {
          const newRange = document.createRange();
          newRange.setStartAfter(a);
          newRange.setEndAfter(a);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      } else if (editorRef.current) {
        editorRef.current.appendChild(a);
      }
    }

    handleInput();
    handleCloseLinkInput();
  };

  const handleRemoveLink = () => {
    if (disabled) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }

    if (existingAnchorRef.current && editorRef.current?.contains(existingAnchorRef.current)) {
      const textNode = document.createTextNode(existingAnchorRef.current.textContent || "");
      existingAnchorRef.current.parentNode?.replaceChild(textNode, existingAnchorRef.current);
    } else {
      const sel = window.getSelection();
      if (sel && savedRangeRef.current) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
      document.execCommand("unlink");
    }

    handleInput();
    handleCloseLinkInput();
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card text-card-foreground overflow-hidden transition-all focus-within:border-primary/60",
        disabled && "opacity-60 pointer-events-none bg-muted/30",
        className
      )}
      style={height ? { height } : undefined}
    >
      {/* Clean Toolbar Header */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-1.5 text-xs shrink-0">
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
            onClick={handleOpenLinkInput}
            title="Insert / Edit Link"
            className={cn(
              "p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
              (activeFormats.link || showLinkInput) && "bg-primary/15 text-primary font-semibold"
            )}
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

      {/* Inline Link Input Bar (replaces window.prompt) */}
      {showLinkInput && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs shrink-0 transition-all animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 font-medium">
            <LinkIcon className="w-3.5 h-3.5 text-primary" />
            <span>Link URL:</span>
          </div>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyLink();
              } else if (e.key === "Escape") {
                e.preventDefault();
                handleCloseLinkInput();
              }
            }}
            autoFocus
            className="flex-1 min-w-[180px] px-2.5 py-1 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Display text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyLink();
              } else if (e.key === "Escape") {
                e.preventDefault();
                handleCloseLinkInput();
              }
            }}
            className="w-40 px-2.5 py-1 text-xs rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleApplyLink}
              title="Apply Link"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
            {isEditingExistingLink && (
              <button
                type="button"
                onClick={handleRemoveLink}
                title="Remove Link"
                className="flex items-center gap-1 px-2 py-1 rounded bg-destructive/10 text-destructive font-medium text-xs hover:bg-destructive/20 transition-colors cursor-pointer"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Unlink</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCloseLinkInput}
              title="Cancel"
              className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Editor Body with Overflow Scrolling */}
      <div
        className="relative flex-1 bg-background overflow-y-auto"
        style={{
          minHeight: height ? undefined : minHeight,
          maxHeight: height ? undefined : maxHeight,
        }}
      >
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          style={{ minHeight: height ? "100%" : minHeight }}
          className="prose dark:prose-invert max-w-none p-4 text-sm focus:outline-none overflow-y-auto leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-3 [&_blockquote]:italic [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_a]:text-primary [&_a]:underline font-normal"
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


