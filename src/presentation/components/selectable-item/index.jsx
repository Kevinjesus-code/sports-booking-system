import styles from "./selectable-item.module.css";
import { DSASwitch } from "..";


const SelectableItem = ({ label, checked, onChange }) => {
  return (
    <div className={styles["selectable-item"]}>
      <span className={styles["selectable-label"]}>{label}</span>
      <DSASwitch checked={checked} onChange={onChange} />
    </div>
  );
};

export default SelectableItem;