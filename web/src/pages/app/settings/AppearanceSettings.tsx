import styled from 'styled-components'
import {
  LIGHT_ACCENT_SWATCHES,
  LIGHT_PAGE_TINT_SWATCHES,
  type Swatch,
} from '@/base/theme/themes'

const Heading = styled.h2`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
  letter-spacing: -0.01em;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`

const SectionLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.textPrimary};
`

const SectionHint = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`

const SwatchRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
`

const SwatchButton = styled.button<{ $color: string; $selected: boolean }>`
  position: relative;
  width: 32px;
  height: 32px;
  padding: 0;
  background: ${({ $color }) => $color};
  border: 1px solid ${({ theme }) => theme.panelBorder};
  border-radius: 6px;
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 120ms ease;
  outline: ${({ $selected, theme }) =>
    $selected ? `2px solid ${theme.activeFg}` : '2px solid transparent'};
  outline-offset: 1px;

  &:hover {
    transform: scale(1.06);
  }
`

export type AppearanceSettingsProps = {
  lightAccent: string
  lightPageTint: string
  onLightAccentChange: (hex: string) => void
  onLightPageTintChange: (hex: string) => void
}

function SwatchPicker({
  swatches,
  selected,
  onSelect,
}: {
  swatches: Swatch[]
  selected: string
  onSelect: (hex: string) => void
}) {
  return (
    <SwatchRow>
      {swatches.map((s) => (
        <SwatchButton
          key={s.value}
          type="button"
          $color={s.value}
          $selected={s.value === selected}
          onClick={() => onSelect(s.value)}
          aria-label={s.label}
          title={s.label}
        />
      ))}
    </SwatchRow>
  )
}

export function AppearanceSettings(props: AppearanceSettingsProps) {
  const { lightAccent, lightPageTint, onLightAccentChange, onLightPageTintChange } =
    props
  return (
    <>
      <Heading>Appearance</Heading>
      <Section>
        <SectionLabel>Highlight color</SectionLabel>
        <SectionHint>
          Drives active and focus states in the light theme.
        </SectionHint>
        <SwatchPicker
          swatches={LIGHT_ACCENT_SWATCHES}
          selected={lightAccent}
          onSelect={onLightAccentChange}
        />
      </Section>
      <Section>
        <SectionLabel>Background tint</SectionLabel>
        <SectionHint>
          Tints the page and panel backgrounds in the light theme.
        </SectionHint>
        <SwatchPicker
          swatches={LIGHT_PAGE_TINT_SWATCHES}
          selected={lightPageTint}
          onSelect={onLightPageTintChange}
        />
      </Section>
    </>
  )
}
