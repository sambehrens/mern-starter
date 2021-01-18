import * as React from 'react';
import FocusLock from 'react-focus-lock';

interface ModalProps {
  onCancel: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ children, className, onCancel }: ModalProps) {
  function handleCancelClick(event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
    event.stopPropagation();
    onCancel();
  }

  return (
    <FocusLock>
      <div className={className} onClick={handleCancelClick}>
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      </div>
    </FocusLock>
  );
}
