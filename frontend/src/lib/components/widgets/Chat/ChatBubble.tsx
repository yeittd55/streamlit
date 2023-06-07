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

import React, { ReactElement } from "react"

import { withTheme } from "@emotion/react"

import { EmotionTheme } from "src/lib/theme"

// stand in avatars
import corgi from "./corgi.png"
import snow from "./snow.png"
import {
  StyledChatBubbleContainer,
  StyledChatMessage,
  StyledChatResult,
  StyledAvatarIcon,
} from "./styled-components"

export interface Props {
  theme: EmotionTheme
  user: boolean
  message: string
  avatar?: string
  children?: ReactElement
}

function ChatBubble(props: Props): ReactElement {
  const { user, message, children } = props
  let { avatar } = props
  if (!avatar) {
    avatar = user ? corgi : snow
  }
  const altText = user ? "Avatar-User" : "Avatar-Chat"

  return (
    <>
      <StyledChatBubbleContainer user={user}>
        <StyledAvatarIcon src={avatar} alt={altText} />
        <StyledChatMessage>{message}</StyledChatMessage>
      </StyledChatBubbleContainer>
      {!user && children && <StyledChatResult>{children}</StyledChatResult>}
    </>
  )
}

export default withTheme(ChatBubble)
