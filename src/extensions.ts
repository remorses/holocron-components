import { CalloutExtension } from './callout.extension'
import { CardGroupExtension } from './card-group.extension'
import { CardExtension } from './card.extension'
import { holocronExtensionTypes } from './constants'
import { StepsExtension } from './steps.extension'
import { TabExtension } from './tab.extension'
import { TabGroupExtension } from './tabs-group.extension'

export const holocronComponentsExtensions = [
    CalloutExtension,
    CardExtension,
    CardGroupExtension,
    StepsExtension,
    // TabExtension,
    // TabGroupExtension,
]

const namespace = 'Holocron'
export const holocronTagsConfig: Record<
    string,
    { type: string; attributes: Record<string, { default?: any }> }
> = Object.fromEntries(
    holocronComponentsExtensions.map((ext) => {
        const type = ext.config.name
        const tagName = ext.config._tagName
        let attributes = ext.config?._attributes ?? {}

        return [`${namespace}.${tagName}`, { type, attributes }]
    }),
)

export const holocronComponentsImportSource = '@holocron.so/components'
