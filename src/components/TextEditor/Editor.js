import React from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";
import './Editor.css'
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
        placeholder={"Write a new post here..."}
        modules={modules}
        formats={formats}
        className="quill-text-area"
      />
    </div>
  );
};


export default Editor;