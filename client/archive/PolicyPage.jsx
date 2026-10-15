import React from 'react';
import policies from './policy-content.json';
import './policy-page.css';
export {policies};
export default function PolicyPage({route}){return <article className="editorial-policy" dangerouslySetInnerHTML={{__html:policies[route]}}/>;}
