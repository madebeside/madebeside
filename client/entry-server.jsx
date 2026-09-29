import React from 'react';
import {renderToString} from 'react-dom/server.edge';
import App from './App';
import {gsap} from 'gsap';
gsap.ticker.sleep();
export function renderPage(pathname,initialPieces){return renderToString(<App pathname={pathname} initialPieces={initialPieces}/>);}

