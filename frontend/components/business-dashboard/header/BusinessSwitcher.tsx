"use client";

import Link from "next/link";
import { FiCheck, FiChevronDown, FiPlus } from "react-icons/fi";
import { useDropdown } from "@/hooks/useDropdown";
import type { Business } from "@/types/BusinessType";
import Avatar from "./Avatar";
import { dropdownItem, dropdownPanel, focusRing } from "./headerStyles";

// TODO: change to your real "create business" route
const CREATE_BUSINESS_HREF = "/create-business";

type BusinessSwitcherProps = {
  businesses: Business[];
  activeBusiness: Business;
};

export default function BusinessSwitcher({
  businesses,
  activeBusiness,
}: BusinessSwitcherProps) {
  const { ref, isOpen, toggle, close } = useDropdown();

  return (
    <div ref={ref} className="relative min-w-0">
      {/* Trigger: initials + name (category shows from sm up) */}
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`flex max-w-full items-center gap-2.5 rounded-xl p-1.5 pr-2.5 transition-colors hover:bg-sunken ${focusRing}`}
      >
        <Avatar name={activeBusiness.name} className="rounded-lg" />

        <span className="min-w-0 text-left">
          <span className="block max-w-36 truncate text-sm font-semibold text-foreground sm:max-w-56">
            {activeBusiness.name}
          </span>
          <span className="hidden truncate text-xs text-muted sm:block">
            {activeBusiness.category}
          </span>
        </span>

        <FiChevronDown
          className={`size-4 shrink-0 text-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Panel: never wider than the screen on small phones */}
      {isOpen && (
        <div
          role="menu"
          className={`${dropdownPanel} left-0 w-72 max-w-[calc(100vw-2rem)]`}
        >
          <p className="px-4 pt-3 pb-2 text-xs font-medium text-subtle">
            Your businesses
          </p>

          <ul className="max-h-64 overflow-y-auto px-2 pb-2">
            {businesses.map((business) => {
              const isActive = business.id === activeBusiness.id;

              return (
                <li key={business.id}>
                  <Link
                    href={`/dashboard/${business.slug}`}
                    role="menuitem"
                    onClick={close}
                    className={`${dropdownItem} ${isActive ? "bg-primary-tint" : ""}`}
                  >
                    <Avatar name={business.name} className="rounded-lg" />
                    <span className="min-w-0 grow">
                      <span className="block truncate font-medium text-foreground">
                        {business.name}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {business.category}
                      </span>
                    </span>
                    {isActive && (
                      <FiCheck className="size-4 shrink-0 text-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-border p-2">
            <Link
              href={CREATE_BUSINESS_HREF}
              role="menuitem"
              onClick={close}
              className={`${dropdownItem} font-medium text-primary`}
            >
              <FiPlus className="size-4 shrink-0" />
              Add business
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}