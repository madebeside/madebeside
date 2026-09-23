import React from 'react';
export default function MediaArtwork({variant=0}){return <div className={'work-placeholder placeholder-'+variant%3} aria-hidden="true"><span className="empty-frame">{variant%3===0?'In motion.':variant%3===1?'In focus.':'In good company.'}</span></div>;}
