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

import styled from "@emotion/styled"

export interface StyledChatBubbleContainerProps {
  isUser: boolean
}

export const StyledChatBubbleContainer =
  styled.div<StyledChatBubbleContainerProps>(({ theme, isUser }) => {
    const userBackground = isUser
      ? {
          backgroundColor: theme.colors.secondaryBg,
          borderRadius: "0.5rem",
        }
      : {}

    return {
      display: "flex",
      alignItems: "flex-start",
      gap: "0.5rem",
      marginTop: "1rem",
      marginBottom: "1rem",
      padding: "1rem",
      ...userBackground,
    }
  })

export const StyledChatMessage = styled.div(({ theme }) => ({
  color: theme.colors.bodyText,
  lineHeight: "1.5rem",
  margin: "auto",
  flexGrow: 1,
  paddingRight: "2.5rem",
}))

export const StyledAvatarIcon = styled.div<StyledChatBubbleContainerProps>(
  ({ theme, isUser }) => ({
    display: "flex",
    backgroundColor: isUser ? theme.colors.bgColor : theme.colors.secondaryBg,
    lineHeight: "1",
    fontSize: "1.25rem",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    alignItems: "center",
    justifyContent: "center",
  })
)
