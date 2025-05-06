"use client";

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export type EditRichTextEditorHandle = {
  getContent: () => string;
};

type Props = {
  value?: string;
};

const RichTextEditor = forwardRef<EditRichTextEditorHandle, Props>(
  ({ value = "" }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    const handleImageUpload = () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
          const res = await fetch("/api/singleImageUpload", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          const imageUrl = data?.data?.url;

          const range = quillRef.current?.getSelection(true);
          if (range && imageUrl) {
            quillRef.current?.insertEmbed(range.index, "image", imageUrl, "user");
            quillRef.current?.setSelection(range.index + 1);
          }
        } catch (err) {
          console.error("Image upload failed", err);
        }
      };
    };

    useEffect(() => {
      if (editorRef.current && !quillRef.current) {
        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
          modules: {
            toolbar: {
              container: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ align: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }],
                ["link", "image"],
                [{ color: [] }, { background: [] }],
                ["clean"],
              ],
              handlers: {
                image: handleImageUpload,
              },
            },
          },
          placeholder: "Write something amazing...",
        });

        // ✅ Paste the initial value (HTML content)
        if (value) {
          quillRef.current.clipboard.dangerouslyPasteHTML(value);
        }
      }
    }, [value]);

    useImperativeHandle(ref, () => ({
      getContent: () => {
        return quillRef.current ? quillRef.current.root.innerHTML : "";
      },
    }));

    return (
      <div
        ref={editorRef}
        className="bg-white dark:bg-zinc-700 rounded-lg shadow-sm"
        style={{ minHeight: "400px" }}
      />
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
