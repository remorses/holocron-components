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
import { CardGroup } from './card-group'

export const CardGroupExtension = Node.create({
    name: componentsExtensionTypes.jsxCardGroup,
    group: 'block',
    content: componentsExtensionTypes.jsxCard + '+',
    // defining: true,

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
            cols: {
                default: 2,
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
                    state.write(`<CardGroup cols="${node.attrs.cols}">`)
                    state.ensureNewLine()
                    state.wrapBlock('    ', null, node, () =>
                        state.renderContent(node),
                    )
                    state.write(`</CardGroup>`)
                    state.ensureNewLine()
                },
            },
        }
    },
})

function Component({
    node,
    getPos,
    editor,
    selected,
    updateAttributes,
}: NodeViewProps) {
    const cols = Number(node.attrs.cols) || (2 as any)

    return (
        <NodeViewWrapper>
            <CardGroup cols={cols}>
                <NodeViewContent />
                <Card
                    className='cursor-pointer dark:bg-gray-850'
                    icon={''}

                    onClick={() => {
                        const pos = getPos() + 1
                        // get end position of last block

                        editor
                            .chain()
                            .focus(pos)
                            .insertContent({
                                type: componentsExtensionTypes.jsxCard,
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            //
                                        ],
                                    },
                                ],
                            })
                            .run()
                    }}
                    title='Add New Card'
                />
            </CardGroup>
        </NodeViewWrapper>
    )
}
