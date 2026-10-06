import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0B3D2E] text-white border border-[#0B3D2E] hover:bg-[#147D64] hover:border-[#147D64] active:bg-[#082B23] active:border-[#082B23] shadow-sm',
  secondary:
    'bg-white text-[#082B23] border border-[#E3E7DF] hover:bg-[#F7F4EC] hover:border-[#147D64]/50 hover:text-[#0B3D2E] active:bg-[#EDE8DC] active:border-[#147D64]/70 shadow-2xs',
  gold:
    'bg-[#C7A45B] text-white border border-[#C7A45B] hover:bg-[#B38F46] hover:border-[#B38F46] active:bg-[#9E7B34] active:border-[#9E7B34] shadow-sm',
  outline:
    'bg-transparent text-[#0B3D2E] border border-[#0B3D2E] hover:bg-[#0B3D2E]/10 active:bg-[#0B3D2E]/20',
  ghost:
    'bg-transparent text-[#082B23] border border-transparent hover:bg-[#0B3D2E]/10 hover:text-[#0B3D2E] active:bg-[#0B3D2E]/20',
  danger:
    'bg-red-700 text-white border border-red-700 hover:bg-red-800 hover:border-red-800 active:bg-red-900 active:border-red-900 shadow-sm',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base font-semibold rounded-xl gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'start',
      className = '',
      children,
      disabled,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={`inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none
          active:scale-[0.98]
          focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#147D64] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F4EC]
          disabled:opacity-55 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}`}
        {...rest}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'start' && <span className="shrink-0">{icon}</span>}
            {children && <span>{children}</span>}
            {icon && iconPosition === 'end' && <span className="shrink-0">{icon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
