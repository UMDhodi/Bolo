import{i as e,n as t,t as n}from"./jsx-runtime-Cltr0gcK.js";var r=e(t()),i=(...e)=>e.filter((e,t,n)=>!!e&&e.trim()!==``&&n.indexOf(e)===t).join(` `).trim(),a=e=>e.replace(/([a-z0-9])([A-Z])/g,`$1-$2`).toLowerCase(),o=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,n)=>n?n.toUpperCase():t.toLowerCase()),s=e=>{let t=o(e);return t.charAt(0).toUpperCase()+t.slice(1)},c={xmlns:`http://www.w3.org/2000/svg`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:2,strokeLinecap:`round`,strokeLinejoin:`round`},l=e=>{for(let t in e)if(t.startsWith(`aria-`)||t===`role`||t===`title`)return!0;return!1},u=(0,r.forwardRef)(({color:e=`currentColor`,size:t=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:o=``,children:s,iconNode:u,...d},f)=>(0,r.createElement)(`svg`,{ref:f,...c,width:t,height:t,stroke:e,strokeWidth:a?Number(n)*24/Number(t):n,className:i(`lucide`,o),...!s&&!l(d)&&{"aria-hidden":`true`},...d},[...u.map(([e,t])=>(0,r.createElement)(e,t)),...Array.isArray(s)?s:[s]])),d=(e,t)=>{let n=(0,r.forwardRef)(({className:n,...o},c)=>(0,r.createElement)(u,{ref:c,iconNode:t,className:i(`lucide-${a(s(e))}`,`lucide-${e}`,n),...o}));return n.displayName=s(e),n},f=n();function p({size:e=60,color:t=`#000`,bg:n=`#fff`}){let r=2*Math.PI*9;return(0,f.jsxs)(`div`,{style:{width:e,height:e,position:`relative`},children:[(0,f.jsxs)(`svg`,{viewBox:`0 0 24 24`,style:{width:`100%`,height:`100%`,overflow:`visible`},children:[(0,f.jsx)(`circle`,{cx:`12`,cy:`12`,r:9,fill:`none`,stroke:t,strokeWidth:`1.4`,strokeLinecap:`round`,strokeDasharray:`${r*.78} ${r*.22}`,style:{transformOrigin:`12px 12px`,animation:`spin 0.9s linear infinite, ringFade 2.133s steps(1) infinite`}}),(0,f.jsx)(`circle`,{cx:`12`,cy:`12`,r:9,fill:t,style:{transformOrigin:`12px 12px`,animation:`circleGrow 2.133s ease-out infinite`}}),(0,f.jsx)(`path`,{d:`M7.5 12.5 L10.5 15.5 L16.5 9`,fill:`none`,stroke:n,strokeWidth:`1.6`,strokeLinecap:`round`,strokeLinejoin:`round`,pathLength:1,strokeDasharray:`1`,style:{animation:`checkDraw 2.133s ease-out infinite`}})]}),(0,f.jsx)(`style`,{children:`
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
      `})]})}export{d as n,p as t};