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
import { HlcCard } from './card'
import { HlcCardGroup } from './card-group'
import { makeExtensionConfig } from './utils'
import { Button } from '@nextui-org/react'
import { HlcSteps } from './steps'

const tagName = 'HlcSteps'
export const StepsExtension = Node.create({
    name: componentsExtensionTypes.jsxStepsGroup,
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
            <HlcSteps>
                <NodeViewContent />
            </HlcSteps>
        </NodeViewWrapper>
    )
}
