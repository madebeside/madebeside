import React from 'react';
import {services} from '../services';

export default function Services(){
  return <div className="service-accordions">{services.map((service,i)=><details className="service-accordion" key={service.slug}><summary><span>{service.name}</span><span className="service-number">({String(i+1).padStart(2,'0')})</span><span className="details-cross" aria-hidden="true">+</span></summary><div className="service-detail"><p>{service.intro}</p><ul>{service.deliverables.map(([name])=><li key={name}>{name}</li>)}</ul><a className="text-link" href={'/services/'+service.slug+'/'}>EXPLORE {service.name.toUpperCase()} ↗</a></div></details>)}</div>;
}
