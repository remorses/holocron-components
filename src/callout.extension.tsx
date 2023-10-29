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

const classes = ['note', 'warning', 'info', 'tip', 'check']

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

export const CalloutExtension = Node.create({
    name: componentsExtensionTypes.jsxCallout,
    group: 'block',
    content: 'block*',
    defining: true,

    parseHTML() {
        return [
            {
                tag: this.name,
            },
        ]
    },
    renderHTML({ HTMLAttributes, node }) {
        return [this.name, HTMLAttributes, 0]
    },

    addAttributes() {
        return {
            type: {
                default: 'note',
            },
        }
    },
    addNodeView() {
        return ReactNodeViewRenderer(Component)
    },
    addStorage() {
        return {
            markdown: {
                serialize(state: MarkdownSerializerState, node: PNode) {
                    state.write(`<Callout type="${node.attrs.type}">`)
                    state.ensureNewLine()
                    state.wrapBlock('    ', null, node, () =>
                        state.renderContent(node),
                    )
                    state.write(`</Callout>`)
                    state.ensureNewLine()
                },
            },
        }
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
