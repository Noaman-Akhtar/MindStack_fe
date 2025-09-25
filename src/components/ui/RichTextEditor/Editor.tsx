import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import "./styles.css"; // add this to apply the fill styles

type EditorProps = {
  readOnly?: boolean;
  defaultValue?: any;
  onTextChange?: (delta: any, oldDelta: any, source: any) => void;
  onSelectionChange?: (range: any | null, oldRange:any | null, source: any) => void;
};

const toolbarOptions = [
  ['bold','italic','underline','strike'],
  ['blockquote','code-block'],
  ['link','image'],                
  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }], 
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean'],
];

function setRef<T>(ref: React.ForwardedRef<T>, value: T) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as React.MutableRefObject<T>).current = value;
}

const Editor = forwardRef<Quill | null, EditorProps>(
  ({ readOnly = false, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const quillRef = useRef<Quill | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    }, [onTextChange, onSelectionChange]);

    useEffect(() => {
      quillRef.current?.enable(!readOnly);
    }, [readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );

      // Make the Quill root fill the parent
      editorContainer.className = "quill-root";

      const quill = new Quill(editorContainer, {
        theme: 'snow',
        modules: { toolbar: toolbarOptions },
        placeholder: 'Write here...',
      });

      quillRef.current = quill;
      setRef(ref, quill);

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      const handleText = (delta: any, oldDelta: any, source: any) =>
        onTextChangeRef.current?.(delta, oldDelta, source);
      const handleSelection = (range: any | null, oldRange: any | null, source: any) =>
        onSelectionChangeRef.current?.(range, oldRange, source);

      quill.on('text-change', handleText);
      quill.on('selection-change', handleSelection);

      return () => {
        quill.off('text-change', handleText);
        quill.off('selection-change', handleSelection);
        quillRef.current = null;
        setRef(ref, null);
        container.innerHTML = '';
      };
    }, [ref]);

    return <div ref={containerRef} className="h-full" />; // was min-h, use h-full
  },
);

Editor.displayName = 'Editor';
export default Editor;