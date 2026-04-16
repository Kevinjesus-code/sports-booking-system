import "./button.css";

const Button = ({
  children,
  variant = "solid",    
  color = "primary",   
  size = "md",         
  iconLeft,            
  iconRight,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      className={`btn btn-${variant}-${color} btn-${size}`}
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