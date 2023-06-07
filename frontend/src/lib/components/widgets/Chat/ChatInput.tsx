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

import React, {
  ReactElement,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react"
import { Textarea as UITextArea } from "baseui/textarea"

import Send from "./send.svg"

import {
  StyledChatInputContainer,
  StyledSendIcon,
  StyledSendIconContainer,
} from "./styled-components"
import { withTheme } from "@emotion/react"
import { EmotionTheme } from "src/lib/theme"
import { useIsOverflowing } from "src/lib/util/Hooks"

export interface Props {
  theme: EmotionTheme
}

function ChatInput(props: Props): ReactElement {
  const { theme } = props
  const [value, setValue] = useState("")
  const [inputHeight, setinputHeight] = useState(40)
  const chatInputRef = useRef(null)
  const isOverflowing = useIsOverflowing(chatInputRef)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
      setValue(e.target.value)
    },
    [setValue]
  )

  const handleSubmit = useCallback((e): void => {
    console.log("Submit")
    // Reset the value
    setValue("")
  }, [])

  // Grow the input as the user types, reset when empty
  useEffect(() => {
    if (chatInputRef.current && isOverflowing) {
      // @ts-ignore
      setinputHeight(chatInputRef.current.scrollHeight)
    }
    if (value === "") {
      setinputHeight(40)
    }
  }, [value, isOverflowing])

  const isEnterKeyPressed = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): boolean => {
    const { keyCode, key } = event

    // Using keyCode as well due to some different behaviors on Windows
    // https://bugs.chromium.org/p/chromium/issues/detail?id=79407
    return key === "Enter" || keyCode === 13 || keyCode === 10
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    const { shiftKey } = e

    // Enter key without shift submits ; with shift adds a new line
    if (isEnterKeyPressed(e) && !shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <StyledChatInputContainer>
      <UITextArea
        data-testid="ChatInput"
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
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
            props: {
              ref: chatInputRef,
            },
            style: {
              height: `${inputHeight}px`,
              borderColor: theme.colors.gray10,
              backgroundColor: theme.colors.gray10,
              lineHeight: "1.5rem",
              padding: "0.5rem",
              "::placeholder": {
                color: theme.colors.gray70,
              },
            },
          },
        }}
      />
      <StyledSendIconContainer
        height={`${inputHeight}px`}
        onClick={handleSubmit}
      >
        <StyledSendIcon src={Send} alt="Send" />
      </StyledSendIconContainer>
    </StyledChatInputContainer>
  )
}

export default withTheme(ChatInput)
