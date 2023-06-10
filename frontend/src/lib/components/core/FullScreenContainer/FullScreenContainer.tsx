/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactElement, ReactNode, useEffect } from "react"
import styled from "@emotion/styled"
import { LayoutMode, LibContext } from "src/lib/components/core/LibContext"

const StyledFullScreenContainer = styled.div(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  flexGrow: "1",
  height: "calc(100vh - 8rem)",
  overflow: "hidden",
}))

export interface Props {
  children: ReactNode
}

export default function FullScreenContainer({
  children,
}: Props): ReactElement {
  const { setLayoutMode } = React.useContext(LibContext)
  useEffect(() => {
    setLayoutMode(LayoutMode.FullScreen)
  }, [setLayoutMode])

  return (
    <StyledFullScreenContainer data-testid="FullScreenContainer">
      {children}
    </StyledFullScreenContainer>
  )
}
