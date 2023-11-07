import clsx from 'clsx'
import { useState, ReactElement, Children, ReactNode } from 'react'

export function Tabs({ children, _additionalTabTitle }) {
    const [activeTabIndex, setActiveTabIndex] = useState(0)
    const arrayChildren = Children.toArray(children) as ReactElement[]
    const activeTabContent = arrayChildren[activeTabIndex]?.props?.children
    const titles = [
        ...arrayChildren.map((child: ReactElement) => child.props.title),
        _additionalTabTitle,
    ].filter(Boolean)
    return (
        <>
            <div className='not-prose mb-6 pb-[1px] flex-none min-w-full overflow-auto border-b border-zinc-200 space-x-6 flex dark:border-zinc-200/10'>
                {titles.map((title, i: number) => (
                    <div
                        className='cursor-pointer'
                        onClick={() => setActiveTabIndex(i)}
                    >
                        <Tab
                            title={title ?? 'Tab Title'}
                            isActive={i === activeTabIndex}
                        />
                    </div>
                ))}
            </div>
            <div className=''>{activeTabContent}</div>
        </>
    )
}

export function Tab({
    title,
    isActive = true,
    children,
    className,
}: {
    title: any
    isActive?: boolean
    children?: ReactNode
    className?: string
}) {
    return (
        <>
            <h2
                className={clsx(
                    'flex text-sm leading-6 font-semibold whitespace-nowrap pt-3 pb-2.5 -mb-px max-w-max border-b',
                    className,
                    isActive
                        ? 'text-primary dark:text-primary-light border-current'
                        : 'text-slate-900 border-transparent hover:border-slate-300 dark:text-slate-200 dark:hover:border-slate-700',
                )}
            >
                {title}
            </h2>
            {children ? (
                <div className='prose dark:prose-dark'>{children}</div>
            ) : null}
        </>
    )
}
