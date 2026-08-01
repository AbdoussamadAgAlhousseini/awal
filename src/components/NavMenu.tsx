"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type NavLink = { href: string; label: string };

/**
 * Navigation principale responsive (§24, §26).
 *
 * Sur desktop, les liens s'affichent en ligne. En dessous du point de rupture, ils
 * se replient derrière un bouton « menu » qui ouvre un tiroir. Le composant est
 * client uniquement pour cet état d'ouverture ; les liens eux-mêmes sont calculés
 * côté serveur et passés en props.
 */
export default function NavMenu({ links, menuLabel }: { links: NavLink[]; menuLabel: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="navwrap" ref={ref}>
      <button
        type="button"
        className="nav-burger"
        aria-expanded={open}
        aria-controls="mainnav"
        aria-label={menuLabel}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>

      <nav id="mainnav" className={`mainnav ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
