/*
 * The intro is a plain page-coloured layer over everything except the process strip,
 * which sits above it (see `.strip` in globals.css). All timing lives in the CSS.
 */
export function Intro() {
  return <div className="intro" aria-hidden="true" />;
}
