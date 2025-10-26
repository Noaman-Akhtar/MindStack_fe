import React, { useRef, useEffect } from "react";
import Editor from "./Editor";
import Quill from "quill";
import "quill/dist/quill.snow.css";
const Delta = Quill.import("delta");

interface RichTextEditorProps {
  initialDelta?: any;
  initialHtml?: string;
  readOnly?: boolean;
  onDeltaChange?: (delta: any) => void;
  onHtmlChange?: (html: string) => void;
  className?: string;
  contentKey?: string | number;
}
export const RichTextEditor = ({
  initialHtml,
  initialDelta,
  readOnly = false,
  onDeltaChange,
  onHtmlChange,
  className = "",
  contentKey
}: RichTextEditorProps) => {
  // selection range tracking (currently unused but can be re-enabled if needed)
  // const [range, setRange] = useState<any>();
  const quillRef = useRef<Quill | null>(null);

  // Always reapply provided initial content when contentKey or initial props change.
  useEffect(() => {
    if (!quillRef.current) return;
    if (initialDelta) {
      try { quillRef.current.setContents(initialDelta); } catch {}
    } else if (initialHtml) {
      try { quillRef.current.clipboard.dangerouslyPasteHTML(initialHtml); } catch {}
    } else {
      quillRef.current.setContents(new Delta());
    }
    const html = quillRef.current.root.innerHTML;
    onHtmlChange?.(html);
    onDeltaChange?.(quillRef.current.getContents());
    
  }, []);

    
    function emitChange() {
      if (!quillRef.current) return;
      const html = quillRef.current.root.innerHTML;
      const delta = quillRef.current.getContents();
      onHtmlChange?.(html);
      onDeltaChange?.(delta);
    }

    

  function focusEditor() {
    quillRef.current?.focus();
  }
    return (
       <div
        className={`p-2 outline-none rounded-md bg-gray-100 border-[1.3px] border-gray-300 focus-within:border-purple-900/60 ${readOnly ? 'opacity-80 pointer-events-none select-none' : ''} ${className}`}
        tabIndex={0}
        onMouseDown={(e) => {
          // Only focus when clicking the chrome, let Quill manage clicks inside editor
          if (e.target === e.currentTarget && !readOnly) {
            focusEditor();
          }
        }}
      >
            <Editor
                ref={quillRef}
                readOnly={readOnly}
                // don't always inject a default heading; start empty if initial content provided
                defaultValue={initialDelta ? undefined : new Delta()}
                // onSelectionChange={setRange}
                onTextChange={()=>emitChange()}
            />

        </div>
    );
};
