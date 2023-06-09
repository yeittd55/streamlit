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
import { hasLightBackgroundColor } from "src/lib/theme"

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
    backgroundColor: isUser
      ? theme.colors.backgroundColor
      : theme.colors.primary,
    lineHeight: "1",
    fontSize: "1.25rem",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    alignItems: "center",
    justifyContent: "center",
  })
)

export const StyledChatInputContainer = styled.div(({ theme }) => {
  const lightTheme = hasLightBackgroundColor(theme)
  return {
    backgroundColor: lightTheme ? theme.colors.gray10 : theme.colors.gray90,
    borderRadius: "4px",
    filter: lightTheme
      ? "drop-shadow(0px 2px 8px rgba(25, 30, 36, 0.15))"
      : "drop-shadow(0px 2px 8px rgba(191, 197, 211, 0.3))",
    display: "flex",
    position: "relative",
    bottom: "0px",
    alignItems: "center",
    marginTop: "1rem",
  }
})

export const StyledChatInput = styled.div(({ theme }) => {
  const lightTheme = hasLightBackgroundColor(theme)
  return {
    backgroundColor: lightTheme ? theme.colors.gray10 : theme.colors.gray90,
    position: "relative",
    flexGrow: 1,
    borderRadius: "4px",
  }
})
export interface StyledSendIconContainerProps {
  height: string
}

export const StyledSendIconContainer =
  styled.button<StyledSendIconContainerProps>(({ theme, height }) => {
    const lightTheme = hasLightBackgroundColor(theme)

    return {
      height: height,
      border: lightTheme
        ? `1px solid ${theme.colors.gray10}`
        : `1px solid ${theme.colors.gray90}`,
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: lightTheme ? theme.colors.gray10 : theme.colors.gray90,
      paddingRight: "0.5rem",
      paddingLeft: "0.5rem",
      ":hover": {
        border: lightTheme
          ? `1px solid ${theme.colors.gray70}`
          : `1px solid ${theme.colors.gray30}`,
        backgroundColor: lightTheme
          ? theme.colors.gray40
          : theme.colors.gray10,
      },
      ":focus": {
        border: `1px solid ${theme.colors.primary}`,
        outline: "none",
      },
    }
  })

export const StyledSendIcon = styled.img({
  width: "1.5rem",
  height: "1.5rem",
})
