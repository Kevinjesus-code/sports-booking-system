import "./selectable-item.css";
import { DSASwitch } from "..";


const SelectableItem = ({ label, checked, onChange }) => {
  return (
    <div className="selectable-item">
      <span className="selectable-label">{label}</span>
      <DSASwitch checked={checked} onChange={onChange} />
    </div>
  );
};

export default SelectableItem;