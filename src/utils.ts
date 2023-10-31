import { Attributes, NodeConfig, findParentNode } from '@tiptap/core'
import { Node as PNode } from 'prosemirror-model'

import { MarkdownSerializerState } from 'prosemirror-markdown'

export function makeExtensionConfig({
    tagName,
    importSource,
    attributes,
}: {
    tagName: string
    importSource?: string
    attributes: Record<string, { default?: any }>
}) {
    const defaultExtensionStuff: Partial<NodeConfig> = {
        parseHTML() {
            return [
                {
                    tag: this.name,
                },
            ]
        },
        addAttributes() {
            return attributes
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
                                const serialized = (() => {
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

                                    return v
                                })()
                                return `${attr}=${serialized}`
                            })
                            .join(' ')
                        if (node.attrs._additionalProps) {
                            props += ' ' + node.attrs._additionalProps
                        }
                        state.write(`<${tagName} ${props}>`)
                        state.ensureNewLine()
                        state.wrapBlock('    ', null, node, () =>
                            state.renderContent(node),
                        )
                        // flushClose(1) prevents write() from adding a \n if previous block is closed
                        // @ts-ignore
                        state.flushClose(1)
                        state.write(`</${tagName}>\n`)
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
