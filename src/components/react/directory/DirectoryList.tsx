import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/react/common/Button";
import { NativeSelect } from "@/components/react/common/NativeSelect";
import { ALL } from "@/constants/all";
import { SERVICES } from "@/constants/services";
import type { DirectoryContact } from "@/directory/directoryContact";
import { parseDirectorySearchParams } from "@/directory/parseDirectorySearchParams";
import styles from "./DirectoryList.module.css";
import { DirectoryListItem } from "./DirectoryListItem";

export interface DirectoryListProps {
  initialContacts: DirectoryContact[];
  filterStates: { name: string; slug: string }[];
  initialStateSlug: string;
  initialService: string;
}

type FilterItem = { id: string; name: string };

function DirectoryFilterSelect({
  ariaLabel,
  items,
  value,
  onSelect,
}: {
  ariaLabel: string;
  items: FilterItem[];
  value: string;
  onSelect: (next: string) => void;
}) {
  const options = useMemo(
    () =>
      items.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [items],
  );

  return (
    <NativeSelect
      aria-label={ariaLabel}
      className={styles.directoryFiltersNativeSelect}
      options={options}
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        onSelect(next === ALL ? "" : next);
      }}
    />
  );
}

async function fetchDirectoryContacts(
  stateSlug: string,
  service: string,
): Promise<DirectoryContact[]> {
  const params = new URLSearchParams();
  if (stateSlug) params.set("state", stateSlug);
  if (service) params.set("service", service);
  const q = params.toString();
  const res = await fetch(`/api/directory-contacts${q ? `?${q}` : ""}`);
  if (!res.ok) {
    throw new Error("Failed to load directory");
  }
  const data = (await res.json()) as { contacts: DirectoryContact[] };
  return data.contacts;
}

function replaceDirectoryUrl(stateSlug: string, service: string) {
  const params = new URLSearchParams();
  if (stateSlug) params.set("state", stateSlug);
  if (service) params.set("service", service);
  const q = params.toString();
  const path = q ? `/directory?${q}` : "/directory";
  window.history.replaceState(null, "", path);
}

/** Scroll to align block start only when its top is at or above the viewport top (already scrolled up). */
function scrollIntoViewBlockStartInstantIfPastTop(element: HTMLElement | null) {
  if (!element) return;
  if (element.getBoundingClientRect().top > 0) return;
  element.scrollIntoView({ behavior: "instant", block: "start" });
}

export function DirectoryList({
  initialContacts,
  filterStates,
  initialStateSlug,
  initialService,
}: DirectoryListProps) {
  const [stateSlug, setStateSlug] = useState(initialStateSlug);
  const [service, setService] = useState(initialService);
  const [contacts, setContacts] = useState(initialContacts);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const skipFetchOnMount = useRef(true);
  const mainRef = useRef<HTMLElement>(null);

  const stateItems: FilterItem[] = useMemo(
    () => [
      { id: ALL, name: "All states" },
      ...filterStates.map((s) => ({ id: s.slug, name: s.name })),
    ],
    [filterStates],
  );

  const serviceItems: FilterItem[] = useMemo(
    () => [
      { id: ALL, name: "All services" },
      ...SERVICES.map((svc) => ({ id: svc.value, name: svc.title })),
    ],
    [],
  );

  useEffect(() => {
    const onPopState = () => {
      const parsed = parseDirectorySearchParams(
        new URLSearchParams(window.location.search),
      );
      setStateSlug(parsed.selectedStateSlug);
      setService(parsed.selectedService);
      scrollIntoViewBlockStartInstantIfPastTop(mainRef.current);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (skipFetchOnMount.current) {
      skipFetchOnMount.current = false;
      return;
    }

    let cancelled = false;
    setStatus("loading");

    fetchDirectoryContacts(stateSlug, service)
      .then((next) => {
        if (!cancelled) {
          setContacts(next);
          setStatus("idle");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [stateSlug, service]);

  function applyFilters(nextState: string, nextService: string) {
    setStateSlug(nextState);
    setService(nextService);
    replaceDirectoryUrl(nextState, nextService);
    scrollIntoViewBlockStartInstantIfPastTop(mainRef.current);
  }

  function handleClearAll() {
    applyFilters("", "");
  }

  const hasActiveFilters = stateSlug.length > 0 || service.length > 0;
  const emptyMessage =
    hasActiveFilters && contacts.length === 0
      ? "No organizations match these filters."
      : "No directory entries yet.";

  return (
    <>
      <section
        className={styles.directoryFilters}
        aria-labelledby="directory-filters-heading"
      >
        <h2 id="directory-filters-heading" className="visually-hidden">
          Directory filters
        </h2>
        <DirectoryFilterSelect
          ariaLabel="State filter"
          items={stateItems}
          value={stateSlug === "" ? ALL : stateSlug}
          onSelect={(next) => applyFilters(next, service)}
        />
        <DirectoryFilterSelect
          ariaLabel="Service filter"
          items={serviceItems}
          value={service === "" ? ALL : service}
          onSelect={(next) => applyFilters(stateSlug, next)}
        />
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="secondary"
            className={styles.directoryFiltersClearAll}
            onPress={handleClearAll}
          >
            Clear filters
          </Button>
        ) : null}
      </section>
      <section
        ref={mainRef}
        className={styles.directoryMain}
        aria-label="Directory results"
        aria-busy={status === "loading"}
      >
        {status === "error" ? (
          <p className={styles.directoryListError} role="alert">
            Something went wrong loading the directory. Please refresh the page.
          </p>
        ) : contacts.length ? (
          <ul className={styles.directoryListItems}>
            {contacts.map((contact) => (
              <DirectoryListItem key={contact.slug} {...contact} />
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>{emptyMessage}</p>
        )}
      </section>
    </>
  );
}
