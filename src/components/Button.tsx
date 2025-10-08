// File: D:\Projects\Ease Chequ\src\components\Button.tsx
// Purpose: Reusable button with variant, accessibility, and disabled state.

import React from 'react';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
    variant?: ButtonVariant;
    type?: 'button' | 'submit' | 'reset';
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    ariaLabel: string;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    type = 'button',
    children,
    onClick,
    disabled,
    ariaLabel,
}) => {
    return (
        <button
            type={type}
            className={variant}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
};

export default Button;