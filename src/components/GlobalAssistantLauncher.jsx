import { useState } from "react";
import InsightsAssistant from "./InsightsAssistant";

export default function GlobalAssistantLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant"
        style={{
          position: "fixed",
          right: "22px",
          bottom: "22px",
          zIndex: 120,
          width: "58px",
          height: "58px",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "#B3131A",
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 14px 30px rgba(179,19,26,0.30)",
        }}
      >
        AI
      </button>

      <InsightsAssistant
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}