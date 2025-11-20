import { createContext, useContext, useState, useRef, useEffect } from "react";

const DropdownMenuContext = createContext();

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, children }) {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  if (asChild) {
    // Clone the child and add onClick handler
    const child = children;
    return (
      <div onClick={handleClick} className="inline-block">
        {child}
      </div>
    );
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
}

export function DropdownMenuContent({ align = "start", children }) {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const alignmentClasses = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <div
      ref={menuRef}
      className={`absolute ${alignmentClasses[align]} mt-2 w-48 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-lg z-50 py-1 animate-in fade-in-0 zoom-in-95`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ onClick, children }) {
  const { setIsOpen } = useContext(DropdownMenuContext);

  const handleClick = () => {
    onClick?.();
    setIsOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
    >
      {children}
    </button>
  );
}
