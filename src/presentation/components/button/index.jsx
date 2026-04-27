import styles from "./button.module.css";

const Button = ({
  children,
  variant = "solid",    
  color = "primary",        
  iconLeft,            
  iconRight,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      className={`${styles.btn} ${styles[`btn-${variant}-${color}`]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {iconLeft && iconLeft}
      {children}
      {iconRight && iconRight}
    </button>
  );
};

export default Button;