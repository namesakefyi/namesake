import { useRef, useState } from "react";
import { Button } from "@/components/react/common/Button";
import {
  NativeOption,
  NativeSelect,
} from "@/components/react/common/NativeSelect";
import { ALL } from "@/constants/all";
import { JURISDICTIONS } from "@/constants/jurisdictions";
import { SERVICES } from "@/constants/services";
import type { DIRECTORY_CONTACTS_LIST_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "./DirectoryList.module.css";
import { DirectoryListItem } from "./DirectoryListItem";

type DirectoryFilters = { stateSlug: string; service: string };

function directoryUrl(href: string, filters: DirectoryFilters): URL {
  const url = new URL(href, window.location.origin);
  const query = url.searchParams;
  if (filters.stateSlug) query.set("state", filters.stateSlug);
  else query.delete("state");
  if (filters.service) query.set("service", filters.service);
  else query.delete("service");
  return url;
}

function replaceDirectoryUrl(filters: DirectoryFilters): void {
  const url = directoryUrl(window.location.href, filters);
  history.replaceState(null, "", url.pathname + url.search);
}

export function parseDirectorySearchParams(
  input: string | URLSearchParams,
): DirectoryFilters {
  const query = typeof input === "string" ? new URLSearchParams(input) : input;
  const state = query.get("state") ?? "";
  const svc = query.get("service") ?? "";
  return {
    stateSlug: /^[a-z]{2}$/.test(state) ? state : "",
    service: SERVICES.some((s) => s.value === svc) ? svc : "",
  };
}

async function fetchDirectoryContactList(
  filters: DirectoryFilters,
): Promise<DIRECTORY_CONTACTS_LIST_QUERY_RESULT> {
  const res = await fetch(directoryUrl("/api/directory", filters));
  if (!res.ok) throw new Error("Failed to load directory");
  const { contacts } = (await res.json()) as {
    contacts: DIRECTORY_CONTACTS_LIST_QUERY_RESULT;
  };
  return contacts;
}

interface DirectoryListProps {
  initialContacts: DIRECTORY_CONTACTS_LIST_QUERY_RESULT;
  initialUrlSearch: string;
}

export function DirectoryList({
  initialContacts,
  initialUrlSearch,
}: DirectoryListProps) {
  const [filters, setFilters] = useState<DirectoryFilters>(() =>
    parseDirectorySearchParams(initialUrlSearch),
  );
  const { stateSlug, service } = filters;
  const [contacts, setContacts] = useState(initialContacts);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const mainRef = useRef<HTMLElement>(null);

  function applyFilters(next: DirectoryFilters) {
    setFilters(next);
    replaceDirectoryUrl(next);
    const el = mainRef.current;
    if (el && el.getBoundingClientRect().top <= 0) {
      el.scrollIntoView({ behavior: "instant", block: "start" });
    }
    setStatus("loading");
    fetchDirectoryContactList(next)
      .then(setContacts)
      .then(() => setStatus("idle"))
      .catch(() => setStatus("error"));
  }

  const hasActiveFilters = Boolean(stateSlug || service);
  const emptyMessage =
    hasActiveFilters && !contacts.length
      ? "No organizations match these filters."
      : "No entries yet.";

  return (
    <>
      <section
        className={styles.directoryFilters}
        aria-label="Directory filters"
      >
        <div className={styles.controls}>
          <NativeSelect
            aria-label="State"
            value={stateSlug || ALL}
            onChange={({ target: { value } }) =>
              applyFilters({ stateSlug: value === ALL ? "" : value, service })
            }
          >
            <NativeOption value={ALL}>All states</NativeOption>
            <hr />
            {Object.entries(JURISDICTIONS).map(([abbreviation, name]) => (
              <NativeOption
                key={abbreviation}
                value={abbreviation.toLowerCase()}
              >
                {name}
              </NativeOption>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Service"
            value={service || ALL}
            onChange={({ target: { value } }) =>
              applyFilters({ stateSlug, service: value === ALL ? "" : value })
            }
          >
            <NativeOption value={ALL}>All services</NativeOption>
            <hr />
            {SERVICES.map((svc) => (
              <NativeOption key={svc.value} value={svc.value}>
                {svc.title}
              </NativeOption>
            ))}
          </NativeSelect>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="secondary"
              onPress={() => applyFilters({ stateSlug: "", service: "" })}
            >
              Reset
            </Button>
          )}
        </div>
        <div className={styles.metadata}>
          <span
            className={styles.count}
          >{`${contacts.length} ${contacts.length === 1 ? "entry" : "entries"}`}</span>
        </div>
      </section>
      <section
        ref={mainRef}
        className={styles.directoryContent}
        aria-label="Directory results"
        aria-busy={status === "loading"}
      >
        {status === "error" ? (
          <p role="alert">
            Something went wrong loading the directory. Please refresh the page.
          </p>
        ) : contacts.length ? (
          <ul className={styles.directoryListItems}>
            {contacts.map((c) => (
              <DirectoryListItem key={c.slug} {...c} />
            ))}
          </ul>
        ) : (
          <p>{emptyMessage}</p>
        )}
      </section>
    </>
  );
}
