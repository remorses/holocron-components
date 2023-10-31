import clsx from 'clsx'
import React, { ReactNode } from 'react'

export function HlcCardGroup({
    children,
    cols = 2,
    className,
}: {
    children: ReactNode
    cols?: 1 | 2 | 3 | 4
    className?: string
}) {
    return (
        <div
            className={clsx(
                `grid my-6 sm:grid-cols-${cols} gap-x-4`,
                className,
            )}
        >
            {children}
        </div>
    )
}
