"use client";

import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";

export default function Users() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useMemo(() => {
    let controller: AbortController | null = null;

    return debounce(async (search: string, page: number) => {
      controller?.abort();
      controller = new AbortController();

      setLoading(true);

      try {
        const res = await fetch(`/api/users?search=${search}&page=${page}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await res.json();
        setUsers(data.data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    fetchUsers(search, page);

    return () => {
      fetchUsers.cancel();
    };
  }, [search, page, fetchUsers]);

  return (
    <>
      <input
        disabled={loading}
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        placeholder="Search..."
      />

      {loading && <p>Loading...</p>}

      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </>
  );
}
