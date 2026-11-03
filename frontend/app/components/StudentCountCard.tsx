"use client";

import { useEffect, useState } from "react";

export default function StudentCountCard() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchStudentCount() {
      try {
        const response = await fetch("/api/students");

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const result = await response.json();

        if (!result.success || typeof result.count !== "number") {
          throw new Error("Invalid student count response");
        }

        if (active) {
          setCount(result.count);
        }
      } catch {
        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchStudentCount();

    return () => {
      active = false;
    };
  }, []);

  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>Registered students</span>
        <span className="stat-icon">👥</span>
      </div>

      <strong className="stat-value">
        {loading ? "..." : error ? "—" : count}
      </strong>

      <small>
        {loading
          ? "Loading student data"
          : error
            ? "Unable to load student count"
            : "Live database count"}
      </small>
    </article>
  );
}
