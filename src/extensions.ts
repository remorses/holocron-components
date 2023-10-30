import { CalloutExtension } from './callout.extension'
import { CardGroupExtension } from './card-group.extension'
import { CardExtension } from './card.extension'
import { componentsExtensionTypes } from './constants'

export const holocronComponentsExtensions = [
    CalloutExtension,
    CardExtension,
    CardGroupExtension,
]

export const tagsConfig: Record<string, { type: string }> = {
    CardGroup: {
        type: componentsExtensionTypes.jsxCardGroup,
    },
    Card: {
        type: componentsExtensionTypes.jsxCard,
    },
    Callout: {
        type: componentsExtensionTypes.jsxCallout,
    },
}
