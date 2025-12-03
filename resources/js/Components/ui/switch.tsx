import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

type SwitchVariant = 'default' | 'status';

type SwitchProps = React.ComponentPropsWithoutRef<
    typeof SwitchPrimitives.Root
> & {
    variant?: SwitchVariant;
};

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    SwitchProps
>(({ className, variant = 'default', ...props }, ref) => (
    <SwitchPrimitives.Root
        ref={ref}
        {...props}
        className={cn(
            'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50',
            // default: dipakai dark-mode toggle, dll
            variant === 'default' && 'bg-input data-[state=checked]:bg-primary',
            // status: dipakai di table (hijau/merah)
            variant === 'status' && [
                'data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500',
                'data-[state=unchecked]:border-red-400 data-[state=unchecked]:bg-red-500/10',
            ],
            className,
        )}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                'pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform',
                'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
                // 🎯 variant default → bullet hitam di light mode, terang di dark mode
                variant === 'default' && 'bg-neutral-900 dark:bg-neutral-900',
                // 🎯 variant status → bullet soft hijau/merah
                variant === 'status' && [
                    'data-[state=checked]:bg-emerald-50',
                    'data-[state=unchecked]:bg-red-50',
                ],
            )}
        />
    </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
