export function sceneCursorKind(label){
  const value=String(label).toLowerCase();
  if(['move','drag','shift','↔'].includes(value))return 'move';
  return ({'▶':'play','ⅱ':'pause',trim:'trim',pin:'pin',unpin:'unpin','+':'plus'})[value]||'arrow';
}
export function createSceneCursorController(element,hitTest,onActiveChange=()=>{}){
  let x=0,y=0,hasPointer=false;
  const scene=target=>{
    const node=target?.closest?.('[data-cursor]');
    element.dataset.active=String(!!node);
    onActiveChange(!!node);
    if(node)element.dataset.kind=sceneCursorKind(node.dataset.cursor);
  };
  return {
    move(event){
      if(event.pointerType==='touch'){this.hide();return;}
      x=event.clientX;y=event.clientY;hasPointer=true;
      element.style.left=x+'px';element.style.top=y+'px';scene(event.target);
    },
    refresh(){if(hasPointer)scene(hitTest(x,y));},
    hide(){hasPointer=false;element.dataset.active='false';onActiveChange(false);}
  };
}
