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
import { Steps } from './steps'

const tagName = 'Steps'
export const StepsExtension = Node.create({
    name: holocronExtensionTypes.stepsGroup,
    group: 'block',
    content: 'block+',
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
    return (
        <NodeViewWrapper>
            <Steps>
                <NodeViewContent />
            </Steps>
        </NodeViewWrapper>
    )
}
