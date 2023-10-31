<div align='center'>
    <br/>
    <br/>
    <br/>
    <h3>@holocron.so/components</h3>
    <p>Components for your MDX files</p>
    <p>Visually editable with Holocron WYSIWYG editor</p>
    <br/>
    <br/>
</div>

## Install

```sh
npm install @holocron.so/components
```

## Usage with tailwind

```js
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        // ...
        './node_modules/@holocron.so/components/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    darkMode: 'class',
}

export default config
```

## Usage without Tailwind

```js
import '@holocron.so/components/styles.css'
```

## Using the components in MDX

```mdx
import { HlcCallout } from '@holocron.so/components'

# MDX file

<HlcCallout type='info'>This is a callout</HlcCallout>
```

> You can also expose the components globally in your MDX files for easier access

## Why the `Hlc` prefix?

`Hlc` stands for Holocron, it's a prefix used to avoid collisions with other MDX components.

The Holocron editor automatically detects the components with this prefix and allows you to edit your MDX files visually in a WYSIWYG editor.

Having a common prefix also makes it easier to browse available components with the TypeScript auto-import feature.