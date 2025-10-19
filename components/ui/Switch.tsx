
import React from 'react';
import { cn } from '../../lib/utils';

// Fix: The original component was syntactically incorrect and didn't support controlled component props.
// This new interface defines `checked` and `onCheckedChange` to align with its usage.
export interface SwitchProps
  extends React.ComponentPropsWithoutRef<'button'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<
  React.ElementRef<'button'>,
  SwitchProps
>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    data-state={checked ? 'checked' : 'unchecked'}
    // Fix: Added onClick handler to make the switch interactive.
    onClick={() => onCheckedChange?.(!checked)}
    className={cn(
      "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <span
      data-state={checked ? 'checked' : 'unchecked'}
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </button>
));
Switch.displayName = "Switch";

export { Switch };
