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

import React, { ReactElement, ReactNode, useRef } from "react"
import ScrollToBottom from "react-scroll-to-bottom"
import { css } from "@emotion/css"

const CONTAINER_CSS = css({
  maxHeight: "65vh",
  padding: "1rem",
})

export interface Props {
  children: ReactNode
}

function ChatContainer(props: Props): ReactElement {
  const { children } = props

  return (
    <ScrollToBottom scrollViewClassName={CONTAINER_CSS}>
      {children}
    </ScrollToBottom>
  )
}

export default ChatContainer
