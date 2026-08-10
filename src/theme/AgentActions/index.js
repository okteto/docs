import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import MarkdownIcon from '../../icons/agent/MarkdownIcon';
import ClaudeIcon from '../../icons/agent/ClaudeIcon';
import OpenAIIcon from '../../icons/agent/OpenAIIcon';
import CopilotIcon from '../../icons/agent/CopilotIcon';

import './styles.scss';

const COPY_RESET_MS = 2000;

function capture(action, docPath) {
  if (
    typeof window !== 'undefined' &&
    window.posthog &&
    typeof window.posthog.capture === 'function'
  ) {
    window.posthog.capture('docs_agent_action', { action, doc_path: docPath });
  }
}

const AgentActions = () => {
  const { pathname } = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState('idle'); // 'idle' | 'copied' | 'error'
  const rootRef = useRef(null);
  const toggleRef = useRef(null);

  // Markdown twins live at the page path with `.md` appended; the docs root
  // (`/docs/`) is the one exception, served as `index.md`.
  const cleanPath = pathname.replace(/\/+$/, '');
  const basePath = siteConfig.baseUrl.replace(/\/+$/, '');
  const mdPath = cleanPath === basePath ? `${basePath}/index.md` : `${cleanPath}.md`;
  const mdUrl = `${siteConfig.url}${mdPath}`;
  const prompt = encodeURIComponent(`Read ${mdUrl} so I can ask questions about it.`);

  const menuItems = [
    { label: 'View as Markdown', href: mdPath, action: 'view_markdown', Icon: MarkdownIcon },
    { label: 'Open in Claude', href: `https://claude.ai/new?q=${prompt}`, action: 'open_claude', Icon: ClaudeIcon },
    { label: 'Open in ChatGPT', href: `https://chatgpt.com/?hints=search&q=${prompt}`, action: 'open_chatgpt', Icon: OpenAIIcon },
    { label: 'Open in GitHub Copilot', href: `https://github.com/copilot?prompt=${prompt}`, action: 'open_copilot', Icon: CopilotIcon },
  ];

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onMouseDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        if (toggleRef.current) {
          toggleRef.current.focus();
        }
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleCopy = async () => {
    try {
      const res = await fetch(mdPath);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
      capture('copy', pathname);
    } catch {
      // Twins only exist in built output, so this fires in `yarn start` dev
      // mode (or offline). Show the error state briefly; nothing to log.
      setCopyState('error');
    }
    setTimeout(() => setCopyState('idle'), COPY_RESET_MS);
  };

  const copyLabel =
    copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy page';

  return (
    <div className="AgentActions" ref={rootRef}>
      <button type="button" className="AgentActions__copy" onClick={handleCopy}>
        <MarkdownIcon />
        {copyLabel}
      </button>
      <button
        type="button"
        className="AgentActions__toggle"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More ways to open this page"
        ref={toggleRef}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul className="AgentActions__menu" role="menu">
          {menuItems.map(({ label, href, action, Icon }) => (
            <li key={action} role="none">
              <a
                role="menuitem"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  capture(action, pathname);
                  setOpen(false);
                }}
              >
                <Icon />
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AgentActions;
