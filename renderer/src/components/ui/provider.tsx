import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react"

const config = defineConfig({
  globalCss: {
    html: {
      scrollbar: 'hidden',
      // colorPalette: 'pink'
    },
  },
})

const system = createSystem(defaultConfig, config)

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
