import "./button.css";

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
      className={`btn btn-${variant}-${color}`}
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