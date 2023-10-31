import { Node, NodeViewProps } from '@tiptap/core'
import {
    NodeViewContent,
    NodeViewWrapper,
    ReactNodeViewRenderer,
} from '@tiptap/react'
import { MarkdownSerializerState } from 'prosemirror-markdown'
import { Node as PNode } from 'prosemirror-model'
import { Note, Tip, Warning, Check, Info, HlcCalloutType, HlcCallout } from './callout'
import { componentsExtensionTypes } from './constants'
import { makeExtensionConfig } from './utils'

const tagName = 'HlcCallout'
export const CalloutExtension = Node.create({
    name: componentsExtensionTypes.jsxCallout,
    group: 'block',
    // like blockquote https://github.com/ueberdosis/tiptap/blob/252acb32d27a0f9af14813eeed83d8a50059a43a/packages/extension-blockquote/src/blockquote.ts#L38
    content: 'paragraph+',
    defining: true,
    ...makeExtensionConfig({
        tagName,
        attributes: {
            type: {
                default: 'note' satisfies HlcCalloutType,
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
            <HlcCallout type={type}>
                <NodeViewContent className='' />
            </HlcCallout>
        </NodeViewWrapper>
    )
}
