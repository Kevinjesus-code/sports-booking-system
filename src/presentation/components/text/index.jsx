import "./text.css";
 
const Text = ({
  children,
  variant = "text",
  color,
  align,
}) => {
  return (
    <p
      className={`typography typography-${variant}`}
      style={{ color, textAlign: align }}
    >
      {children}
    </p>
  );
};
 
export default Text;
 