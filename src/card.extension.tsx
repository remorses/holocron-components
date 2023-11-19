import {
    Node,
    NodeViewProps,
    findParentNode,
    findParentNodeClosestToPos,
} from '@tiptap/core'

import {
    NodeViewContent,
    NodeViewWrapper,
    ReactNodeViewRenderer,
} from '@tiptap/react'
import { MarkdownSerializerState } from 'prosemirror-markdown'
import { Node as PNode } from 'prosemirror-model'
import { Note, Tip, Warning, Check, Info } from './callout'
import { holocronExtensionTypes } from './constants'
import { Card, Icon } from './card'
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Tab,
    Tabs,
    useDisclosure,
} from '@nextui-org/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

import { makeExtensionConfig } from './utils'
import memoize from 'micro-memoize'

let iconUrlProvider = `https://holocron.so/icon`
// iconUrlProvider = `https://api.iconify.design`
const inputClass = 'card-title-input'

const tagName = 'Card'

export const CardExtension = Node.create({
    name: holocronExtensionTypes.card,
    group: 'block',
    content: 'paragraph+',
    defining: true,
    ...makeExtensionConfig({
        tagName,
        attributes: {
            icon: {
                default: '',
            },
            title: {
                default: 'Card Title',
            },
            href: {
                default: '',
            },
        },
    }),
    addNodeView() {
        return ReactNodeViewRenderer(Component)
    },
})

function Component({
    node,
    getPos,
    editor,
    deleteNode,

    updateAttributes,
}: NodeViewProps) {
    const icon = node.attrs.icon

    const inputRef = useRef<HTMLInputElement>(null)
    return (
        <NodeViewWrapper>
            <Card
                className='group relative non-draggable'
                icon={icon}
                _iconElement={
                    <IconPicker
                        value={icon}
                        onChange={(icon) => {
                            updateAttributes({ icon })
                        }}
                    >
                        <Icon icon={icon} />
                    </IconPicker>
                }
                title={
                    <input
                        className={clsx(
                            'appearance-none focus:outline-none not-prose bg-transparent w-full',
                            inputClass,
                        )}
                        value={node.attrs.title}
                        ref={inputRef}
                        // autoFocus
                        // focus on node view content on arrow down
                        onKeyDown={(e) => {
                            // skip if input is not focused
                            // if (document.activeElement !== e.currentTarget) {
                            //     return
                            // }
                            if (e.key === 'ArrowDown') {
                                e.preventDefault()
                                e.stopPropagation()
                                editor.commands.focus(getPos() + 1)
                            }
                        }}
                        onChange={(e) =>
                            updateAttributes({ title: e.target.value })
                        }
                    />
                }
            >
                <div
                    contentEditable={false}
                    className='absolute transition-opacity group-hover:opacity-100 opacity-0 top-3 right-4 gap-2'
                >
                    <LinkButton
                        onChange={(value) => {
                            updateAttributes({ href: value })
                        }}
                        value={node.attrs.href}
                    />
                    <Button
                        isIconOnly
                        size='sm'
                        variant='ghost'
                        onClick={() => {
                            const pos = getPos()
                            const view = editor.view
                            const resolvedPos =
                                editor.view.state.doc.resolve(pos)
                            if (
                                resolvedPos.parent.type.name !==
                                holocronExtensionTypes.cardGroup
                            ) {
                                return deleteNode()
                            }
                            if (resolvedPos.parent.childCount <= 1) {
                                view.dispatch(
                                    view.state.tr.delete(
                                        resolvedPos.before(),
                                        resolvedPos.after(),
                                    ),
                                )
                            } else {
                                deleteNode()
                            }
                        }}
                        className='font-medium border-0 opacity-70'
                    >
                        <IconamoonClose className='w-5' />
                    </Button>
                </div>
                <NodeViewContent className='' />
            </Card>
        </NodeViewWrapper>
    )
}

