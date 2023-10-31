import { Button } from '@nextui-org/react'
import { Node, NodeViewProps } from '@tiptap/core'
import {
    NodeViewContent,
    NodeViewWrapper,
    ReactNodeViewRenderer,
} from '@tiptap/react'
import { HlcCardGroup } from './card-group'
import { componentsExtensionTypes } from './constants'
import { makeExtensionConfig } from './utils'

const tagName = 'HlcCardGroup'
export const CardGroupExtension = Node.create({
    name: componentsExtensionTypes.cardGroup,
    group: 'block',
    content: componentsExtensionTypes.card + '+',
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
            <HlcCardGroup cols={cols}>
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
                                    type: componentsExtensionTypes.card,
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
            </HlcCardGroup>
        </NodeViewWrapper>
    )
}
