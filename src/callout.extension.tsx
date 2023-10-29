import { Editor, Node, NodeViewProps, mergeAttributes } from '@tiptap/core'
import { Node as PNode } from 'prosemirror-model'
import { MarkdownSerializerState } from 'prosemirror-markdown'
import {
    NodeViewContent,
    NodeViewWrapper,
    ReactNodeViewRenderer,
} from '@tiptap/react'
import clsx from 'clsx'
import { Callout } from './callout'
import { SimpleSelect } from './SimpleSelect'
import { componentsExtensionTypes } from './constants'

const classes = ['note', 'warning']

type CalloutType = (typeof classes)[number]

export const CalloutExtension = Node.create({
    name: componentsExtensionTypes.jsxCallout,

    group: 'block',

    content: 'block*',
    defining: true,

    // draggable: true,

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
    // renderHTML({ HTMLAttributes, node }) {
    //     return ['callout', mergeAttributes(HTMLAttributes, node.attrs), 0]
    // },

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
            <Callout type={type} children={<NodeViewContent />} />
        </NodeViewWrapper>
    )
}
