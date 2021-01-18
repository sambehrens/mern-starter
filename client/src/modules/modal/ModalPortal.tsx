import * as React from 'react';
import { createPortal } from 'react-dom';

const modalRoot = document.getElementById('modal-root');

export function ModalPortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, modalRoot!);
}
