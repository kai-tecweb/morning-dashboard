// ===== アイコン =====
const Icon = ({ name, size = 16, className = "" }) => {
  const s = size;
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "sun": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="4" {...stroke}/>
        <path {...stroke} d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"/>
      </svg>
    );
    case "spark": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4L12 3zM19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z"/>
      </svg>
    );
    case "package": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7M3 7l9 4 9-4M12 11v10"/>
      </svg>
    );
    case "factory": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M3 21V11l5 3V11l5 3V8l8-5v18z"/>
      </svg>
    );
    case "cart": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M3 4h2l2.5 12h11L21 8H7M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z"/>
      </svg>
    );
    case "truck": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M3 7h11v10H3zM14 11h4l3 3v3h-7M7 20a2 2 0 100-4 2 2 0 000 4zM17 20a2 2 0 100-4 2 2 0 000 4z"/>
      </svg>
    );
    case "check-circle": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="9" {...stroke}/>
        <path {...stroke} d="M8.5 12.5l2.5 2.5 4.5-5"/>
      </svg>
    );
    case "check": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} stroke="#fff" strokeWidth="2.2" d="M5 12.5l4 4 10-10"/>
      </svg>
    );
    case "message": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M4 5h16v11H8l-4 4z"/>
      </svg>
    );
    case "list": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>
      </svg>
    );
    case "arrow-right": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
    );
    case "arrow-left": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M19 12H5M11 6l-6 6 6 6"/>
      </svg>
    );
    case "x": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M6 6l12 12M18 6L6 18"/>
      </svg>
    );
    case "phone": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/>
      </svg>
    );
    case "clock": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="9" {...stroke}/>
        <path {...stroke} d="M12 7v5l3 2"/>
      </svg>
    );
    case "alert": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M12 3l10 17H2L12 3zM12 10v4M12 17h.01"/>
      </svg>
    );
    case "help": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <circle cx="12" cy="12" r="9" {...stroke}/>
        <path {...stroke} d="M9.5 9a2.5 2.5 0 015 .5c0 1.5-2.5 2-2.5 3.5M12 17h.01"/>
      </svg>
    );
    case "plus": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M12 5v14M5 12h14"/>
      </svg>
    );
    case "search": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <circle cx="11" cy="11" r="7" {...stroke}/>
        <path {...stroke} d="M20 20l-3.5-3.5"/>
      </svg>
    );
    case "bell": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M6 18V11a6 6 0 1112 0v7M4 18h16M10 21h4"/>
      </svg>
    );
    case "note": return (
      <svg width={s} height={s} viewBox="0 0 24 24" className={className}>
        <path {...stroke} d="M5 4h11l4 4v12H5zM16 4v4h4M9 13h6M9 17h4"/>
      </svg>
    );
    default: return null;
  }
};

window.Icon = Icon;
