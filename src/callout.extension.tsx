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
    let IconComponent = Callout.icons[type]

    return (
        <NodeViewWrapper
            className={clsx(
                'relative my-8 flex flex-col gap-2 rounded p-6 pt-2',
                Callout.styles[type]?.container,
            )}
        >
            <div contentEditable={false} className='flex'>
                <div className='grow'></div>
                <SimpleSelect.Container className=''>
                    <SimpleSelect.Select
                        value={type}
                        // defaultValue={defaultLanguage}
                        onChange={(event) =>
                            updateAttributes({ type: event.target.value })
                        }
                    >
                        {Object.keys(Callout.styles).map((t, index) => (
                            <option key={index} value={t}>
                                {t}
                            </option>
                        ))}
                    </SimpleSelect.Select>
                    <SimpleSelect.Icon />
                </SimpleSelect.Container>
            </div>
            <div className='flex items-center'>
                <IconComponent
                    contentEditable={false}
                    className='h-8 w-8 flex-none'
                />
                <div className='ml-4 max-w-max flex-auto'>
                    <NodeViewContent
                        className={clsx('', Callout.styles[type].body)}
                    />
                </div>
            </div>
        </NodeViewWrapper>
    )
}
