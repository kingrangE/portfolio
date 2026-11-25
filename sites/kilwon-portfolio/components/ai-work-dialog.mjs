'use client';

import { createElement, Fragment, useRef } from 'react';

export default function AiWorkDialog({ children }) {
  const dialog = useRef(null);

  return createElement(Fragment, null,
    createElement('button', {
      type: 'button',
      className: 'button ai-work-trigger',
      'aria-haspopup': 'dialog',
      onClick: () => dialog.current.showModal(),
    }, 'AI로 이렇게 일하고 있습니다.'),
    createElement('dialog', {
      ref: dialog,
      className: 'ai-work-dialog',
      'aria-labelledby': 'ai-work-title',
      onClick: event => {
        if (event.target === event.currentTarget) dialog.current.close();
      },
    },
      createElement('div', { className: 'ai-work-panel' },
        createElement('header', { className: 'ai-work-heading' },
          createElement('h2', { id: 'ai-work-title' }, 'AI로 이렇게 일하고 있습니다.'),
          createElement('form', { method: 'dialog' },
            createElement('button', { className: 'ai-work-close', type: 'submit', autoFocus: true }, '닫기'),
          ),
        ),
        children,
      ),
    ),
  );
}
