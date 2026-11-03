"use client";

import { useEffect, useState } from "react";

type Meal = {
  id: number;
  mealType: string;
  date: string;
  sessionMenu: {
    id: number;
    menuItem: { name: string };
  }[];
};

export default function WasteRecordingForm() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [sessionMenuId, setSessionMenuId] = useState("");
  const [preparedKg, setPreparedKg] = useState("");
  const [servedKg, setServedKg] = useState("");
  const [discardedKg, setDiscardedKg] = useState("0");
  const [message, setMessage] = useState("");
  const [leftover, setLeftover] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadMeals() {
    try {
      const response = await fetch("/api/meals", { cache: "no-store" });
      const result = await response.json();

      if (result.success) {
        setMeals(result.data);
      }
    } catch {
      setMessage("Unable to load meal menus.");
    }
  }

  useEffect(() => {
    loadMeals();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLeftover(null);

    const prepared = Number(preparedKg);
    const served = Number(servedKg);
    const discarded = Number(discardedKg);

    if (
      !sessionMenuId ||
      preparedKg.trim() === "" ||
      servedKg.trim() === "" ||
      discardedKg.trim() === "" ||
      ![prepared, served, discarded].every(Number.isFinite) ||
      prepared < 0 ||
      served < 0 ||
      discarded < 0 ||
      served + discarded > prepared
    ) {
      setMessage(
        "Enter valid quantities. Served and discarded cannot exceed prepared."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/waste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionMenuId: Number(sessionMenuId),
          preparedKg: prepared,
          servedKg: served,
          discardedKg: discarded,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Unable to save waste record.");
        return;
      }

      setLeftover(result.data.leftoverKg);
      setMessage("Waste record saved successfully!");
      setPreparedKg("");
      setServedKg("");
      setDiscardedKg("0");
    } catch {
      setMessage("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel waste-recording-panel" id="waste-recording">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">DAILY WASTE ENTRY</span>
          <h2>Record food waste</h2>
        </div>
        <span className="date-chip">Kitchen input · kg</span>
      </div>

      <p className="chart-caption">
        Record the quantity prepared, served and discarded for each dish.
        Leftover quantity is calculated automatically.
      </p>

      <form className="waste-entry-form" onSubmit={handleSubmit}>
        <label>
          Meal and dish
          <select
            value={sessionMenuId}
            onChange={(event) => setSessionMenuId(event.target.value)}
            required
          >
            <option value="">Select a dish</option>
            {meals.map((meal) =>
              meal.sessionMenu.map((item) => (
                <option key={item.id} value={item.id}>
                  {meal.mealType} – {item.menuItem.name} (
                  {new Date(meal.date).toLocaleDateString()})
                </option>
              ))
            )}
          </select>
        </label>

        <div className="waste-input-grid">
          <label>
            Prepared (kg)
            <input
              type="number"
              min="0"
              step="0.01"
              value={preparedKg}
              onChange={(event) => setPreparedKg(event.target.value)}
              required
            />
          </label>

          <label>
            Served (kg)
            <input
              type="number"
              min="0"
              step="0.01"
              value={servedKg}
              onChange={(event) => setServedKg(event.target.value)}
              required
            />
          </label>

          <label>
            Discarded (kg)
            <input
              type="number"
              min="0"
              step="0.01"
              value={discardedKg}
              onChange={(event) => setDiscardedKg(event.target.value)}
              required
            />
          </label>
        </div>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save waste record"}
        </button>
      </form>

      {message && (
        <p role="status" className="waste-form-message">
          {message}
        </p>
      )}

      {leftover !== null && (
        <div className="recommendation-box waste-result">
          <span>Calculated leftover food</span>
          <strong>
            {leftover.toFixed(2)} <small>kg</small>
          </strong>
        </div>
      )}
    </section>
  );
}
