import { useState } from "react";
import { FONT_OPTIONS, applyFont } from "../fonts";

/** TESTING ONLY: runtime display-font switcher. See src/fonts.ts for removal notes. */
export function FontPicker() {
  const [active, setActive] = useState(FONT_OPTIONS[0].id);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        className="font-picker-toggle"
        aria-label="Open font tester"
        onClick={() => setOpen(true)}
      >
        type · test
      </button>
    );
  }

  return (
    <div className="font-picker" role="group" aria-label="Font tester">
      <div className="fp-head">
        <span className="fp-label">type · test</span>
        <button
          className="fp-close"
          aria-label="Collapse font tester"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
      </div>
      {FONT_OPTIONS.map((f) => (
        <button
          key={f.id}
          className={active === f.id ? "on" : ""}
          style={{ fontFamily: f.display, fontWeight: Number(f.displayWeight) }}
          onClick={() => {
            applyFont(f);
            setActive(f.id);
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
