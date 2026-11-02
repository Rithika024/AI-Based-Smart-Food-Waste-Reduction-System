
const meals = [
  { name: "Breakfast", time: "7:30 AM – 9:00 AM", dishes: "Idli, Dosa, Sambar", status: "Completed" },
  { name: "Lunch", time: "12:30 PM – 2:00 PM", dishes: "Rice, Dal, Vegetable Curry", status: "Upcoming" },
  { name: "Dinner", time: "7:30 PM – 9:00 PM", dishes: "Chapati, Paneer Curry, Dal", status: "Upcoming" },
];

const stats = [
  { label: "Registered for meals", value: "248", note: "Sample registrations", icon: "👥" },
  { label: "Estimated demand", value: "265", note: "Rule-based estimate", icon: "📊" },
  { label: "Recommended servings", value: "278", note: "Including safety margin", icon: "🍽️" },
  { label: "Food waste recorded", value: "18 kg", note: "Sample demonstration", icon: "♻️" },
];

const weeklyWaste = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 48 },
  { day: "Wed", value: 72 },
  { day: "Thu", value: 42 },
  { day: "Fri", value: 55 },
  { day: "Sat", value: 32 },
  { day: "Sun", value: 24 },
];

export default function Home() {
  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <a href="#overview" className="brand">
          <span className="brand-icon">🌱</span>
          <span>MessMind <strong>AI</strong></span>
        </a>

        <p className="nav-heading">WORKSPACE</p>
        <nav className="side-nav">
          <a className="nav-link active" href="#overview">▦ <span>Overview</span></a>
          <a className="nav-link" href="#meals">🍽 <span>Meal schedule</span></a>
          <a className="nav-link" href="#demand">↗ <span>Demand planning</span></a>
          <a className="nav-link" href="#waste">♻ <span>Waste tracking</span></a>
          <a className="nav-link" href="#reports">▤ <span>Reports</span></a>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span>🌍</span>
            <strong>Small changes, less waste.</strong>
            <p>Plan smarter meals for a more sustainable mess.</p>
          </div>
          <div className="profile">
            <div className="avatar">M</div>
            <div>
              <strong>Mess Administrator</strong>
              <small>Demo workspace</small>
            </div>
          </div>
        </div>
      </aside>

      <section className="main-area" id="overview">
        <header className="topbar">
          <div>
            <span className="eyebrow">MESS MANAGEMENT SYSTEM</span>
            <h1>Dashboard overview</h1>
          </div>
          <div className="topbar-right">
            <span className="demo-label">● DEMO DATA</span>
            <div className="avatar">M</div>
          </div>
        </header>

        <div className="content">
          <section className="welcome-banner">
            <div>
              <span className="banner-tag">SMARTER MEALS. LESS WASTE.</span>
              <h2>Good day, Mess Team! 👋</h2>
              <p>Make informed preparation decisions using meal registrations and historical mess records.</p>
              <a href="#demand" className="primary-button">View demand planning <span>→</span></a>
            </div>
            <div className="banner-art" aria-hidden="true">🥗</div>
          </section>

          <div className="section-heading">
            <div>
              <span className="eyebrow">AT A GLANCE</span>
              <h2>Today's mess insights</h2>
            </div>
            <span className="sample-note">Illustrative sample figures</span>
          </div>

          <section className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className="stat-top">
                  <span>{stat.label}</span>
                  <span className="stat-icon">{stat.icon}</span>
                </div>
                <strong className="stat-value">{stat.value}</strong>
                <small>{stat.note}</small>
              </article>
            ))}
          </section>

          <div className="middle-grid">
            <section className="panel" id="meals">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">TODAY'S MENU</span>
                  <h2>Meal schedule</h2>
                </div>
                <span className="date-chip">Daily overview</span>
              </div>
              <div className="meal-list">
                {meals.map((meal, index) => (
                  <article className="meal-row" key={meal.name}>
                    <div className="meal-emoji">{["🌅", "☀️", "🌙"][index]}</div>
                    <div className="meal-details">
                      <strong>{meal.name}</strong>
                      <small>{meal.time}</small>
                      <p>{meal.dishes}</p>
                    </div>
                    <span className={`meal-status ${meal.status === "Completed" ? "completed" : ""}`}>
                      {meal.status}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel" id="demand">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">PREPARATION PLANNING</span>
                  <h2>Demand recommendation</h2>
                </div>
                <span className="recommendation-icon">✦</span>
              </div>
              <div className="recommendation-box">
                <span>Illustrative recommended quantity</span>
                <strong>278 <small>servings</small></strong>
                <p>Based on registrations, historical demand and a sample safety margin.</p>
              </div>
              <div className="calculation-row">
                <span>Registered students</span><strong>248</strong>
              </div>
              <div className="calculation-row">
                <span>Historical average</span><strong>265</strong>
              </div>
              <div className="calculation-row">
                <span>Safety margin</span><strong>5%</strong>
              </div>
              <p className="method-note">Demonstration values only. Live recommendations will use database records.</p>
            </section>
          </div>

          <section className="panel waste-panel" id="waste">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">WASTE MONITORING</span>
                <h2>Weekly food waste overview</h2>
              </div>
              <span className="date-chip">Sample data · kg</span>
            </div>
            <div className="chart-area">
              {weeklyWaste.map((item) => (
                <div className="bar-column" key={item.day}>
                  <strong>{item.value} kg</strong>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: `${item.value}%` }} />
                  </div>
                  <small>{item.day}</small>
                </div>
              ))}
            </div>
            <p className="chart-caption">Illustrative weekly waste quantities. Actual charts will be generated from recorded waste data.</p>
          </section>

          <footer className="footer" id="reports">
            <span>🌱 MessMind AI — Plan better. Waste less.</span>
            <span>SQL-first food waste management system</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
