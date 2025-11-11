import React from "react";
import "../../styles/ui-tag.css";

export default function Tag({ children, type = "info" }) {
  return <span className={`ui-tag ${type}`}>{children}</span>;
}
