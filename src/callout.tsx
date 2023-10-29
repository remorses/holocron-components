import clsx from 'clsx'
import { FileWarning, FileWarningIcon, LightbulbIcon } from 'lucide-react'

const styles = {
    note: {
        container:
            'bg-sky-50 dark:bg-gray-800/60 dark:ring-1 dark:ring-gray-300/10',
        body: 'text-sky-800 [--tw-prose-background:theme(colors.sky.50)] prose-a:text-sky-900 prose-code:text-sky-900 dark:text-gray-300 dark:prose-code:text-gray-300',
    },
    warning: {
        container:
            'bg-amber-50 dark:bg-gray-800/60 dark:ring-1 dark:ring-gray-300/10',

        body: 'text-amber-800 [--tw-prose-underline:theme(colors.amber.400)] [--tw-prose-background:theme(colors.amber.50)] prose-a:text-amber-900 prose-code:text-amber-900 dark:text-gray-300 dark:[--tw-prose-underline:theme(colors.sky.700)] dark:prose-code:text-gray-300',
    },
}

const icons = {
    note: (props) => <LightbulbIcon {...props} />,
    warning: (props) => <FileWarningIcon {...props} />,
}

export function Callout({ children, type = 'note' }) {
    let IconComponent = icons[type]
    if (!type) {
        return null
    }
    return (
        <div
            className={clsx(
                'relative my-8 flex flex-col gap-2 rounded p-6',
                styles[type].container,
            )}
        >
            <div className='flex items-center'>
                <IconComponent
                    contentEditable={false}
                    className='h-8 w-8 flex-none'
                />
                <div className='ml-4 max-w-max flex-auto'>
                    <div className={clsx('', styles[type].body)}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

Callout.icons = icons
Callout.styles = styles
