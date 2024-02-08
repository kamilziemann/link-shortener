import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { DateTimePicker } from '@/components/DateTimePicker';

interface DateTimePickerFieldProps {
  name: string;
  label: string;
  className?: string;
  description?: string;
}

const DateTimePickerField: FC<DateTimePickerFieldProps> = ({
  name,
  label,
  className,
  description,
}) => {
  const { control, setValue, watch, getFieldState } = useFormContext();
  const selectedDate = watch(name);

  const handleDateChange = (date: Date | undefined) => {
    setValue(name, date, { shouldValidate: true });
  };

  const { invalid, error } = getFieldState(name);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('space-y-1 flex flex-col gap-1', className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DateTimePicker
              date={selectedDate}
              onChange={handleDateChange}
              popoverContentClassName={invalid ? 'border-red-600' : undefined}
              errorMessage={error?.message}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateTimePickerField;
