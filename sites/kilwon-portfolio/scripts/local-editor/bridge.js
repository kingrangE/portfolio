(() => {
  if (window.parent === window) return;
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  let tokens = [];
  let pending = null;
  let active = null;
  let original = '';
  const style = document.createElement('style');
  style.textContent = '[data-local-edit]{outline:2px solid #2459d3;outline-offset:4px;background:#e7f0ff!important}';
  document.head.append(style);
  function send(message) { window.parent.postMessage(message, location.origin); }
  function restore() {
    if (active?.isConnected) active.textContent = original;
    document.querySelectorAll('[data-local-edit]').forEach(element => element.removeAttribute('data-local-edit'));
  }
  function textNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement.closest('script,style,button,[hidden]') && normalize(node.textContent)) nodes.push(node);
    }
    return nodes;
  }
  function accept() {
    if (!pending) return;
    restore(); active = pending; original = active.textContent;
    active.parentElement.setAttribute('data-local-edit', '');
    pending = null;
  }
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== window.parent) return;
    const message = event.data;
    if (message?.type === 'editor:catalog') {
      const slug = location.pathname.match(/^\/projects\/([^/]+)\/$/)?.[1];
      const pageFile = slug ? 'app/projects/[slug]/page.jsx' : location.pathname === '/projects/' ? 'app/projects/page.jsx' : 'app/page.jsx';
      tokens = message.files.flatMap(file => file.tokens).filter(token => token.scope ? token.scope === slug || (!slug && token.file === 'content/projects.mjs')
        : token.file === pageFile || token.file.startsWith('components/'));
      const texts = new Set(textNodes().map(node => normalize(node.textContent)));
      const fields = new Map();
      for (const token of tokens) {
        if (!texts.has(normalize(token.value))) continue;
        const key = JSON.stringify([token.file, token.scope, normalize(token.value)]);
        if (!fields.has(key)) fields.set(key, { file: token.file, value: token.value, ids: [] });
        fields.get(key).ids.push(token.id);
      }
      send({ type: 'editor:fields', fields: [...fields.values()] });
    }
    if (message?.type === 'editor:accepted') accept();
    if (message?.type === 'editor:cancel') { restore(); active = null; pending = null; }
    if (message?.type === 'editor:choose') {
      const token = tokens.find(item => item.id === message.ids?.[0]);
      if (!token) return;
      pending = textNodes().find(node => normalize(node === active ? original : node.textContent) === normalize(token.value));
      accept();
      active?.parentElement.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
    if (message?.type === 'editor:preview' && active?.isConnected) active.textContent = message.value;
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (link && event.altKey) {
      event.preventDefault(); event.stopImmediatePropagation();
      const url = new URL(link.href);
      if (url.origin === location.origin) send({ type: 'editor:navigate', path: url.pathname + url.search + url.hash });
      else window.open(url.href, '_blank', 'noopener,noreferrer');
      return;
    }
    if (event.target.closest('button,input,select,textarea,summary')) return;
    const caret = document.caretPositionFromPoint?.(event.clientX, event.clientY);
    const range = !caret && document.caretRangeFromPoint?.(event.clientX, event.clientY);
    let node = caret?.offsetNode || range?.startContainer;
    if (node?.nodeType !== Node.TEXT_NODE || !event.target.contains(node)) {
      node = [...event.target.childNodes].find(child => child.nodeType === Node.TEXT_NODE && normalize(child.textContent));
    }
    const text = node === active ? original : node?.textContent;
    const matches = text ? tokens.filter(token => normalize(token.value) === normalize(text)) : [];
    if (matches.length) {
      event.preventDefault(); event.stopImmediatePropagation();
      const first = matches[0];
      const same = matches.filter(token => token.file === first.file && token.scope === first.scope);
      pending = node;
      send({ type: 'editor:select', file: first.file, ids: same.map(token => token.id) });
    } else if (link) {
      event.preventDefault(); event.stopImmediatePropagation();
      const url = new URL(link.href);
      if (url.origin === location.origin) send({ type: 'editor:navigate', path: url.pathname + url.search + url.hash });
    }
  }, true);
  send({ type: 'editor:ready', path: location.pathname });
})();
