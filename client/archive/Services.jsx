import React from 'react';
import {services} from '../services';

export default function Services(){
  return <div className="editorial-services">{services.map(service=><section className="editorial-service" key={service.slug}><h2>{service.name}</h2><div><p>{service.intro}</p><ul>{service.deliverables.map(([name])=><li key={name}>{name}</li>)}</ul><a className="text-link" href={'/services/'+service.slug+'/'}>Explore {service.name} ↗</a></div></section>)}</div>;
}
