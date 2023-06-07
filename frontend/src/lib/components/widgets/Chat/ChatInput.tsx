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

import React, { ReactElement, useCallback, useState } from "react"
import { Textarea as UITextArea } from "baseui/textarea"

import Send from "./send.svg"

import {
  StyledChatInputContainer,
  StyledSendIcon,
  StyledSendIconContainer,
} from "./styled-components"
import { withTheme } from "@emotion/react"
import { EmotionTheme } from "src/lib/theme"

export interface Props {
  theme: EmotionTheme
}

function ChatInput(props: Props): ReactElement {
  const { theme } = props
  const [value, setValue] = useState("")

  const handleChange = useCallback(
    (newValue: string): void => {
      setValue(newValue)
    },
    [setValue]
  )

  const handleSubmit = useCallback((): void => {
    console.log("Submit")
  }, [])

  return (
    <StyledChatInputContainer>
      <UITextArea
        data-testid="ChatInput"
        value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder={"Enter your message here..."}
        overrides={{
          Root: {
            style: {
              border: `1px solid ${theme.colors.gray10}`,
              borderRadius: "4px",
              ":focus-within": {
                border: `1px solid ${theme.colors.primary}`,
              },
            },
          },
          Input: {
            style: {
              borderColor: theme.colors.gray10,
              backgroundColor: theme.colors.gray10,
              lineHeight: "1.5rem",
              height: "40px",
              resize: "vertical",
              padding: "0.5rem",
              "::placeholder": {
                color: theme.colors.gray70,
              },
            },
          },
        }}
      />
      <StyledSendIconContainer onClick={handleSubmit}>
        <StyledSendIcon src={Send} alt="Send" />
      </StyledSendIconContainer>
    </StyledChatInputContainer>
  )
}

export default withTheme(ChatInput)
