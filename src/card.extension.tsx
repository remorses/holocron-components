import { Node, NodeViewProps } from '@tiptap/core'
import {
    NodeViewContent,
    NodeViewWrapper,
    ReactNodeViewRenderer,
} from '@tiptap/react'
import { MarkdownSerializerState } from 'prosemirror-markdown'
import { Node as PNode } from 'prosemirror-model'
import { Note, Tip, Warning, Check, Info } from './callout'
import { componentsExtensionTypes } from './constants'
import { Card } from './card'
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Popover,
    PopoverContent,
    PopoverTrigger,
    useDisclosure,
} from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

const inputClass = 'card-title-input'

const tagName = 'Card'
export const CardExtension = Node.create({
    name: componentsExtensionTypes.jsxCard,
    group: 'block',
    content: 'paragraph*',
    defining: true,
    ...makeExtensionConfig({
        tagName,
        attributes: {
            icon: {
                default: '',
            },
            title: {
                default: '',
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
    const found = feather.icons[icon] || feather.icons['alert-circle']
    const inputRef = useRef<HTMLInputElement>(null)
    return (
        <NodeViewWrapper>
            <Card
                className='relative non-draggable'
                icon='https://em-content.zobj.net/source/apple/354/fire_1f525.png'
                _iconElement={
                    <IconPicker
                        value={icon}
                        onChange={(icon) => {
                            updateAttributes({ icon })
                        }}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: found?.toSvg() || '',
                            }}
                        />
                    </IconPicker>
                }
                title={
                    <input
                        contentEditable={true}
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
                    className='absolute top-3 right-4 flex gap-2'
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
                        onClick={deleteNode}
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
import feather from 'feather-icons'
import { makeExtensionConfig } from './utils'

const allIcons = Object.values(feather.icons)

function IconPicker({ children, value, onChange }) {
    const [search, setSearch] = useState('')
    let icons = allIcons.filter((icon) => {
        if (!search) {
            return true
        }
        return icon.name.includes(search)
    })
    const inputRef = useRef<any>(null)

    return (
        <Popover
            contentEditable={false}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setSearch('')
                }
                if (isOpen) {
                    setTimeout(() => inputRef.current?.focus(), 10)
                }
            }}
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
                className='cursor-pointer p-1 -m-1 dark:hover:bg-gray-800 rounded max-w-max'
            >
                {children}
            </PopoverTrigger>
            <PopoverContent
                contentEditable={false}
                className='flex min-w-[300px] flex-col gap-3 p-2'
            >
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
                            return (
                                <button
                                    key={icon.name}
                                    onClick={() => {
                                        onChange(icon.name)
                                    }}
                                    className={clsx(
                                        'appearance-none flex flex-col p-1 rounded items-center justify-center gap-1 text-center',
                                        value === icon.name &&
                                            'bg-gray-200 dark:bg-gray-700',
                                    )}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: icon.toSvg(),
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
    useEffect(() => {
        setHref(value)
    }, [isOpen])
    return (
        <>
            <Button
                isIconOnly
                size='sm'
                variant='ghost'
                onClick={(e) => {
                    e.stopPropagation()
                    onOpen()
                }}
                className='font-medium border-0 '
            >
                <MaterialSymbolsAddLink
                    className={clsx(
                        'w-5',
                        value ? 'dark:text-blue-200 font-bold' : 'opacity-70',
                    )}
                />
            </Button>
            <Modal
                as='form'
                onSubmit={(e) => {
                    e.preventDefault()
                    onChange(href)
                    onClose()
                }}
                // onClose={() => {
                //     onClose()
                //     setHref(value)
                // }}
                backdrop='blur'
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    <ModalHeader className='flex flex-col gap-1'></ModalHeader>
                    <ModalBody className='space-y-3'>
                        <div className='flex flex-col gap-3'>
                            <div className=''>Page path</div>
                            <Input
                                onValueChange={setHref}
                                // isRequired
                                autoFocus
                                aria-label='href'
                                placeholder='https://x.com'
                                value={href}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button
                            color='danger'
                            variant='light'
                            type='button'
                            onPress={onClose}
                        >
                            Cancel
                        </Button> */}
                        <Button color='primary' type='submit'>
                            {`Add Link`}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
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
