<h1 align="center">
 <img src="./public/icon.png" alt="Plugin icon" width="100px" /> 
 <p>SVG to React / Native / SolidJS</p>
</h1>

A Figma plugin that lets you easily optimize and transform multiple SVG files into JSX components.

**Get the plugin [here](https://www.figma.com/community/plugin/1139659790182545298)**

![Plugin banner](./public/banner.png)

### Table of Contents
- [Features](#features)
- [Usage](#usage)
- [Made with](#made-with)
- [Todo](#todo)
- [Credits](#credits)

## Features
- Optimizes and transforms SVGs into framework-specific components for [React](https://react.dev/), [React Native](https://reactnative.dev/), and [SolidJS](https://www.solidjs.com/)
- Utilizes [SVGO](https://svgo.dev/) to optimize SVGs
- Formats code using [Prettier](https://prettier.io/)
- Allows batch transformation of multiple SVGs at once
- Provides various options for SVG transformation

## Usage
1. Select at least one node (any item that figma can export).
2. Run the "SVG to React/Native/SolidJS" plugin.
3. Open the tab for your desired framework (default: React).
4. Adjust options to your preference.
5. "Save all SVGs as files" or open individual SVGs to copy/save.

## Made with
- [pnpm](https://pnpm.io/)
- [turborepo](https://turbo.build/repo/docs)
- [biomejs](https://biomejs.dev/)
- [vite](https://vite.dev/)
- [vitest](https://vitest.dev/)
- [typescript](https://www.typescriptlang.org/)
- [solidjs](https://www.solidjs.com/)
- [tailwindcss](https://tailwindcss.com/)

## TODO
- Add more images
- Configurable Prettier settings per framework
- Customizable SVGO plugin settings

## Credits
- [SaraVieira/svg-to-jsx](https://github.com/SaraVieira/svg-to-jsx)
- [gregberge/svgr](https://github.com/gregberge/svgr)
- [svg/svgo](https://github.com/svg/svgo)
