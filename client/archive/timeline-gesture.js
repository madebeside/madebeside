// Taking ownership also invalidates every later release/cancel of this gesture.
export function takeTimelineGesture(reference){
  const gesture=reference.current||null;
  reference.current=null;
  return gesture;
}
