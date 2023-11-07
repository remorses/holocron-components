import cn from 'clsx'
import type { ComponentProps, ReactElement } from 'react'

export function Steps({
    children,
    className,
    ...props
}: ComponentProps<'div'>): ReactElement {
    return (
        <div
            className={cn(
                'hlc-steps ml-4 mb-8 border-l border-gray-200 pl-7',
                'dark:border-neutral-800 [counter-reset:step]',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    )
}
