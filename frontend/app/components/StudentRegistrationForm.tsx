"use client";

import { FormEvent, useState } from "react";

export default function StudentRegistrationForm() {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setMessageType("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          rollNumber: rollNumber.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed.");
      }

      setMessage(result.message || "Student registered successfully.");
      setMessageType("success");
      setName("");
      setRollNumber("");

      window.dispatchEvent(new Event("students-updated"));
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
    <section className="panel registration-panel" id="registration">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">STUDENT MANAGEMENT</span>
          <h2>Register a student</h2>
        </div>
        <span className="date-chip">New registration</span>
      </div>

      <p className="registration-description">
        Add a student to the mess management system using their name and roll number.
      </p>

      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="student-name">Student name</label>
          <input
            id="student-name"
            type="text"
            placeholder="Enter student name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="student-roll-number">Roll number</label>
          <input
            id="student-roll-number"
            type="text"
            placeholder="Enter roll number"
            value={rollNumber}
            onChange={(event) => setRollNumber(event.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="registration-button"
          disabled={submitting}
        >
          {submitting ? "Registering..." : "Register student"}
        </button>
      </form>

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
