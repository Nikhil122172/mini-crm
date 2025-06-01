// src/components/ui/dialog.jsx
import React from 'react';

export function Dialog({ children, open, onClose }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{ backgroundColor: 'white', padding: 20 }} onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export function DialogTrigger({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

export function DialogContent({ children }) {
  return <div>{children}</div>;
}



// import * as Dialog from '@radix-ui/react-dialog';

// <Dialog.Root>
//   <Dialog.Trigger>Open</Dialog.Trigger>
//   <Dialog.Portal>
//     <Dialog.Overlay />
//     <Dialog.Content>
//       <Dialog.Title>Title</Dialog.Title>
//       <Dialog.Description>Description here.</Dialog.Description>
//       <Dialog.Close>Close</Dialog.Close>
//     </Dialog.Content>
//   </Dialog.Portal>
// </Dialog.Root>
