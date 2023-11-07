import { Node, NodeViewProps } from '@tiptap/core'
import {
    NodeViewContent,
    NodeViewWrapper,
    ReactNodeViewRenderer,
} from '@tiptap/react'
import { MarkdownSerializerState } from 'prosemirror-markdown'
import { Node as PNode } from 'prosemirror-model'
import { Note, Tip, Warning, Check, Info } from './callout'
import { holocronExtensionTypes } from './constants'
import { Card } from './card'
import { CardGroup } from './card-group'
import { makeExtensionConfig } from './utils'
import { Button } from '@nextui-org/react'
import { Tabs } from './tabs'

const tagName = 'TabGroup'
export const TabGroupExtension = Node.create({
    name: holocronExtensionTypes.tabGroup,
    group: 'block',
    content: holocronExtensionTypes.tab + '+',
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
            <Tabs
                _additionalTabTitle={
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
                                    type: holocronExtensionTypes.card,
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
                        Add New Tab
                    </Button>
                }
            >
                <NodeViewContent />
            </Tabs>
        </NodeViewWrapper>
    )
}
