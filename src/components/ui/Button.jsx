import React from "react";
import "../../styles/ui-button.css";

export default function Button({ children, variant = "primary", ...props }) {
  return (
    <button className={`ui-btn ${variant}`} {...props}>
      {children}
    </button>
  );
}
