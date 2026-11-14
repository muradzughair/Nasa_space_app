/**
 * Local storage for the verification workflow, in IndexedDB. There is no
 * backend: these records exist in this browser profile only. Requests,
 * contributor responses and reviews are separate stores; attachment files
 * (videos, photographs) are Blobs in a fourth.
 */
import { useEffect, useState } from "react";
import type { ContributorResponse, Review, VerificationRequest } from "./types";

const NAME = "analog-atlas-verification";
const STORES = ["requests", "responses", "reviews", "blobs"] as const;
type StoreName = (typeof STORES)[number];

export interface StoredBlob {
  id: string;
  name: string;
  type: string;
  blob: Blob;
}

let opening: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  opening ??= new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("This browser has no IndexedDB, so nothing can be stored."));
    const request = indexedDB.open(NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore("requests", { keyPath: "id" });
      db.createObjectStore("responses", { keyPath: "id" });
      db.createObjectStore("reviews", { keyPath: "responseId" });
      db.createObjectStore("blobs", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("The local database could not be opened."));
  });
  opening.catch(() => (opening = null));
  return opening;
}

async function run<T>(stores: StoreName[], mode: IDBTransactionMode, work: (tx: IDBTransaction) => IDBRequest<T> | null): Promise<T | undefined> {
  const db = await open();
  return new Promise<T | undefined>((resolve, reject) => {
    const tx = db.transaction(stores, mode);
    const request = work(tx);
    tx.oncomplete = () => resolve(request?.result);
    tx.onerror = () => reject(tx.error ?? new Error("The local database rejected the change."));
    tx.onabort = () => reject(tx.error ?? new Error("The local database is full or unavailable; the change was not saved."));
  });
}

const listeners = new Set<() => void>();
const changed = () => listeners.forEach((l) => l());

export interface VerifyData {
  requests: VerificationRequest[];
  responses: ContributorResponse[];
  reviews: Review[];
}

export async function loadAll(): Promise<VerifyData> {
  const all = <T>(store: StoreName) => run<T[]>([store], "readonly", (tx) => tx.objectStore(store).getAll() as IDBRequest<T[]>);
  const [requests, responses, reviews] = await Promise.all([all<VerificationRequest>("requests"), all<ContributorResponse>("responses"), all<Review>("reviews")]);
  const newest = <T>(list: T[] | undefined, key: (x: T) => string) => (list ?? []).sort((a, b) => key(b).localeCompare(key(a)));
  return {
    requests: newest(requests, (r) => r.createdAt),
    responses: newest(responses, (r) => r.submittedAt),
    reviews: reviews ?? [],
  };
}

/** Saves records and their files in one transaction: either all of it is stored or none. */
export async function save(records: Partial<VerifyData>, blobs: StoredBlob[] = []): Promise<void> {
  await run([...STORES], "readwrite", (tx) => {
    for (const r of records.requests ?? []) tx.objectStore("requests").put(r);
    for (const r of records.responses ?? []) tx.objectStore("responses").put(r);
    for (const r of records.reviews ?? []) tx.objectStore("reviews").put(r);
    for (const b of blobs) tx.objectStore("blobs").put(b);
    return null;
  });
  changed();
}

export async function getBlob(id: string): Promise<StoredBlob | null> {
  return (await run<StoredBlob>(["blobs"], "readonly", (tx) => tx.objectStore("blobs").get(id) as IDBRequest<StoredBlob>)) ?? null;
}

/** Deletes a request with its responses, their reviews and every attached file. */
export async function deleteRequest(id: string): Promise<void> {
  const data = await loadAll();
  const request = data.requests.find((r) => r.id === id);
  const responses = data.responses.filter((r) => r.requestId === id);
  await run([...STORES], "readwrite", (tx) => {
    tx.objectStore("requests").delete(id);
    if (request?.video.attachmentId) tx.objectStore("blobs").delete(request.video.attachmentId);
    for (const r of responses) {
      tx.objectStore("responses").delete(r.id);
      tx.objectStore("reviews").delete(r.id);
      for (const e of r.evidence) if (e.attachmentId) tx.objectStore("blobs").delete(e.attachmentId);
    }
    return null;
  });
  changed();
}

/** Everything in the local database, kept current. `error` is set when the browser cannot store anything. */
export function useVerifyData(): VerifyData & { loaded: boolean; error: string | null } {
  const [state, setState] = useState<VerifyData & { loaded: boolean; error: string | null }>({ requests: [], responses: [], reviews: [], loaded: false, error: null });
  useEffect(() => {
    let live = true;
    const load = () =>
      loadAll().then(
        (data) => live && setState({ ...data, loaded: true, error: null }),
        (e: unknown) => live && setState((s) => ({ ...s, loaded: true, error: e instanceof Error ? e.message : "The local database is unavailable." })),
      );
    void load();
    listeners.add(load);
    return () => {
      live = false;
      listeners.delete(load);
    };
  }, []);
  return state;
}

/** An object URL for a stored file, revoked when no longer shown. Null while loading; `missing` when the file is not in this browser. */
export function useBlobUrl(id: string | undefined): { url: string | null; missing: boolean } {
  const [state, setState] = useState<{ url: string | null; missing: boolean }>({ url: null, missing: false });
  useEffect(() => {
    if (!id) return setState({ url: null, missing: false });
    let live = true;
    let url: string | null = null;
    getBlob(id).then(
      (stored) => {
        if (!live) return;
        url = stored ? URL.createObjectURL(stored.blob) : null;
        setState({ url, missing: !stored });
      },
      () => live && setState({ url: null, missing: true }),
    );
    return () => {
      live = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [id]);
  return state;
}
