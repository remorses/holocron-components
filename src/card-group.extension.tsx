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
import { makeExtensionConfig } from './utils'
import { Button } from '@nextui-org/react'

const tagName = 'CardGroup'
export const CardGroupExtension = Node.create({
    name: componentsExtensionTypes.jsxCardGroup,
    group: 'block',
    content: componentsExtensionTypes.jsxCard + '+',
    // defining: true,
    ...makeExtensionConfig({
        tagName,
        attributes: {
            cols: {
                default: 2,
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
    selected,
    updateAttributes,
}: NodeViewProps) {
    const cols = Number(node.attrs.cols) || (2 as any)

    return (
        <NodeViewWrapper>
            <CardGroup cols={cols}>
                <NodeViewContent />
                <div className='flex col-span-full p-4 w-full h-full flex-col items-center justify-center'>
                    <Button
                        size='sm'
                        variant='ghost'
                        className='border-0'
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
                    >
                        Add New Card
                    </Button>
                </div>
            </CardGroup>
        </NodeViewWrapper>
    )
}
