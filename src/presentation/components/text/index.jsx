import styles from "./text.module.css";
 
const Text = ({
  children,
  variant = "text",
  color,
  align,
}) => {
  return (
    <p
      className={`${styles["typography"]} ${styles[`typography-${variant}`]}`}
      style={{ color, textAlign: align }}
    >
      {children}
    </p>
  );
};
 
export default Text;
 