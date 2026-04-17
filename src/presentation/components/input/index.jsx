import "./input.css";

const Input = ({ label, value, onChange, placeholder, type = "text", icon }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          className={`input ${icon ? "has-icon" : ""}`}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default Input;