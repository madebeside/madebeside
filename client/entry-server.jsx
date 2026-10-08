import React from 'react';
import {renderToString} from 'react-dom/server.edge';
import App from './App';
import ArchiveFooter from './archive/ArchiveFooter';
export function renderPage(pathname,initialPieces){return renderToString(<App pathname={pathname} initialPieces={initialPieces}/>);}


export function renderFooter(){return renderToString(<ArchiveFooter paused={true}/>);}