function parseIconUrl(url: string) {
    if (!url) {
        return {}
    }
    if (!url.startsWith(`${iconUrlProvider}/`)) {
        return {}
    }
    const u = new URL(url)
    const parts = u.pathname.split('/')
    // fe:activity.svg
    const iconKey = parts[parts.length - 1]
    if (!iconKey) {
        return {}
    }
    let [namespace, name] = iconKey.split(':')
    name = name.replace('.svg', '')
    return { namespace, name }
}

function iconUrl({ name, namespace }) {
    return `${iconUrlProvider}/${namespace}:${name}.svg`
}

const iconsMeta = {
    lucide: { import: memoize(() => import('@iconify-json/lucide')) },
    // https://api.iconify.design/simple-icons:1001tracklists.svg?color=%23888888
    'simple-icons': {
        import: memoize(() => import('@iconify-json/simple-icons')),
        title: 'brand icons',
    },
}

const namespaces = Object.keys(iconsMeta)

function IconPicker({ children, value, onChange }) {
    // https://api.iconify.design/fe:activity.svg?color=%23888888
    const parsed = parseIconUrl(value)
    const [namespace, setNamespace] = useState(namespaces[0])
    const [allIcons, setIcons] =
        useState<typeof import('@iconify-json/lucide')>()
    useEffect(() => {
        setLoading(true)
        iconsMeta[namespace]?.import?.().then((icons) => {
            setIcons(icons)
            setLoading(false)
        })
    }, [namespace])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()
    // console.log(allIcons)
    let icons = useMemo(() => {
        return Object.keys(allIcons?.icons?.icons || {}).filter((icon) => {
            if (!search) {
                return true
            }
            return icon.includes(search)
        })
    }, [search, namespace, allIcons])
    useEffect(() => {
        if (!isOpen) {
            setSearch('')
        }
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 10)
        }
    }, [isOpen, namespace])
    const inputRef = useRef<any>(null)

    return (
        <Popover
            contentEditable={false}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            shouldBlockScroll
            backdrop='opaque'
            triggerScaleOnOpen={false}
            className='not-prose'
            placement='bottom'
            triggerType='menu'
            showArrow={false}
        >
            <PopoverTrigger
                contentEditable={false}
                onClick={onOpen}
                className='cursor-pointer p-1 -m-1 dark:hover:bg-gray-800 rounded max-w-max'
            >
                <div className=''>{children}</div>
            </PopoverTrigger>
            <PopoverContent
                contentEditable={false}
                className='flex min-w-[300px] flex-col gap-3 p-2'
            >
                <Tabs
                    isDisabled={loading}
                    onSelectionChange={(x) => setNamespace(x.toString())}
                    selectedKey={namespace}
                    className='w-full max-w-[300px]'
                >
                    {namespaces.map((ns) => {
                        return (
                            <Tab
                                onSelect={() => {
                                    setNamespace(ns)
                                }}
                                key={ns}
                                title={iconsMeta[ns]?.title || ns}
                            ></Tab>
                        )
                    })}
                </Tabs>
                <Input
                    size='sm'
                    ref={inputRef}
                    placeholder='search icons'
                    value={search}
                    onValueChange={setSearch}
                    startContent={
                        <MaterialSymbolsSearchRounded className='w-4' />
                    }
                />

                <div className='overflow-y-auto w-full h-[300px]'>
                    <div className='grid grid-cols-6 pr-2 justify-start items-start gap-1 '>
                        {icons.map((icon) => {
                            const sameIcon =
                                parsed.namespace === namespace &&
                                parsed.name === icon

                            const body =
                                allIcons?.icons?.icons?.[icon]?.body || ''
                            const h = allIcons?.icons?.height
                            const w = allIcons?.icons?.width
                            return (
                                <button
                                    key={icon}
                                    onClick={() => {
                                        onChange(
                                            iconUrl({
                                                name: icon,
                                                namespace,
                                            }),
                                        )
                                        onClose()
                                    }}
                                    className={clsx(
                                        'appearance-none shrink-0 w-9 h-9 flex flex-col p-1 rounded items-center justify-center gap-1 text-center',
                                        sameIcon &&
                                            'bg-gray-200 dark:bg-gray-700',
                                    )}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        // width='1em'
                                        // height='1em'
                                        viewBox={`0 0 ${h} ${w}`}
                                        dangerouslySetInnerHTML={{
                                            __html: body,
                                        }}
                                    />
                                </button>
                            )
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export function MaterialSymbolsSearchRounded(props) {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
            <path
                fill='currentColor'
                d='M9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16Zm0-2q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z'
            ></path>
        </svg>
    )
}

function LinkButton({ onChange, value }) {
    const [href, setHref] = useState(value)
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
    const { isOpen: dropdownOpen, onOpenChange: dropdownOpenChange } =
        useDisclosure()
    useEffect(() => {
        setHref(value)
    }, [isOpen])
    const [absUrl, setAbsUrl] = useState('')
    useEffect(() => {
        setAbsUrl(absoluteUrl(value))
    }, [value])
    return (
        <>
            <Dropdown
                backdrop='opaque' //
                shouldBlockScroll
                triggerScaleOnOpen={false}
                onClose={dropdownOpenChange}
                triggerType='menu'
                isOpen={dropdownOpen}
            >
                <DropdownTrigger
                    onClick={(e) => {
                        if (!value) {
                            e.preventDefault()
                            return
                        }
                        dropdownOpenChange()
                    }}
                >
                    <Button
                        isIconOnly
                        size='sm'
                        variant='ghost'
                        onClick={(e) => {
                            e.stopPropagation()
                            if (!value) {
                                onOpen()
                            }
                        }}
                        className='font-medium border-0 '
                    >
                        <MaterialSymbolsAddLink
                            className={clsx(
                                'w-5',
                                value
                                    ? 'dark:text-blue-200 font-bold'
                                    : 'opacity-70',
                            )}
                        />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label='Link Actions'>
                    <DropdownItem
                        onClick={(e) => {
                            e.stopPropagation()
                            onOpen()
                        }}
                        key='copy'
                    >
                        Edit Link
                    </DropdownItem>
                    <DropdownItem key='new'>
                        <a href={absUrl}>Go To Link</a>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Modal
                as='form'
                onSubmit={(e) => {
                    e.preventDefault()
                    onChange(href)
                    onClose()
                }}
                backdrop='opaque'
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    <ModalHeader className='flex flex-col gap-1'></ModalHeader>
                    <ModalBody className='space-y-3'>
                        <div className='flex flex-col gap-3'>
                            <div className=''>Card Link</div>
                            <Input
                                onValueChange={setHref}
                                autoFocus
                                aria-label='href'
                                placeholder='https://x.com'
                                value={href}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='primary' type='submit'>
                            {`Add Link`}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

function absoluteUrl(url: string) {
    if (!url) {
        return ''
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }
    if (url.startsWith('/')) {
        // find /editor path, use it as base
        const lastPath = '/editor'
        const editorPos = window.location.pathname.indexOf(lastPath)
        if (editorPos > -1) {
            const base = window.location.pathname.slice(0, editorPos)
            return `${window.location.origin}${base}${lastPath}${url}`
        }
        return `${window.location.origin}${url}`
    }
    if (url.startsWith('mailto:')) {
        return url
    }
    return new URL(url, window.location.href).toString()
}

export function IconamoonClose(props) {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            // width='1em'
            // height='1em'
            viewBox='0 0 24 24'
            {...props}
        >
            <path
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m7 7l10 10M7 17L17 7'
            ></path>
        </svg>
    )
}

export function MaterialSymbolsAddLink({ ...props }) {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            // width='1em'
            // height='1em'
            viewBox='0 0 24 24'
            {...props}
        >
            <path
                fill='currentColor'
                d='M17 20v-3h-3v-2h3v-3h2v3h3v2h-3v3h-2Zm-6-3H7q-2.075 0-3.538-1.463T2 12q0-2.075 1.463-3.538T7 7h4v2H7q-1.25 0-2.125.875T4 12q0 1.25.875 2.125T7 15h4v2Zm-3-4v-2h8v2H8Zm14-1h-2q0-1.25-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.463T22 12Z'
            ></path>
        </svg>
    )
}
