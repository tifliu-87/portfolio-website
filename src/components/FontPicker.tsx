import { useState } from "react";
import { FONT_OPTIONS, applyFont } from "../fonts";

/** TESTING ONLY: runtime display-font switcher. See src/fonts.ts for removal notes. */
export function FontPicker() {
  const [active, setActive] = useState(FONT_OPTIONS[0].id);
  return (
    <div className="font-picker" role="group" aria-label="Font tester">
      <span className="fp-label">type · test</span>
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
