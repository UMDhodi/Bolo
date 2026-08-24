import{n as e,t}from"./jsx-runtime-Cltr0gcK.js";e();var n=t();function r({size:e=60,color:t=`#000`,bg:r=`#fff`}){let i=2*Math.PI*9;return(0,n.jsxs)(`div`,{style:{width:e,height:e,position:`relative`},children:[(0,n.jsxs)(`svg`,{viewBox:`0 0 24 24`,style:{width:`100%`,height:`100%`,overflow:`visible`},children:[(0,n.jsx)(`circle`,{cx:`12`,cy:`12`,r:9,fill:`none`,stroke:t,strokeWidth:`1.4`,strokeLinecap:`round`,strokeDasharray:`${i*.78} ${i*.22}`,style:{transformOrigin:`12px 12px`,animation:`spin 0.9s linear infinite, ringFade 2.133s steps(1) infinite`}}),(0,n.jsx)(`circle`,{cx:`12`,cy:`12`,r:9,fill:t,style:{transformOrigin:`12px 12px`,animation:`circleGrow 2.133s ease-out infinite`}}),(0,n.jsx)(`path`,{d:`M7.5 12.5 L10.5 15.5 L16.5 9`,fill:`none`,stroke:r,strokeWidth:`1.6`,strokeLinecap:`round`,strokeLinejoin:`round`,pathLength:1,strokeDasharray:`1`,style:{animation:`checkDraw 2.133s ease-out infinite`}})]}),(0,n.jsx)(`style`,{children:`
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
      `})]})}export{r as t};