"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Plus, Printer, XCircle } from "lucide-react";
import { appModules, type AppModule } from "@/lib/module-menus";
import { cn } from "@/lib/utils";

function ModuleDropdown({
  module,
  isOpen,
  onClose,
  anchorRef,
}: {
  module: AppModule;
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        anchorRef.current?.contains(target)
      ) {
        return;
      }
      onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen || module.items.length === 0) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 top-full z-50 mt-1 w-max min-w-[280px] max-w-[min(100vw-2rem,400px)] overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xl"
    >
      <ul className="max-h-[70vh] overflow-y-auto py-1">
        {module.items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.id}>
              {item.dividerBefore && <div className="my-1 border-t border-slate-200" />}
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-sm transition",
                  isActive
                    ? "bg-municipal-50 font-medium text-municipal-800"
                    : "text-slate-800 hover:bg-slate-50",
                  item.variant === "primary" && !isActive && "font-medium text-emerald-700",
                  item.variant === "danger" && !isActive && "text-red-700",
                )}
              >
                {item.variant === "primary" && (
                  <Plus className="h-4 w-4 shrink-0 text-emerald-600" />
                )}
                {item.variant === "danger" && (
                  <XCircle className="h-4 w-4 shrink-0 text-red-600" />
                )}
                {item.label.includes("Makbuz") && item.variant !== "primary" && item.variant !== "danger" && (
                  <Printer className="h-4 w-4 shrink-0 text-slate-400" />
                )}
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="shrink-0 text-xs text-slate-400">{item.shortcut}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ModuleButton({
  module,
  isActive,
  isOpen,
  onToggle,
  onClose,
}: {
  module: AppModule;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (module.action === "logout") {
    return (
      <button
        type="button"
        className="flex items-center gap-1 whitespace-nowrap px-2 py-2 text-xs font-bold uppercase tracking-wide text-red-700 transition hover:bg-red-50 sm:px-3 sm:text-sm"
        aria-label="Çıkış"
      >
        <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        {module.label}
      </button>
    );
  }

  const hasMenu = module.items.length > 0;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        className={cn(
          "flex items-center gap-1 whitespace-nowrap px-2 py-2 text-xs font-bold uppercase tracking-wide transition sm:px-3 sm:text-sm",
          isActive || isOpen
            ? "bg-municipal-600 text-white"
            : "text-slate-800 hover:bg-slate-100",
        )}
        aria-expanded={hasMenu ? isOpen : undefined}
        aria-haspopup={hasMenu ? "menu" : undefined}
      >
        {module.label}
        {hasMenu && (
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition", isOpen && "rotate-180")}
          />
        )}
      </button>
      {hasMenu && (
        <ModuleDropdown
          module={module}
          isOpen={isOpen}
          onClose={onClose}
          anchorRef={buttonRef}
        />
      )}
    </div>
  );
}

export function ModuleNavBar() {
  const pathname = usePathname();
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);

  const handleToggle = useCallback((moduleId: string) => {
    setOpenModuleId((prev) => (prev === moduleId ? null : moduleId));
  }, []);

  const handleClose = useCallback(() => {
    setOpenModuleId(null);
  }, []);

  useEffect(() => {
    setOpenModuleId(null);
  }, [pathname]);

  const row1 = appModules.slice(0, 9);
  const row2 = appModules.slice(9);

  function renderModule(mod: AppModule) {
    const isActive =
      !mod.action &&
      (pathname === mod.href || pathname.startsWith(`${mod.href}/`));
    const isOpen = openModuleId === mod.id;

    return (
      <ModuleButton
        key={mod.id}
        module={mod}
        isActive={isActive}
        isOpen={isOpen}
        onToggle={() => handleToggle(mod.id)}
        onClose={handleClose}
      />
    );
  }

  return (
    <nav className="border-b border-slate-300 bg-slate-100">
      <div className="flex flex-wrap items-center divide-x divide-slate-300">
        {row1.map(renderModule)}
      </div>
      <div className="flex flex-wrap items-center divide-x divide-slate-300 border-t border-slate-300">
        {row2.map(renderModule)}
      </div>
    </nav>
  );
}
