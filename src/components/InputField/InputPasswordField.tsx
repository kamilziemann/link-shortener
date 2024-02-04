'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FC, InputHTMLAttributes, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

interface Props {
  name: string;
  label: string;
  description?: string;
  inputProps?: Partial<InputHTMLAttributes<HTMLInputElement>>;
}

const InputPasswordField: FC<Props> = ({ name, label, description, inputProps }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { control } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const disabled = field.disabled || !!inputProps?.disabled;

          return (
            <FormItem className="space-y-1">
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...inputProps}
                    type={showPassword ? 'text' : 'password'}
                    className={cn('hide-password-toggle pr-10', inputProps?.className)}
                    {...field}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={disabled}
                  >
                    {showPassword && !disabled ? (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
              </FormControl>
              {description ? <FormDescription>{description}</FormDescription> : null}
              <FormMessage />
            </FormItem>
          );
        }}
      />
      {/* hides browsers password toggles */}
      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </>
  );
};

export default InputPasswordField;
