import { clsx } from 'clsx'
import isAbsoluteUrl from 'is-absolute-url'
import { ComponentPropsWithoutRef, ElementType, ReactNode, Ref } from 'react'

export interface CardPropsBase<T> {
    _iconElement?: any
    /**
     * Large title above children.
     */
    title?: string | ReactNode
    /**
     * Icon to the top-left of the title. Can be a ReactNode or a string equal to an image source.
     */
    icon?: string
    /**
     * If provided, will render an image to the top of the card.
     */
    image?: string
    /**
     * Type of element to be rendered.
     */
    as?: T
    /**
     * If provided, will render as an anchor element.
     */
    href?: string
    /**
     * Ref of the element to be rendered.
     */
    mRef?: Ref<T | undefined>
}

/**
 * Props for the `Card` component
 * @typeParam T - Type of the Element rendered by the card.
 */
export type CardProps<T extends ElementType> = CardPropsBase<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof CardPropsBase<T>>

export function Icon({ icon }) {
    if (!icon) {
        return null
    }
    if (isUrl(icon)) {
        return (
            <div contentEditable={false} className='shrink-0 h-6 w-6 '>
                <img src={icon} alt={''} className='dark:invert w-full' />
            </div>
        )
    }
    const isEmoji = icon.length === 1
    if (isEmoji) {
        return (
            <div
                contentEditable={false}
                className='shrink-0 h-6 w-6 fill-slate-800 dark:fill-slate-100 text-slate-800 dark:text-slate-100'
            >
                {icon}
            </div>
        )
    }
    return (
        <div contentEditable={false} className='shrink-0 select-none h-6 w-6' />
    )
}

function isUrl(str: string) {
    return str.startsWith('http://') || str.startsWith('https://')
}

export function Card<T extends ElementType = 'div'>({
    title,
    icon,
    _iconElement,

    image,
    className,
    children,
    as,
    mRef,
    ...props
}: CardProps<T>) {
    /**
     * If provided, use `as` or an `a` tag if linking to things with href.
     * Defaults to `div`.
     */
    const Component = as || props.href != undefined ? 'a' : 'div'

    const openLinksInNewTab = isAbsoluteUrl(props.href ?? '')
    const newTabProps = openLinksInNewTab
        ? { target: '_blank', rel: 'noreferrer' }
        : {}

    const renderIcon = _iconElement || <Icon icon={icon} />

    return (
        <Component
            className={clsx(
                'block font-normal group relative my-2 ring-2 ring-inset ring-transparent rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden w-full',
                props.href && 'cursor-pointer',
                className,
            )}
            {...newTabProps}
            {...props}
            ref={mRef as Ref<never>}
        >
            {image && (
                <div className='not-prose'>
                    <img
                        src={image}
                        alt={image}
                        className='w-full h-64 object-cover object-center'
                    />
                </div>
            )}
            <div className='px-6 not-prose py-5'>
                {renderIcon}

                <div
                    className={clsx(
                        'font-semibold block text-base text-slate-800 dark:text-white',
                        icon !== null && icon !== undefined && 'mt-4',
                    )}
                >
                    {title}
                </div>

                <div
                    className={clsx(
                        'mt-1 font-normal [&_p]:!my-0',
                        title
                            ? 'text-slate-600 dark:text-slate-400'
                            : 'text-slate-700 dark:text-slate-300',
                    )}
                >
                    {children}
                </div>
            </div>
        </Component>
    )
}
