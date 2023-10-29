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

export const CardExtension = Node.create({
    name: componentsExtensionTypes.jsxCard,
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
            title: {
                default: 'Title',
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
                    state.write(`<Card type="${node.attrs.type}">`)
                    state.ensureNewLine()
                    state.wrapBlock('    ', null, node, () =>
                        state.renderContent(node),
                    )
                    state.write(`</Card>`)
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
            <Card
                title={
                    <input
                        className='appearance-none focus:outline-none not-prose bg-transparent w-full'
                        value={node.attrs.title}
                        autoFocus
                        onChange={(e) =>
                            updateAttributes({ title: e.target.value })
                        }
                    />
                }
            >
                <NodeViewContent className='' />
            </Card>
        </NodeViewWrapper>
    )
}
