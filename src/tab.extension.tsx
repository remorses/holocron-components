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
import { componentsExtensionTypes } from './constants'
import { HlcCard } from './card'
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
import { HlcTab } from './tabs'
import { makeExtensionConfig } from './utils'

const inputClass = 'tab-title-input'

const tagName = 'HlcTab'
export const TabExtension = Node.create({
    name: componentsExtensionTypes.jsxTab,
    group: 'block',
    content: 'paragraph+',
    defining: true,
    ...makeExtensionConfig({
        tagName,
        attributes: {
            title: {
                default: 'Title',
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
            <HlcTab
                className='group relative non-draggable'
                title={
                    <div className='relative'>
                        <input
                            contentEditable={true}
                            className={clsx(
                                'appearance-none focus:outline-none not-prose bg-transparent w-full',
                                inputClass,
                            )}
                            value={node.attrs.title}
                            ref={inputRef}
                            onKeyDown={(e) => {
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
                        <div
                            contentEditable={false}
                            className='absolute group-hover:flex hidden right-2 gap-2'
                        >
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
                                        componentsExtensionTypes.jsxTabGroup
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
                    </div>
                }
            >
                <NodeViewContent className='' />
            </HlcTab>
        </NodeViewWrapper>
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
