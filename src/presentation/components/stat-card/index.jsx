import "./start-card.css";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <h2 className="stat-value">{value}</h2>
      </div>

      <div className="stat-icon">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;