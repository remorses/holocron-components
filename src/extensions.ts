import { CalloutExtension } from './callout.extension'
import { CardGroupExtension } from './card-group.extension'
import { CardExtension } from './card.extension'
import { componentsExtensionTypes } from './constants'
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

export const holocronTagsConfig: Record<string, { type: string }> = {
    HlcCardGroup: {
        type: componentsExtensionTypes.jsxCardGroup,
    },
    HlcCard: {
        type: componentsExtensionTypes.jsxCard,
    },
    HlcCallout: {
        type: componentsExtensionTypes.jsxCallout,
    },
    HlcSteps: {
        type: componentsExtensionTypes.jsxStepsGroup,
    },
    // Tabs: {
    //     type: componentsExtensionTypes.jsxTabGroup,
    // },
    // Tab: {
    //     type: componentsExtensionTypes.jsxTab,
    // },
}

export const holocronComponentsImportSource = '@holocron.so/components'
