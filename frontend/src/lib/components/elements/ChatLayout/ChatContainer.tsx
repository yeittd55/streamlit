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

import React, { ReactElement, ReactNode } from "react"
import ScrollToBottom from "react-scroll-to-bottom"
import { css, CSSInterpolation } from "@emotion/css"
import { LayoutMode, LibContext } from "src/lib/components/core/LibContext"

export interface Props {
  children: ReactNode
}

function ChatContainer(props: Props): ReactElement {
  const { children } = props
  const { layoutMode } = React.useContext(LibContext)
  const scrollableAreaStyle: CSSInterpolation = {
    padding: "1rem",
  }

  const containerStyle: CSSInterpolation = {}
  if (layoutMode === LayoutMode.Default) {
    containerStyle.height = "calc(100vh - 28rem)"
  } else if (layoutMode === LayoutMode.FullScreen) {
    containerStyle.display = "flex"
    containerStyle.flexGrow = "1"
    containerStyle.overflow = "hidden"
  }

  return (
    <ScrollToBottom
      className={css(containerStyle)}
      scrollViewClassName={css(scrollableAreaStyle)}
      // initialScrollBehavior="auto"
    >
      {children}
      <div style={{ overflowAnchor: "auto" }} />
    </ScrollToBottom>
  )
}

export default ChatContainer
