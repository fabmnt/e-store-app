'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  containerClassName?: string;
  inputClassName?: string;
  showToggle?: boolean;
  iconLeft?: React.ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      containerClassName,
      inputClassName,
      showToggle = true,
      iconLeft,
      id = 'password',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={cn(containerClassName)}>
        <div className="relative">
          <span className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-muted-foreground">
            {iconLeft !== undefined ? iconLeft : <Lock className="h-4 w-4" />}
          </span>
          <Input
            autoComplete="current-password"
            className={cn('h-11 pr-10 pl-10', inputClassName)}
            id={id}
            placeholder={props.placeholder ?? 'Enter your password'}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            {...props}
          />
          {showToggle && (
            <Button
              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((v) => !v)}
              size="sm"
              tabIndex={-1}
              type="button"
              variant="ghost"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
