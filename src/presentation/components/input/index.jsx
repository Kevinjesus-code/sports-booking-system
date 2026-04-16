import "./input.css";

const Input = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        className="input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;