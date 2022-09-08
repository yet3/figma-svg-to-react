# Figma Plugin: SVG to React
![GitHub license](https://img.shields.io/github/license/yet3/figma-svg-to-react?style=flat)

Figma plugin that allows you to generate react components from selected nodes.
<br>
[Plugin page](https://www.figma.com/community/plugin/1139659790182545298)

![Banner](./public/banner.png)

### Features
- Generate multiple react components at once
- Save each one or all as files
- Set custom component and file name for each react component
- Options
  - Typescript
  - With props
  - Props interface
  - Include: import * as React
  - With viewbox
  - Icon (width, height = 1em)
  - Named export
  - ForwardRef
  - For react native
- Uses [svgr](https://react-svgr.com/)

### How to use
1. Select elements you want to transform
2. Run "SVG to React" plugin
3. Adjust options to your liking
4. Copy/Save react components

### File structure
|   **PATH**  |                               **INFO**                               |
|-------------|----------------------------------------------------------------------|
| plugin-src/ | Figma's plugin main thread                                           |
| ui-src/     | Frontend made using react                                            |
| api/        | Plugin's api responsible for transforming svgs to react components   |
| shared/     | All code that is shared between ui/plugin/api                        |

### Inspired by
[SaraVieira/svg-to-jsx](https://github.com/SaraVieira/svg-to-jsx)
