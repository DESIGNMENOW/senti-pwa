import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'

export function ManagementMenu() {
  const [open, setOpen] = useState(false)

  const menuRef =
    useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener(
      'keydown',
      handleEscape,
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape,
      )
    }
  }, [])

  function closeMenu() {
    setOpen(false)
  }

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() =>
          setOpen((current) => !current)
        }
        className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        Verwaltung

        <span
          aria-hidden="true"
          className={`text-xs transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl border bg-card p-1 shadow-lg"
        >
      <Link
        to="/foods"
        role="menuitem"
        onClick={closeMenu}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
      >
        <span
          aria-hidden="true"
          className="text-lg"
        >
          🥕
        </span>

        <span>
          <span className="block font-medium">
            Lebensmittel verwalten
          </span>

          <span className="block text-xs text-muted-foreground">
            Lebensmittel anzeigen und bearbeiten
          </span>
        </span>
      </Link>


          <div className="my-1 border-t" />

          <div
            role="menuitem"
            aria-disabled="true"
            className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm opacity-50"
          >
            <span
              aria-hidden="true"
              className="text-lg"
            >
              💊
            </span>

            <span>
              <span className="block font-medium">
                Medikamente
              </span>

              <span className="block text-xs text-muted-foreground">
                Demnächst
              </span>
            </span>
          </div>

          <div
            role="menuitem"
            aria-disabled="true"
            className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm opacity-50"
          >
            <span
              aria-hidden="true"
              className="text-lg"
            >
              🧴
            </span>

            <span>
              <span className="block font-medium">
                Supplements
              </span>

              <span className="block text-xs text-muted-foreground">
                Demnächst
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
