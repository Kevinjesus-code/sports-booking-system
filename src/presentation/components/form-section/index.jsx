import { DSAText } from "..";

const FormSection = ({ title, children }) => {
  return (
    <div>
      <DSAText variant="subtitle">{title}</DSAText>
      {children}
    </div>
  );
};

export default FormSection;