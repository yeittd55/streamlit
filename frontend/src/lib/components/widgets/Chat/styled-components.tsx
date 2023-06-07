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

export const StyledChatContainer = styled.div(({}) => ({
  position: "relative",
  maxHeight: "65vh",
  overflow: "auto",
  padding: "1rem",
}))

export const StyledChatInputContainer = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.gray10,
  filter: "drop-shadow(0px 2px 8px rgba(25, 30, 36, 0.15))",
  display: "flex",
  position: "relative",
  bottom: "0px",
  alignItems: "center",
  marginTop: "1rem",
}))

export const StyledSendIconContainer = styled.button(({ theme }) => ({
  border: `1px solid ${theme.colors.gray10}`,
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.gray10,
  paddingRight: "0.5rem",
  paddingLeft: "0.5rem",
  ":hover": {
    border: `1px solid ${theme.colors.gray70}`,
    backgroundColor: theme.colors.gray40,
  },
  ":focus": {
    border: `1px solid ${theme.colors.primary}`,
    outline: "none",
  },
}))

export const StyledSendIcon = styled.img({
  width: "1.5rem",
  height: "1.5rem",
})

export interface StyledChatBubbleContainerProps {
  user: boolean
}

export const StyledChatBubbleContainer =
  styled.div<StyledChatBubbleContainerProps>(({ theme, user }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "1rem",
    gap: "0.5rem",
    borderRadius: "8px",
    backgroundColor: user ? theme.colors.gray10 : theme.colors.bgColor,
    width: "fit-content",
    marginTop: "1rem",
    marginBottom: user ? "1rem" : "0rem",
  }))

export const StyledChatMessage = styled.div(({ theme }) => ({
  color: theme.colors.bodyText,
  lineHeight: "1.5rem",
  margin: "auto",
}))

export const StyledAvatarIcon = styled.img(({ theme }) => ({
  backgroundColor: theme.colors.gray10,
  width: "2rem",
  height: "2rem",
  borderRadius: "8px",
}))

export const StyledChatResult = styled.div(({}) => ({
  display: "block",
  marginLeft: "3.5rem",
  marginBottom: "1rem",
  maxWidth: "100%",
  overflow: "hidden",
}))
