import React from "react";
import "../../styles/ui-input.css";

export default function Input({ label, ...props }) {
  return (
    <div className="ui-input-box">
      {label && <label className="ui-input-label">{label}</label>}
      <input className="ui-input" {...props} />
    </div>
  );
}
