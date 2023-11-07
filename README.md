<div align='center'>
    <br/>
    <br/>
    <br/>
    <h3>@holocron.so/components</h3>
    <p>Components for your MDX files, visually editable with Holocron WYSIWYG editor</p>
    <p>Still experimental, do not use</p>
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

First add the `Holocron` namespace to your MDX components

```ts
// mdx-components.jsx
import '@holocron.so/components/styles.css'

import * as Holocron from '@holocron.so/components/src'

export function useMDXComponents(components) {
    return {
        ...components,
        Holocron,
    }
}
```

```mdx
# MDX file

<Holocron.Callout type='info'>

This is a callout

</Holocron.Callout>
```

> You can also expose the components globally in your MDX files for easier access

## Why the `Holocron` namespace?

The Holocron editor automatically detects the components with the `Holocron` namespace and allows you to edit your MDX files visually in a WYSIWYG editor.
