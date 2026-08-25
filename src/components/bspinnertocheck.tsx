import React from "react";

interface BSpinnerToCheckProps {
    size?: number;
    color?: string;
    bg?: string;
}

/**
 * BSpinnerToCheck — ONE single line continuously traces a geometric "B"
 * (monoline, single continuous path — pen never lifts), then morphs into
 * a filled circle with a drawn checkmark. Loops.
 */
export default function BSpinnerToCheck({
    size = 60,
    color = "#000",
    bg = "#fff",
}: BSpinnerToCheckProps) {
    const r = 9;

    // single continuous path — up the stem, around the top bowl back to
    // the stem's midpoint, around the bottom bowl back to the base.
    const bPath =
        "M8,19 L8,5 " +
        "C12.6,5 16,6.5 16,9.3 C16,11.7 13.1,12 8,12 " +
        "C13.7,12 17.2,13.4 17.2,16.4 C17.2,18.7 13,19 8,19";

    return (
        <div style={{ width: size, height: size, position: "relative" }}>
            <svg
                viewBox="0 0 24 24"
                style={{ width: "100%", height: "100%", overflow: "visible" }}
            >
                {/* the "B" — one single traveling line traces this whole path */}
                <g style={{ animation: "bFade 2.4s steps(1) infinite" }}>
                    <path
                        d={bPath}
                        fill="none"
                        stroke={color}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength={1}
                        strokeDasharray="0.35 0.65"
                        style={{ animation: "bTrace 1.3s linear infinite" }}
                    />
                </g>

                {/* filled circle — snaps in once the B phase ends */}
                <circle
                    cx="12"
                    cy="12"
                    r={r}
                    fill={color}
                    style={{
                        transformOrigin: "12px 12px",
                        animation: "circleGrow 2.4s ease-out infinite",
                    }}
                />

                {/* checkmark — draws in right after circle fills */}
                <path
                    d="M7.5 12.5 L10.5 15.5 L16.5 9"
                    fill="none"
                    stroke={bg}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray="1"
                    style={{ animation: "checkDraw 2.4s ease-out infinite" }}
                />
            </svg>

            <style>{`
        /* a single, longer dash chases itself around the whole B path */
        @keyframes bTrace {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -1; }
        }
        @keyframes bFade {
          0%   { opacity: 1; }
          62%  { opacity: 1; }
          64%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes circleGrow {
          0%   { opacity: 0; transform: scale(0); }
          62%  { opacity: 0; transform: scale(0); }
          66%  { opacity: 1; transform: scale(0.15); }
          72%  { opacity: 1; transform: scale(1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes checkDraw {
          0%   { stroke-dashoffset: 1; opacity: 0; }
          68%  { stroke-dashoffset: 1; opacity: 0; }
          72%  { opacity: 1; }
          84%  { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>
        </div>
    );
}