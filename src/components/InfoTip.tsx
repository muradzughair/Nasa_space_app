import { useEffect } from "react";
import { installInfo } from "../rover/info.js";

interface Props {
  /** The note: one to three short, plain sentences. */
  text: string;
  /** What a screen reader announces for the button. */
  label?: string;
}

/**
 * A round "!" button placed beside the control or title it explains. Clicking
 * it opens a short note; clicking again, Escape or a click elsewhere closes
 * it. It shares rover/info.js with the rover screens, so only one note is
 * open at a time anywhere in the app. Never put it inside another button.
 */
export function InfoTip({ text, label = "More information" }: Props) {
  useEffect(() => installInfo(), []);
  return (
    <button type="button" className="info-btn" aria-label={label} aria-expanded="false" data-info={text}>
      !
    </button>
  );
}
