import { Attributes, NodeConfig, findParentNode } from '@tiptap/core'
import { Node as PNode } from 'prosemirror-model'

import { MarkdownSerializerState } from 'prosemirror-markdown'

export function makeExtensionConfig({
    tagName,
    namespace = 'Holocron',
    attributes,
}: {
    tagName: string
    namespace?: string
    attributes: Record<string, { default?: any }>
}) {
    const defaultExtensionStuff: Partial<NodeConfig> = {
        _tagName: tagName,
        _attributes: attributes,
        parseHTML() {
            return [
                {
                    tag: this.name,
                },
            ]
        },
        addAttributes() {
            return { ...attributes, _additionalProps: { default: '' } }
        },
        renderHTML({ HTMLAttributes, node }) {
            return [this.name, HTMLAttributes, 0]
        },
        addStorage() {
            const attrs = Object.keys(attributes)
            return {
                markdown: {
                    serialize(state: MarkdownSerializerState, node: PNode) {
                        let props = attrs
                            .map((attr) => {
                                const config = attributes[attr]
                                const v =
                                    node.attrs[attr] ?? config.default ?? null
                                if (v === true) {
                                    return attr
                                }
                                const serialized = serializePropValue(v)
                                return `${attr}=${serialized}`
                            })
                            .join(' ')
                        if (node.attrs._additionalProps) {
                            props += ' ' + node.attrs._additionalProps
                        }
                        state.write(`<${namespace}.${tagName} ${props}>`)
                        state.ensureNewLine()
                        state.wrapBlock('    ', null, node, () =>
                            state.renderContent(node),
                        )
                        // flushClose(1) prevents write() from adding a \n if previous block is closed
                        // @ts-ignore
                        state.flushClose(1)
                        state.write(`</${namespace}.${tagName}>\n`)
                        if (!state['delim']) {
                            state.write('\n')
                        }
                    },
                },
            }
        },
    }
    return defaultExtensionStuff
}

export function serializePropValue(v) {
    if (typeof v === 'string') {
        return JSON.stringify(v)
    }
    if (typeof v === 'number') {
        return `{${v}}`
    }
    if (typeof v === 'boolean') {
        return v ? '{true}' : '{false}'
    }
    if (v === null) {
        return '{null}'
    }
    if (v === undefined) {
        return '{undefined}'
    }
    console.warn('WARNING unknown prop value type', v)
    return `{${v}}`
}
