import "./stat-card";
const StatCard = ({ title, value, icon, iconBg = "#fee2e2", iconColor = "#22c55e" }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <h2 className="stat-value">{value}</h2>
      </div>
      <div className="stat-icon" style={{ backgroundColor: iconBg }}>
        <svg viewBox="0 0 24 24" style={{ stroke: iconColor }}>
          {icon}
        </svg>
      </div>
    </div>
  );
};

export default StatCard;