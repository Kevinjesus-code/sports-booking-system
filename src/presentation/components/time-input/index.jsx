import "./time-input.css";

const TimeInput = ({ label, value, onChange }) => {
  return (
    <div className="time-input-group">
      {label && <label className="time-label">{label}</label>}

      <div className="time-input-wrapper">
        <input
          type="time"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="time-input"
        />
      </div>
    </div>
  );
};

export default TimeInput;