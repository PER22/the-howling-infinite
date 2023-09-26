import React from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
// import "./styles.css";

export const Editor = ({ onChange, innerHTML }) => {
  const [editorContent, setEditorContent] = React.useState(innerHTML);

  const handleChange = value => {
    setEditorContent(value);
    if (onChange) {
      onChange(value); 
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