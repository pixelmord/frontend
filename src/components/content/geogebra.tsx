import React from 'react'
import styled from 'styled-components'

import { PrivacyWrapper, Provider } from './privacy-wrapper'

export interface GeogebraProps {
  id: string
}

export function Geogebra({ id }: GeogebraProps) {
  return (
    <PrivacyWrapper
      type="applet"
      previewImageUrl="/_assets/img/blank-preview-image.png"
      provider={Provider.GeoGebra}
    >
      <GeogebraContainer>
        <GeogebraFrame
          title={id}
          scrolling="no"
          src={'https://www.geogebra.org/material/iframe/id/' + id}
        />
      </GeogebraContainer>
    </PrivacyWrapper>
  )
}

const GeogebraFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  z-index: 6;
  background-color: rgba(0, 0, 0, 0.3);
`

const GeogebraContainer = styled.div`
  padding: 0;
  display: block;
  height: 0;
  overflow: hidden;
`
