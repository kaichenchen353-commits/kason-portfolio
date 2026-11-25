import { useRef } from 'react';

export default function Draggable({ as: Tag = 'div', x = 0, y = 0, onDrop, onClick, onDragStateChange, children, className = '', style, ...props }) {
  const gesture = useRef(null);
  return <Tag {...props} className={`draggable ${className}`} style={{ ...style, '--drag-x': `${x}px`, '--drag-y': `${y}px` }}
    onPointerDown={event => {
      if (event.button !== 0 || (Tag !== 'button' && event.target.closest('a,button,input,textarea'))) return;
      gesture.current = { clientX: event.clientX, clientY: event.clientY, x, y, moved: false };
      onDragStateChange?.(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => {
      const g = gesture.current;
      if (!g || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
      const dx = event.clientX - g.clientX, dy = event.clientY - g.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 5) g.moved = true;
      if (g.moved) {
        event.preventDefault();
        g.nextX = Math.max(-200, Math.min(200, g.x + dx));
        g.nextY = Math.max(-160, Math.min(160, g.y + dy));
        event.currentTarget.style.setProperty('--drag-x', `${g.nextX}px`);
        event.currentTarget.style.setProperty('--drag-y', `${g.nextY}px`);
      }
    }}
    onPointerUp={event => {
      onDragStateChange?.(false);
      const g = gesture.current;
      if (!g) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      if (g.moved) onDrop?.(g.nextX, g.nextY);
    }}
    onLostPointerCapture={() => onDragStateChange?.(false)}
    onPointerCancel={event => { onDragStateChange?.(false); gesture.current = null; event.currentTarget.style.setProperty('--drag-x', `${x}px`); event.currentTarget.style.setProperty('--drag-y', `${y}px`); }}
    onClick={event => { if (!gesture.current?.moved) onClick?.(event); gesture.current = null; }}>
    {children}
  </Tag>;
}

