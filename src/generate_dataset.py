
from pathlib import Path

import numpy as np
import pandas as pd


# --------------------------------------------------
# 1. CONFIGURATION
# --------------------------------------------------

SEED = 42
DAYS = 365

OUTPUT_DIR = Path(__file__).resolve().parents[1] / "data" / "processed"
OUTPUT_FILE = OUTPUT_DIR / "mess_data.csv"

rng = np.random.default_rng(SEED)


# --------------------------------------------------
# 2. MESS MENU
# --------------------------------------------------

MENU = {
    "Breakfast": [
        ("Idli", "South Indian", 12),
        ("Dosa", "South Indian", 18),
        ("Upma", "South Indian", 10),
        ("Poha", "North Indian", 11),
        ("Bread Omelette", "Continental", 20),
    ],
    "Lunch": [
        ("Rice", "Staple", 10),
        ("Dal", "Main Course", 14),
        ("Vegetable Curry", "Main Course", 18),
        ("Chapati", "Bread", 5),
        ("Curd", "Side Dish", 8),
    ],
    "Dinner": [
        ("Rice", "Staple", 10),
        ("Paneer Curry", "Main Course", 28),
        ("Mixed Vegetable", "Main Course", 18),
        ("Chapati", "Bread", 5),
        ("Dal", "Main Course", 14),
    ],
}


# --------------------------------------------------
# 3. DATE RANGE
# --------------------------------------------------

dates = pd.date_range(
    start="2025-01-01",
    periods=DAYS,
    freq="D"
)


# --------------------------------------------------
# 4. GENERATE MEAL AND DISH RECORDS
# --------------------------------------------------

records = []

# Store previous demand separately for each meal and dish.
demand_history = {}

for date in dates:

    day_name = date.day_name()
    day_number = date.weekday()

    # Simulated hostel attendance.
    # Weekend attendance is usually lower.
    attendance_factor = 0.78 if day_number >= 5 else 1.0

    expected_attendance = int(
        rng.normal(300 * attendance_factor, 12)
    )

    expected_attendance = max(100, expected_attendance)

    for meal_type, dishes in MENU.items():

        # Different attendance patterns by meal.
        meal_factor = {
            "Breakfast": 0.88,
            "Lunch": 0.96,
            "Dinner": 0.91,
        }[meal_type]

        for dish_name, category, cost in dishes:

            key = (meal_type, dish_name)

            history = demand_history.get(key, [])

            # Use historical demand from previous records only.
            if len(history) >= 7:
                historical_demand = float(
                    np.mean(history[-7:])
                )
            elif history:
                historical_demand = float(np.mean(history))
            else:
                historical_demand = (
                    expected_attendance * meal_factor
                )

            # Simulated student registration.
            registration_rate = rng.uniform(0.65, 0.95)

            registered_students = int(
                expected_attendance * registration_rate
            )

            # Dish preference differs by dish.
            preference_factor = rng.uniform(0.88, 1.08)

            # Actual demand is influenced by attendance,
            # registrations, history, and random variation.
            base_demand = (
                expected_attendance
                * meal_factor
                * preference_factor
            )

            registration_effect = (
                registered_students * 0.12
            )

            history_effect = (
                historical_demand * 0.12
            )

            actual_demand = (
                0.78 * base_demand
                + registration_effect
                + history_effect
                + rng.normal(0, 7)
            )

            actual_demand = int(
                np.clip(actual_demand, 0, expected_attendance)
            )

            # Preparation is intentionally imperfect.
            prepared = int(
                max(
                    0,
                    actual_demand + rng.normal(8, 12)
                )
            )

            # Actual servings cannot exceed preparation
            # or student demand.
            served = min(prepared, actual_demand)

            leftovers = prepared - served

            # A portion of leftovers is discarded.
            discarded_fraction = rng.uniform(0.35, 0.85)

            discarded = int(
                round(leftovers * discarded_fraction)
            )

            usable_leftover = leftovers - discarded

            records.append({
                "date": date.date(),
                "day_of_week": day_name,
                "is_weekend": int(day_number >= 5),
                "meal_type": meal_type,
                "dish_name": dish_name,
                "food_category": category,
                "expected_attendance": expected_attendance,
                "registered_students": registered_students,
                "historical_demand": round(
                    historical_demand, 2
                ),
                "actual_servings_needed": actual_demand,
                "quantity_prepared": prepared,
                "quantity_served": served,
                "usable_leftover": usable_leftover,
                "discarded_quantity": discarded,
                "cost_per_serving": cost,
                "discarded_food_cost": discarded * cost,
            })

            # Update history only after generating this record.
            demand_history.setdefault(key, []).append(
                actual_demand
            )


# --------------------------------------------------
# 5. SAVE DATASET
# --------------------------------------------------

df = pd.DataFrame(records)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

df.to_csv(OUTPUT_FILE, index=False)

print("\nMESSMIND AI - SYNTHETIC DATASET GENERATED")
print("-" * 50)

print(f"Output file: {OUTPUT_FILE}")
print(f"Total records: {len(df)}")
print(f"Unique dates: {df['date'].nunique()}")
print(f"Unique dishes: {df['dish_name'].nunique()}")

print("\nDataset shape:")
print(df.shape)

print("\nFirst five records:")
print(df.head())

print("\nMissing values:")
print(df.isnull().sum())

print("\nMeal distribution:")
print(df["meal_type"].value_counts())

print("\nTotal discarded quantity:")
print(df["discarded_quantity"].sum())

print("\nTotal estimated discarded food cost:")
print(df["discarded_food_cost"].sum())

print("\nDataset generation completed successfully!")

