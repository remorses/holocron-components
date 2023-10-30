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
import { makeExtensionConfig } from './utils'

const classes = ['note', 'warning', 'info', 'tip', 'check'] as const

type CalloutType = (typeof classes)[number]

export function Callout({ type = 'note' as CalloutType, children }) {
    if (type === 'warning') {
        return <Warning>{children}</Warning>
    }
    if (type === 'note') {
        return <Note>{children}</Note>
    }
    if (type === 'info') {
        return <Info>{children}</Info>
    }
    if (type === 'tip') {
        return <Tip>{children}</Tip>
    }
    if (type === 'check') {
        return <Check>{children}</Check>
    }
    return <Info>{children}</Info>
}

const tagName = 'Callout'
export const CalloutExtension = Node.create({
    name: componentsExtensionTypes.jsxCallout,
    group: 'block',
    // like blockquote https://github.com/ueberdosis/tiptap/blob/252acb32d27a0f9af14813eeed83d8a50059a43a/packages/extension-blockquote/src/blockquote.ts#L38
    content: 'paragraph+',
    defining: true,
    ...makeExtensionConfig({
        tagName,
        attributes: {
            type: {
                default: 'note' satisfies CalloutType,
            },
        },
    }),
    addNodeView() {
        return ReactNodeViewRenderer(Component)
    },
})

function Component({ node, updateAttributes }: NodeViewProps) {
    const type = node.attrs.type

    return (
        <NodeViewWrapper>
            <Callout type={type}>
                <NodeViewContent className='' />
            </Callout>
        </NodeViewWrapper>
    )
}
