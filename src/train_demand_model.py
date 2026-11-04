from pathlib import Path
import json

import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


# Paths
DATA_PATH = Path("data/processed/mess_data.csv")
MODEL_DIR = Path("models")
OUTPUT_DIR = Path("outputs")

MODEL_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Load and prepare data
df = pd.read_csv(DATA_PATH)
df["date"] = pd.to_datetime(df["date"])
df["month"] = df["date"].dt.month
df["day_of_month"] = df["date"].dt.day

target = "actual_servings_needed"

numeric_features = [
    "is_weekend",
    "expected_attendance",
    "registered_students",
    "historical_demand",
    "month",
    "day_of_month",
]

categorical_features = [
    "day_of_week",
    "meal_type",
    "dish_name",
    "food_category",
]

feature_columns = numeric_features + categorical_features

# Chronological train/test split: last 20% of dates for testing
dates = sorted(df["date"].unique())
split_index = int(len(dates) * 0.8)
test_start_date = dates[split_index]

train_df = df[df["date"] < test_start_date].copy()
test_df = df[df["date"] >= test_start_date].copy()

X_train = train_df[feature_columns]
y_train = train_df[target]
X_test = test_df[feature_columns]
y_test = test_df[target]

# Preprocessing and Random Forest model
preprocessor = ColumnTransformer(
    transformers=[
        ("categorical", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ("numeric", "passthrough", numeric_features),
    ]
)

model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "regressor",
            RandomForestRegressor(
                n_estimators=300,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1,
            ),
        ),
    ]
)

print("Training Random Forest model...")
model.fit(X_train, y_train)

# Predictions and baseline
predictions = model.predict(X_test)
baseline_predictions = test_df["historical_demand"].to_numpy()

model_mae = mean_absolute_error(y_test, predictions)
model_rmse = np.sqrt(mean_squared_error(y_test, predictions))
model_r2 = r2_score(y_test, predictions)

baseline_mae = mean_absolute_error(y_test, baseline_predictions)
baseline_rmse = np.sqrt(mean_squared_error(y_test, baseline_predictions))

improvement = (
    (baseline_mae - model_mae) / baseline_mae * 100
    if baseline_mae > 0
    else 0.0
)

# Save trained model
model_path = MODEL_DIR / "food_demand_model.joblib"
joblib.dump(
    {
        "model": model,
        "feature_columns": feature_columns,
        "target": target,
    },
    model_path,
)

# Save test predictions
results = test_df[
    ["date", "meal_type", "dish_name", target, "historical_demand"]
].copy()

results["predicted_servings"] = predictions.round(2)
results["recommended_servings"] = np.ceil(
    np.maximum(predictions, 0)
).astype(int)

results.to_csv(OUTPUT_DIR / "demand_predictions.csv", index=False)

# Save evaluation metrics
metrics = {
    "model": "Random Forest Regressor",
    "dataset": "Synthetic mess dataset",
    "total_records": int(len(df)),
    "training_records": int(len(train_df)),
    "testing_records": int(len(test_df)),
    "test_start_date": str(pd.Timestamp(test_start_date).date()),
    "test_end_date": str(test_df["date"].max().date()),
    "model_mae": round(float(model_mae), 4),
    "model_rmse": round(float(model_rmse), 4),
    "model_r2": round(float(model_r2), 4),
    "baseline": "Historical demand",
    "baseline_mae": round(float(baseline_mae), 4),
    "baseline_rmse": round(float(baseline_rmse), 4),
    "mae_improvement_percent": round(float(improvement), 2),
}

with open(OUTPUT_DIR / "demand_model_metrics.json", "w") as file:
    json.dump(metrics, file, indent=4)

print("\nTRAINING COMPLETE")
print("-----------------")
print(f"Training records : {len(train_df)}")
print(f"Testing records  : {len(test_df)}")
print(f"Test period      : {metrics['test_start_date']} to {metrics['test_end_date']}")
print(f"\nRandom Forest MAE  : {model_mae:.4f} servings")
print(f"Random Forest RMSE : {model_rmse:.4f} servings")
print(f"Random Forest R2   : {model_r2:.4f}")
print(f"\nBaseline MAE       : {baseline_mae:.4f} servings")
print(f"Baseline RMSE      : {baseline_rmse:.4f} servings")
print(f"MAE improvement    : {improvement:.2f}%")
print(f"\nSaved model        : {model_path}")
print("Saved predictions : outputs/demand_predictions.csv")
print("Saved metrics     : outputs/demand_model_metrics.json")
