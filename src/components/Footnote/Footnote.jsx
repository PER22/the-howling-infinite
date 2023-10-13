import React, {useState} from "react";
export default function Footnote({content, number}){
    const [showFootnote, setShowFootnote]= useState(false);

    return (
        <span className="footnote-container" onMouseEnter={() => setShowFootnote(true)} onMouseLeave={() => setShowFootnote(false)}>
            <span className="footnote-ref">[{number}]</span>
            {showFootnote && (
                <div className="footnote-tooltip">
                    {content}
                </div>
            )}
        </span>
    );
}