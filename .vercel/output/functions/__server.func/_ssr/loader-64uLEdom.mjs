import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
/**
* SpinnerToCheck — thin ring spinner morphs into filled circle
* with drawn checkmark, holds, then loops. Matches uploaded loading.mp4.
* Monochrome (default black/white) — pass `color` / `bg` to theme.
*/
function SpinnerToCheck({ size = 60, color = "#000", bg = "#fff" }) {
	const r = 9;
	const c = 2 * Math.PI * r;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: size,
			height: size,
			position: "relative"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			style: {
				width: "100%",
				height: "100%",
				overflow: "visible"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r,
					fill: "none",
					stroke: color,
					strokeWidth: "1.4",
					strokeLinecap: "round",
					strokeDasharray: `${c * .78} ${c * .22}`,
					style: {
						transformOrigin: "12px 12px",
						animation: "spin 0.9s linear infinite, ringFade 2.133s steps(1) infinite"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r,
					fill: color,
					style: {
						transformOrigin: "12px 12px",
						animation: "circleGrow 2.133s ease-out infinite"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M7.5 12.5 L10.5 15.5 L16.5 9",
					fill: "none",
					stroke: bg,
					strokeWidth: "1.6",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					pathLength: 1,
					strokeDasharray: "1",
					style: { animation: "checkDraw 2.133s ease-out infinite" }
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* ring fully opaque 0–58%, gone 60–100% */
        @keyframes ringFade {
          0%   { opacity: 1; }
          58%  { opacity: 1; }
          60%  { opacity: 0; }
          100% { opacity: 0; }
        }
        /* circle hidden, snaps to full scale right after ring fades */
        @keyframes circleGrow {
          0%   { opacity: 0; transform: scale(0); }
          58%  { opacity: 0; transform: scale(0); }
          62%  { opacity: 1; transform: scale(0.15); }
          68%  { opacity: 1; transform: scale(1); }
          100% { opacity: 1; transform: scale(1); }
        }
        /* checkmark draws in just after circle appears, then holds */
        @keyframes checkDraw {
          0%   { stroke-dashoffset: 1; opacity: 0; }
          64%  { stroke-dashoffset: 1; opacity: 0; }
          68%  { opacity: 1; }
          80%  { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
      ` })]
	});
}
//#endregion
export { SpinnerToCheck as t };
