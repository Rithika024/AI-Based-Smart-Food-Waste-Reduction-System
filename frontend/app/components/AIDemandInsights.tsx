export default function AIDemandInsights() {
  return (
    <section className="panel ai-model-panel" id="ai-demand">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">MACHINE LEARNING</span>
          <h2>AI demand prediction</h2>
          <p className="ai-model-subtitle">Random Forest regression model</p>
        </div>
        <span className="date-chip">Test evaluation</span>
      </div>

      <div className="ai-metric-grid">
        <div className="ai-metric-card">
          <span>Mean absolute error</span>
          <strong>11.09 <small>servings</small></strong>
          <p>Average prediction error</p>
        </div>

        <div className="ai-metric-card">
          <span>R-squared score</span>
          <strong>0.8008</strong>
          <p>Model fit on test data</p>
        </div>

        <div className="ai-metric-card">
          <span>Improvement over baseline</span>
          <strong>55.31%</strong>
          <p>Lower MAE than historical demand</p>
        </div>
      </div>

      <div className="ai-model-details">
        <p><strong>Model:</strong> Random Forest Regressor</p>
        <p><strong>Training records:</strong> 4,380</p>
        <p><strong>Testing records:</strong> 1,095</p>
        <p><strong>Baseline MAE:</strong> 24.81 servings</p>
      </div>

      <p className="ai-model-note">
        Evaluation uses a synthetic mess dataset. These are test results,
        not predictions from live mess operations.
      </p>
    </section>
  );
}
