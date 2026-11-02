
from pathlib import Path
import pandas as pd

DATA_FILE = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "processed"
    / "mess_data.csv"
)

df = pd.read_csv(DATA_FILE)
df["date"] = pd.to_datetime(df["date"])

print("\n========== DATASET OVERVIEW ==========")
print("Shape:", df.shape)
print("\nColumn names:")
print(df.columns.tolist())

print("\n========== DATA TYPES ==========")
print(df.dtypes)

print("\n========== NUMERICAL SUMMARY ==========")
print(df.describe().round(2).to_string())

print("\n========== CATEGORY COUNTS ==========")
for column in ["meal_type", "dish_name", "food_category"]:
    print(f"\n{column}:")
    print(df[column].value_counts().to_string())

print("\n========== DATA QUALITY ==========")
print("Missing values:", df.isnull().sum().sum())
print("Duplicate rows:", df.duplicated().sum())

print("\n========== QUANTITY VALIDATION ==========")

print(
    "Served exceeds prepared:",
    (df["quantity_served"] > df["quantity_prepared"]).sum()
)

print(
    "Served exceeds demand:",
    (df["quantity_served"] > df["actual_servings_needed"]).sum()
)

print(
    "Leftover calculation errors:",
    (
        df["quantity_prepared"]
        - df["quantity_served"]
        != df["usable_leftover"] + df["discarded_quantity"]
    ).sum()
)

print("\n========== SHORTAGE ANALYSIS ==========")

shortages = (
    df["actual_servings_needed"] - df["quantity_prepared"]
).clip(lower=0)

print("Total unmet demand:", int(shortages.sum()))
print("Records with shortages:", int((shortages > 0).sum()))

print("\n========== HISTORICAL DEMAND CHECK ==========")

sample = df[
    (df["meal_type"] == "Breakfast")
    & (df["dish_name"] == "Idli")
][
    [
        "date",
        "historical_demand",
        "actual_servings_needed",
    ]
]

print(sample.head(12).to_string(index=False))

print("\n========== DATE RANGE ==========")
print("First date:", df["date"].min().date())
print("Last date:", df["date"].max().date())

print("\nDataset inspection completed.")

