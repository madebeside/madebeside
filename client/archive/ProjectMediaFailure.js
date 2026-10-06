import {createElement as h} from 'react';

export default function ProjectMediaFailure({project,onRetry}){
  return h('div',{className:'project-media-failure',role:'status'},
    h('p',null,'This film couldn’t load.'),
    h('div',null,
      h('button',{type:'button',onClick:onRetry},'Try again'),
      h('a',{href:project.src,target:'_blank',rel:'noreferrer','aria-label':'Open film — '+project.title},'Open film ↗')
    )
  );
}
