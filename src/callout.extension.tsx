import { Node, NodeViewProps } from '@tiptap/core'
import {
    NodeViewContent,
    NodeViewWrapper,
    ReactNodeViewRenderer,
} from '@tiptap/react'
import { MarkdownSerializerState } from 'prosemirror-markdown'
import { Node as PNode } from 'prosemirror-model'
import { Note, Tip, Warning, Check, Info, CalloutType, Callout } from './callout'
import { holocronExtensionTypes } from './constants'
import { makeExtensionConfig } from './utils'

const tagName = 'Callout'
export const CalloutExtension = Node.create({
    name: holocronExtensionTypes.callout,
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
