import type { ToolbarSettings } from '../index.js'

import { OUTPUT_DETAIL_OPTIONS } from '../../../utils/generate-output.js'
import { HelpTooltip } from '../../help-tooltip/index.js'
import { IconChevronLeft, IconMoon, IconSun } from '../../icons/index.js'
import { Switch } from '../../ui/switch/index.js'
import { COLOR_OPTIONS } from '../index.js'
import { CheckboxField } from './checkbox-field/index.js'
import styles from './styles.module.scss'

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'

export type SettingsPanelProps = {
  connectionStatus: ConnectionStatus
  endpoint?: string

  isDarkMode: boolean
  isDevMode: boolean

  /** Whether the panel is mounted (controls enter/exit class) */
  isVisible: boolean

  onHideToolbar: () => void
  onSettingsChange: (patch: Partial<ToolbarSettings>) => void

  onSettingsPageChange: (page: 'automations' | 'main') => void

  onToggleTheme: () => void

  settings: ToolbarSettings
  settingsPage: 'automations' | 'main'

  /** Position override: show panel above toolbar when toolbar is near bottom */
  toolbarNearBottom: boolean
}

export function SettingsPanel({
  connectionStatus,
  endpoint,
  isDarkMode,
  isDevMode,
  isVisible,
  onHideToolbar,
  onSettingsChange,
  onSettingsPageChange,
  onToggleTheme,
  settings,
  settingsPage,
  toolbarNearBottom,
}: SettingsPanelProps) {
  return (
    <div
      className={`${styles.settingsPanel} ${isVisible ? styles.enter : styles.exit}`}
      data-agentation-settings-panel
      style={toolbarNearBottom ? { bottom: 'auto', top: 'calc(100% + 0.5rem)' } : undefined}
    >
      <div className={styles.settingsPanelContainer}>
        {/* ── Main page ── */}
        <div
          className={`${styles.settingsPage} ${settingsPage === 'automations' ? styles.slideLeft : ''}`}
        >
          <div className={styles.settingsHeader}>
            <a
              className={styles.settingsBrand}
              href="https://omaroubari.com"
              rel="noopener noreferrer"
              style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
                gap: '1ch',
              }}
              target="_blank"
            >
              <svg height="16" viewBox="0 0 25 25" width="16" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m11.867 21.234-7.458-4.25a.3.3 0 0 1-.15-.256v-6.567c0-.113.126-.185.223-.131l8.658 4.934a.18.18 0 0 0 .272-.155v-3.2a.36.36 0 0 0-.181-.31L2.816 5.364a.3.3 0 0 0-.301 0l-1.364.78A.3.3 0 0 0 1 6.4v12.2a.3.3 0 0 0 .15.256l10.7 6.102c.09.054.21.054.3 0l8.986-5.125a.178.178 0 0 0 0-.31l-2.8-1.597a.36.36 0 0 0-.362 0l-5.799 3.308a.3.3 0 0 1-.302 0zM22.85 6.138 12.15.042a.3.3 0 0 0-.3 0L6.194 3.266a.178.178 0 0 0 0 .31L8.971 5.16a.36.36 0 0 0 .362 0l2.534-1.442a.3.3 0 0 1 .302 0l7.458 4.249a.3.3 0 0 1 .15.256v6.597c0 .125.067.245.182.31l2.776 1.58a.18.18 0 0 0 .271-.156V6.4a.3.3 0 0 0-.15-.256z"
                  fill="currentColor"
                />
              </svg>
              Visual Editor
            </a>
            <p className={styles.settingsVersion}>v0.0.1</p>
            <button
              className={styles.themeToggle}
              onClick={onToggleTheme}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className={styles.themeIconWrapper}>
                <span className={styles.themeIcon} key={isDarkMode ? 'sun' : 'moon'}>
                  {isDarkMode ? <IconSun size={20} /> : <IconMoon size={20} />}
                </span>
              </span>
            </button>
          </div>

          <div className={styles.divider}></div>

          {/* Output detail + React toggle */}
          <div className={styles.settingsSection}>
            <div className={styles.settingsRow}>
              <div className={styles.settingsLabel}>
                Output Detail
                <HelpTooltip content="Controls how much detail is included in the copied output" />
              </div>
              <button
                className={styles.cycleButton}
                onClick={() => {
                  const currentIndex = OUTPUT_DETAIL_OPTIONS.findIndex(
                    (opt) => opt.value === settings.outputDetail,
                  )
                  const nextIndex = (currentIndex + 1) % OUTPUT_DETAIL_OPTIONS.length
                  onSettingsChange({
                    outputDetail: OUTPUT_DETAIL_OPTIONS[nextIndex].value,
                  })
                }}
              >
                <span className={styles.cycleButtonText} key={settings.outputDetail}>
                  {OUTPUT_DETAIL_OPTIONS.find((opt) => opt.value === settings.outputDetail)?.label}
                </span>
                <span className={styles.cycleDots}>
                  {OUTPUT_DETAIL_OPTIONS.map((option) => (
                    <span
                      className={`${styles.cycleDot} ${settings.outputDetail === option.value ? styles.active : ''}`}
                      key={option.value}
                    />
                  ))}
                </span>
              </button>
            </div>

            <div
              className={`${styles.settingsRow} ${styles.settingsRowMarginTop} ${!isDevMode ? styles.settingsRowDisabled : ''}`}
            >
              <div className={styles.settingsLabel}>
                React Components
                <HelpTooltip
                  content={
                    !isDevMode
                      ? 'Disabled — production builds minify component names, making detection unreliable. Use in development mode.'
                      : 'Include React component names in annotations'
                  }
                />
              </div>
              <Switch
                checked={isDevMode && settings.reactEnabled}
                disabled={!isDevMode}
                onChange={(e) => onSettingsChange({ reactEnabled: e.target.checked })}
              />
            </div>

            <div className={`${styles.settingsRow} ${styles.settingsRowMarginTop}`}>
              <div className={styles.settingsLabel}>
                Hide Until Restart
                <HelpTooltip content="Hides the toolbar until you open a new tab" />
              </div>
              <Switch
                checked={false}
                onChange={(e) => {
                  if (e.target.checked) {
                    onHideToolbar()
                  }
                }}
              />
            </div>
          </div>

          <div className={styles.divider}></div>

          {/* Color picker */}
          <div className={styles.settingsSection}>
            <div className={`${styles.settingsLabel} ${styles.settingsLabelMarker}`}>
              Marker Color
            </div>
            <div className={styles.colorOptions}>
              {COLOR_OPTIONS.map((color) => (
                <button
                  className={`${styles.colorOption} ${settings.annotationColorId === color.id ? styles.selected : ''}`}
                  key={color.id}
                  onClick={() => onSettingsChange({ annotationColorId: color.id })}
                  style={
                    {
                      '--swatch': color.srgb,
                      '--swatch-p3': color.p3,
                    } as React.CSSProperties
                  }
                  title={color.label}
                  type="button"
                ></button>
              ))}
            </div>
          </div>

          <div className={styles.divider}></div>

          {/* Checkboxes */}
          <div className={styles.settingsSection}>
            <CheckboxField
              checked={settings.autoClearAfterCopy}
              className="checkbox-field"
              label="Clear on copy/send"
              onChange={(e) => onSettingsChange({ autoClearAfterCopy: e.target.checked })}
              tooltip="Automatically clear annotations after copying"
            />
            <CheckboxField
              checked={settings.blockInteractions}
              className={styles.checkboxField}
              label="Block page interactions"
              onChange={(e) => onSettingsChange({ blockInteractions: e.target.checked })}
            />
          </div>

          <div className={styles.divider} />

          {/* Nav to automations */}
          <button
            className={styles.settingsNavLink}
            onClick={() => onSettingsPageChange('automations')}
            type="button"
          >
            <span>Manage MCP & Webhooks</span>
            <span className={styles.settingsNavLinkRight}>
              {endpoint && connectionStatus !== 'disconnected' && (
                <span className={`${styles.mcpNavIndicator} ${styles[connectionStatus]}`} />
              )}
              <svg
                fill="none"
                height="16"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 12.5L12 8L7.5 3.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* ── Automations page ── */}
        <div
          className={`${styles.settingsPage} ${styles.automationsPage} ${settingsPage === 'automations' ? styles.slideIn : ''}`}
        >
          <button
            className={styles.settingsBackButton}
            onClick={() => onSettingsPageChange('main')}
            type="button"
          >
            <IconChevronLeft size={16} />
            <span>Manage MCP & Webhooks</span>
          </button>

          <div className={styles.divider}></div>

          {/* MCP section */}
          <div className={styles.settingsSection}>
            <div className={styles.settingsRow}>
              <span className={styles.automationHeader}>
                MCP Connection
                <HelpTooltip content="Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time." />
              </span>
              {endpoint && (
                <div
                  className={`${styles.mcpStatusDot} ${styles[connectionStatus]}`}
                  title={
                    connectionStatus === 'connected'
                      ? 'Connected'
                      : connectionStatus === 'connecting'
                        ? 'Connecting...'
                        : 'Disconnected'
                  }
                />
              )}
            </div>
            <p className={styles.automationDescription} style={{ paddingBottom: 6 }}>
              MCP connection allows agents to receive and act on annotations.{' '}
              <a
                className={styles.learnMoreLink}
                href="https://agentation.dev/mcp"
                rel="noopener noreferrer"
                target="_blank"
              >
                Learn more
              </a>
            </p>
          </div>

          <div className={styles.divider}></div>

          {/* Webhooks section */}
          <div className={`${styles.settingsSection} ${styles.settingsSectionGrow}`}>
            <div className={styles.settingsRow}>
              <span className={styles.automationHeader}>
                Webhooks
                <HelpTooltip content="Send annotation data to any URL endpoint when annotations change. Useful for custom integrations." />
              </span>
              <div className={styles.autoSendContainer}>
                <label
                  className={`${styles.autoSendLabel} ${settings.webhooksEnabled ? styles.active : ''} ${!settings.webhookUrl ? styles.disabled : ''}`}
                  htmlFor="agentation-auto-send"
                >
                  Auto-Send
                </label>
                <Switch
                  checked={settings.webhooksEnabled}
                  disabled={!settings.webhookUrl}
                  id="agentation-auto-send"
                  onChange={(e) =>
                    onSettingsChange({
                      webhooksEnabled: e.target.checked,
                    })
                  }
                />
              </div>
            </div>
            <p className={styles.automationDescription}>
              The webhook URL will receive live annotation changes and annotation data.
            </p>
            <textarea
              className={styles.webhookUrlInput}
              onChange={(e) => onSettingsChange({ webhookUrl: e.target.value })}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Webhook URL"
              value={settings.webhookUrl}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
