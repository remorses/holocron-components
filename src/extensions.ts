import { CalloutExtension } from './callout.extension'
import { CardGroupExtension } from './card-group.extension'
import { CardExtension } from './card.extension'
import { componentsExtensionTypes } from './constants'
import { StepsExtension } from './steps.extension'

export const holocronComponentsExtensions = [
    CalloutExtension,
    CardExtension,
    CardGroupExtension,
    StepsExtension,
]

export const holocronTagsConfig: Record<string, { type: string }> = {
    CardGroup: {
        type: componentsExtensionTypes.jsxCardGroup,
    },
    Card: {
        type: componentsExtensionTypes.jsxCard,
    },
    Callout: {
        type: componentsExtensionTypes.jsxCallout,
    },
    Steps: {
        type: componentsExtensionTypes.jsxStepsGroup,
    },
}

export const holocronComponentsImportSource = '@holocron.so/components'
