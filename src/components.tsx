/** @jsx createElement */
import { createElement, ComponentProps } from './jsx-runtime';

interface CardProps extends ComponentProps { title?: string; className?: string; onClick?: (e: MouseEvent) => void; }
const Card = ({ title, className, onClick, children }: CardProps) =>
  <div className={className} onClick={onClick as any} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '10px' }}>
    {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
    <div>{children}</div>
  </div>;

interface ModalProps extends ComponentProps { isOpen: boolean; onClose: () => void; title?: string; }
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return createElement('fragment', null);
  const closeIfOverlay = (e: any) => { if (e.target === e.currentTarget) onClose(); };
  return (
    <div onClick={closeIfOverlay} style={{ position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.4)', display: 'grid', placeItems: 'center' }}>
      <div style={{ background: 'white', padding: '16px', borderRadius: '10px', minWidth: '300px' }}>
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        <div>{children}</div>
        <div style={{ marginTop: '12px', textAlign: 'right' }}><button onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
};

interface FormProps extends ComponentProps { onSubmit: (e: Event) => void; className?: string; }
const Form = ({ onSubmit, className, children }: FormProps) => {
  const submit = (e: Event) => { e.preventDefault(); onSubmit(e); };
  return <form className={className} onSubmit={submit as any}>{children}</form>;
};

interface InputProps extends ComponentProps { type?: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string; }
const Input = ({ type = 'text', value, onChange, placeholder, className }: InputProps) =>
  <input type={type} className={className} value={value} placeholder={placeholder}
         onInput={(e: any) => onChange(e.target.value)}
         style={{ padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />;

export { Card, Modal, Form, Input };
