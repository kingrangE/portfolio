import { createElement } from 'react';

export default function InlineEmphasis({ children }) {
  const parts = children.split(/(\*\*[^*\n]+\*\*)/g);
  if (parts.length === 1) return children;
  return createElement('span', { 'data-inline-text': children },
    parts.map((part, index) => index % 2
      ? createElement('strong', { key: index }, part.slice(2, -2))
      : part));
}
