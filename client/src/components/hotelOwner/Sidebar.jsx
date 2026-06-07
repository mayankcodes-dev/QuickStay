import { NavLink } from 'react-router-dom';

// ── OYO-style logo (compact) ─────────────────────────────────
const YoYoLogo = () => (
  <div className="inline-flex items-center justify-center select-none"
    style={{ background: "#E8003D", borderRadius: "7px", padding: "4px 10px" }}>
    <span style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 900, fontSize: "18px",
      color: "#FFFFFF", letterSpacing: "-0.04em", lineHeight: 1,
    }}>YoYo</span>
  </div>
);

const DashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const AddIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const links = [
  { name: 'Dashboard',   path: '/owner',            Icon: DashIcon  },
  { name: 'Add Room',    path: '/owner/add-room',   Icon: AddIcon   },
  { name: 'List Room',   path: '/owner/list-room',  Icon: ListIcon  },
  { name: 'Edit Hotel',  path: '/owner/edit-hotel', Icon: EditIcon  },
];

const Sidebar = () => (
  <div
    className="flex flex-col w-16 md:w-60 h-full border-r transition-all duration-300 pt-2"
    style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}
  >
    {/* Logo — desktop only */}
    <div className="hidden md:flex px-5 py-4 mb-2">
      <YoYoLogo />
    </div>

    <nav className="flex flex-col gap-1 px-2">
      {links.map(({ name, path, Icon }) => (
        <NavLink
          key={name}
          to={path}
          end={path === '/owner'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive
                ? 'text-white'
                : 'hover:bg-[var(--color-surface-3)]'
            }`
          }
          style={({ isActive }) => isActive
            ? { background: "#E8003D", color: "white", boxShadow: "0 4px 14px rgba(232,0,61,0.35)" }
            : { color: "var(--color-text-secondary)" }
          }
        >
          <Icon />
          <span className="hidden md:block">{name}</span>
        </NavLink>
      ))}
    </nav>
  </div>
);

export default Sidebar;
