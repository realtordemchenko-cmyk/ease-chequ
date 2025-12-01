import React from "react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}
const Button: React.FC<ButtonProps> = ({ variant = "primary", ...props }) => (
  <button className={variant} {...props} />
);
export default Button;
