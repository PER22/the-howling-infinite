import React from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
// import "./styles.css";

export const Editor = ({ onChange }) => {
  const [editorContent, setEditorContent] = React.useState('');

  const handleChange = value => {
    setEditorContent(value);
    if (onChange) {
      onChange(value);  // Pass the content back to parent
    }
  };

  return (
    <div className="text-editor">
      <EditorToolbar />
      <ReactQuill
        theme="snow"
        value={editorContent}
        onChange={handleChange}
        placeholder={"Write something awesome..."}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};


export default Editor;