// Extended browser types for Firefox WebExtensions
declare namespace browser {
  namespace declarativeNetRequest {
    interface Rule {
      id: number
      priority?: number
      action: {
        type: 'block' | 'redirect' | 'allow' | 'upgradeScheme' | 'modifyHeaders'
        redirect?: {
          url?: string
          extensionPath?: string
          regexSubstitution?: string
        }
      }
      condition: {
        urlFilter?: string
        regexFilter?: string
        resourceTypes?: Array<'main_frame' | 'sub_frame' | 'stylesheet' | 'script' | 'image' | 'font' | 'object' | 'xmlhttprequest' | 'ping' | 'csp_report' | 'media' | 'websocket' | 'other'>
        initiatorDomains?: string[]
        excludedInitiatorDomains?: string[]
        requestDomains?: string[]
        excludedRequestDomains?: string[]
      }
    }

    function getDynamicRules(): Promise<Rule[]>
    function updateDynamicRules(options: {
      removeRuleIds?: number[]
      addRules?: Rule[]
    }): Promise<void>
  }
}
