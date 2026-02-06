declare module 'bootstrap' {
  export class Tooltip {
    constructor(element: Element, options?: Partial<Tooltip.Options>)
    show(): void
    hide(): void
    toggle(): void
    dispose(): void
    enable(): void
    disable(): void
    toggleEnabled(): void
    update(): void
  }

  namespace Tooltip {
    interface Options {
      animation: boolean
      container: string | Element | false
      delay: number | { show: number; hide: number }
      html: boolean
      placement: 'auto' | 'top' | 'bottom' | 'left' | 'right'
      selector: string | false
      template: string
      title: string | Element | (() => string | Element)
      trigger: 'click' | 'hover' | 'focus' | 'manual' | string
      offset: [number, number] | string
      fallbackPlacements: string[]
      boundary: string | Element
      customClass: string | (() => string)
      sanitize: boolean
      allowList: Record<string, string[]>
      sanitizeFn: ((input: string) => string) | null
      popperConfig: object | (() => object) | null
    }
  }

  export class Popover {
    constructor(element: Element, options?: Partial<Popover.Options>)
    show(): void
    hide(): void
    toggle(): void
    dispose(): void
    enable(): void
    disable(): void
    toggleEnabled(): void
    update(): void
  }

  namespace Popover {
    interface Options {
      animation: boolean
      container: string | Element | false
      content: string | Element | (() => string | Element)
      delay: number | { show: number; hide: number }
      html: boolean
      placement: 'auto' | 'top' | 'bottom' | 'left' | 'right'
      selector: string | false
      template: string
      title: string | Element | (() => string | Element)
      trigger: 'click' | 'hover' | 'focus' | 'manual' | string
      offset: [number, number] | string
      fallbackPlacements: string[]
      boundary: string | Element
      customClass: string | (() => string)
      sanitize: boolean
      allowList: Record<string, string[]>
      sanitizeFn: ((input: string) => string) | null
      popperConfig: object | (() => object) | null
    }
  }
}
