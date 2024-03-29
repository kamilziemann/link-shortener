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
import { FC, InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
  name: string;
  label: string;
  className?: string;
  description?: string;
  inputProps?: Partial<InputHTMLAttributes<HTMLInputElement>>;
}

const InputField: FC<Props> = ({ name, label, className, description, inputProps }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-1', className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...inputProps} className={inputProps?.className} {...field} />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
