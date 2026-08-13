"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "今日", icon: "home" as const },
  { href: "/history", label: "履歴", icon: "history" as const },
];

function Icon({ name, active }: { name: "home" | "history"; active: boolean }) {
  const stroke = active ? "stroke-accent" : "stroke-slate-400";
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" className={`h-6 w-6 fill-none ${stroke} stroke-[1.8]`}>
        <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 fill-none ${stroke} stroke-[1.8]`}>
      <path d="M12 7v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 3h6" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname?.startsWith("/record")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-md items-stretch">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-1 py-3"
              aria-current={active ? "page" : undefined}
            >
              <Icon name={tab.icon} active={!!active} />
              <span
                className={`text-xs font-medium ${
                  active ? "text-accent" : "text-slate-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
