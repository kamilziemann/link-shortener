import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TimePicker } from '@/components/TimePicker';
import { cn, getUserLocale } from '@/lib/utils';

interface Props {
  date?: Date;
  onChange: (date: Date | undefined) => void;
  popoverContentClassName?: string;
  errorMessage?: string;
}

const DateTimePicker = ({ date, popoverContentClassName, errorMessage, onChange }: Props) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant={'outline'}
        className={cn(
          'w-[280px] justify-start text-left font-normal',
          !date && 'text-muted-foreground',
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? (
          format(date, 'PPP HH:mm:ss', { locale: getUserLocale() })
        ) : (
          <span>Pick a date</span>
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent className={cn('w-auto p-0', popoverContentClassName)}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={onChange}
        initialFocus
        locale={getUserLocale()}
      />
      <div className="p-3 border-t border-border">
        <TimePicker setDate={onChange} date={date} />
      </div>
      {errorMessage ? (
        <p className="px-3 text-[0.8rem] font-medium text-destructive break-words max-w-[224px]">
          {errorMessage}
        </p>
      ) : null}
    </PopoverContent>
  </Popover>
);

export default DateTimePicker;
