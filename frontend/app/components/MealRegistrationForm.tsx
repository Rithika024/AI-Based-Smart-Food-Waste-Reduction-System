"use client";

import { FormEvent, useEffect, useState } from "react";

interface MealSession {
  id: number;
  date: string;
  mealType: string;
  status: string;
  sessionMenu: {
    id: number;
    menuItem: {
      name: string;
    };
  }[];
  _count: {
    registrations: number;
  };
}

export default function MealRegistrationForm() {
  const [meals, setMeals] = useState<MealSession[]>([]);
  const [rollNumber, setRollNumber] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadMeals() {
    try {
      const response = await fetch("/api/meals", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load meals.");
      }

      setMeals(result.data || []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load meals."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMeals();
  }, []);

  const availableMeals = meals.filter(
    (meal) => meal.status === "OPEN"
  );

  const currentMeal = availableMeals.find(
    (meal) => meal.id === Number(selectedSession)
  );

  function toggleMenuItem(id: number) {
    setSelectedMenuIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (!selectedSession || selectedMenuIds.length === 0) {
      setMessage("Please choose a meal and at least one menu item.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/meal-registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollNumber: rollNumber.trim(),
          mealSessionId: Number(selectedSession),
          selectedMenuIds,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Meal registration failed.");
      }

      setMessage(result.message || "Meal registration successful.");
      setMessageType("success");
      setRollNumber("");
      setSelectedMenuIds([]);

      await loadMeals();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel meal-registration-panel" id="meal-registration">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">STUDENT MEAL BOOKING</span>
          <h2>Register for a meal</h2>
        </div>
        <span className="date-chip">Live meal sessions</span>
      </div>

      <p className="registration-description">
        Enter your registered roll number, choose an available meal and select
        the dishes you would like.
      </p>

      {loading ? (
        <p className="meal-registration-note">Loading available meals...</p>
      ) : availableMeals.length === 0 ? (
        <p className="meal-registration-note">
          No open meal sessions are currently available.
        </p>
      ) : (
        <form className="meal-booking-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="meal-student-roll">Student roll number</label>
            <input
              id="meal-student-roll"
              type="text"
              placeholder="Enter your registered roll number"
              value={rollNumber}
              onChange={(event) => setRollNumber(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="meal-session">Choose meal session</label>
            <select
              id="meal-session"
              value={selectedSession}
              onChange={(event) => {
                setSelectedSession(event.target.value);
                setSelectedMenuIds([]);
              }}
              required
            >
              <option value="">Select a meal</option>
              {availableMeals.map((meal) => (
                <option key={meal.id} value={meal.id}>
                  {meal.mealType} — {new Date(meal.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {currentMeal && (
            <div className="meal-menu-selection">
              <div className="meal-menu-heading">
                <strong>{currentMeal.mealType} menu</strong>
                <span>
                  {currentMeal._count.registrations} registered
                </span>
              </div>

              <div className="meal-menu-options">
                {currentMeal.sessionMenu.map((item) => (
                  <label className="meal-menu-option" key={item.id}>
                    <input
                      type="checkbox"
                      checked={selectedMenuIds.includes(item.id)}
                      onChange={() => toggleMenuItem(item.id)}
                    />
                    <span>{item.menuItem.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="registration-button"
            disabled={submitting}
          >
            {submitting ? "Registering..." : "Register for meal"}
          </button>
        </form>
      )}

      {message && (
        <p
          className={`registration-message ${messageType}`}
          role={messageType === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </section>
  );
}
