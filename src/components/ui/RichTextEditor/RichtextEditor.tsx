import React, { useRef, useState, type ReactElement, type ReactHTMLElement } from "react";
import Editor from "./Editor";
import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";

const Delta = Quill.import("delta");

export const RichTextEditor = () => {
    const [range, setRange] = useState<any>();
    const [lastChange, setLastChange] = useState<any>();
    const [readOnly, setReadOnly] = useState(false);

    // Use a ref to access the quill instance directly
    const quillRef = useRef<Quill | null>(null);
    // interface DeltaOp {
    //     insert?: string | object;
    //     attributes?: { [key: string]: any };
    // }

 function focusEditor() {
    quillRef.current?.focus();
  }
    return (
        <div  className="rounded-md p-2 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500"
      tabIndex={0}
      onFocus={focusEditor}
      onMouseDown={(e) => {
        // Prevent parent focus handlers stealing focus; then focus Quill
        e.preventDefault();
        focusEditor();
      }}>
            <Editor
                ref={quillRef}
                readOnly={readOnly}
                defaultValue={new Delta()
                    .insert("Hello")
                    .insert("\n", { header: 1 })
                    .insert("Some ")
                    .insert("initial", { bold: true })
                    .insert(" ")
                    .insert("content", { underline: true })
                    .insert("\n")}
                onSelectionChange={setRange}
                onTextChange={setLastChange}
            />

        </div>
    );
};
