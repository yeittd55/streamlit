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

import React, { RefObject } from "react"
import { withTheme } from "@emotion/react"
import { ChatInput as ChatInputProto } from "src/lib/proto"
import { FormClearHelper } from "src/lib/components/widgets/Form"
import { WidgetStateManager, Source } from "src/lib/WidgetStateManager"

import { Textarea as UITextArea } from "baseui/textarea"
import InputInstructions from "src/lib/components/shared/InputInstructions/InputInstructions"
import {
  StyledChatInputContainer,
  StyledChatInput,
  StyledSendIconContainer,
  StyledSendIcon,
} from "./styled-components"
import Send from "./send.svg"
import { hasLightBackgroundColor, EmotionTheme } from "src/lib/theme"

export interface Props {
  theme: EmotionTheme
  disabled: boolean
  element: ChatInputProto
  widgetMgr: WidgetStateManager
  width: number
}

interface State {
  /**
   * True if the user-specified state.value has not yet been synced to the WidgetStateManager.
   */
  dirty: boolean

  /**
   * The value specified by the user via the UI. If the user didn't touch this
   * widget's UI, the default value is used.
   */
  value: string

  /**
   * The value of the height of the textarea. It depends on a variety of factors
   * including the default height, and autogrowing
   */
  scrollHeight: number
}

class ChatInput extends React.PureComponent<Props, State> {
  private readonly formClearHelper = new FormClearHelper()
  private chatInputRef: RefObject<HTMLTextAreaElement> = React.createRef()

  public state: State = {
    dirty: false,
    value: this.initialValue,
    scrollHeight: 0,
  }

  get initialValue(): string {
    // If WidgetStateManager knew a value for this widget, initialize to that.
    // Otherwise, use the default value from the widget protobuf.
    const storedValue = this.props.widgetMgr.getStringValue(this.props.element)
    return storedValue !== undefined ? storedValue : this.props.element.default
  }

  public componentDidMount(): void {
    if (this.props.element.setValue) {
      this.updateFromProtobuf()
    } else {
      this.commitWidgetValue({ fromUi: false })
    }
  }

  public componentDidUpdate(): void {
    this.maybeUpdateFromProtobuf()
  }

  public componentWillUnmount(): void {
    this.formClearHelper.disconnect()
  }

  private maybeUpdateFromProtobuf(): void {
    const { setValue } = this.props.element
    if (setValue) {
      this.updateFromProtobuf()
    }
  }

  private updateFromProtobuf(): void {
    const { value } = this.props.element
    this.props.element.setValue = false
    this.setState({ value }, () => {
      this.commitWidgetValue({ fromUi: false })
    })
  }

  /** Commit state.value to the WidgetStateManager. */
  private commitWidgetValue = (source: Source): void => {
    this.props.widgetMgr.setStringValue(
      this.props.element,
      this.state.value,
      source
    )
    this.setState({ dirty: false })
  }

  /**
   * If we're part of a clear_on_submit form, this will be called when our
   * form is submitted. Restore our default value and update the WidgetManager.
   */
  private onFormCleared = (): void => {
    this.setState(
      (_, prevProps) => {
        return { value: prevProps.element.default }
      },
      () => this.commitWidgetValue({ fromUi: true })
    )
  }

  private onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = e.target
    const { element } = this.props
    const { maxChars } = element

    if (maxChars !== 0 && value.length > maxChars) {
      return
    }

    let scrollHeight = 0
    const { current: chatInput } = this.chatInputRef
    if (chatInput) {
      chatInput.style.height = "auto"
      scrollHeight = chatInput.scrollHeight
      chatInput.style.height = ""
    }

    this.setState({ dirty: true, value, scrollHeight })
  }

  isEnterKeyPressed = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): boolean => {
    const { keyCode, key } = event

    // Using keyCode as well due to some different behaviors on Windows
    // https://bugs.chromium.org/p/chromium/issues/detail?id=79407
    return key === "Enter" || keyCode === 13 || keyCode === 10
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    const { metaKey, ctrlKey, shiftKey } = e
    const isEnterKeyPressed = this.isEnterKeyPressed(e)
    const shouldSubmit = isEnterKeyPressed && !shiftKey && !ctrlKey && !metaKey

    if (shouldSubmit) {
      e.preventDefault()

      this.commitWidgetValue({ fromUi: true })
    }
  }

  private handleSubmit = () => {
    this.commitWidgetValue({ fromUi: true })
  }

  public render(): React.ReactNode {
    const { theme, element, disabled, width, widgetMgr } = this.props
    const { value, dirty, scrollHeight } = this.state
    const style = { width }
    const { placeholder } = element
    const MIN_HEIGHT = 55
    // const suppliedHeight = 0
    // let realHeight = Math.max(suppliedHeight, MIN_HEIGHT)
    const realHeight = Math.max(scrollHeight, MIN_HEIGHT)

    const lightTheme = hasLightBackgroundColor(theme)

    // Manage our form-clear event handler.
    this.formClearHelper.manageFormClearListener(
      widgetMgr,
      element.formId,
      this.onFormCleared
    )

    return (
      <StyledChatInputContainer className="stChatInputContainer">
        <StyledChatInput>
          <UITextArea
            data-testid="stChatInput"
            inputRef={this.chatInputRef}
            value={value}
            placeholder={placeholder}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            aria-label={"placeholder"}
            disabled={disabled}
            rows={1}
            overrides={{
              Root: {
                style: {
                  border: `none`,
                  borderRadius: "4px",
                  ":focus-within": {
                    border: `none`,
                  },
                },
              },
              Input: {
                style: {
                  lineHeight: "1.4",
                  height: `${realHeight + 1}px`,
                  minHeight: `${MIN_HEIGHT}px`,
                  borderColor: lightTheme
                    ? theme.colors.gray10
                    : theme.colors.gray90,
                  backgroundColor: lightTheme
                    ? theme.colors.gray10
                    : theme.colors.gray90,
                  "::placeholder": {
                    opacity: "0.7",
                  },
                  // Baseweb requires long-hand props, short-hand leads to weird bugs & warnings.
                  paddingRight: "1rem",
                  paddingLeft: "1rem",
                  paddingBottom: "1rem",
                  paddingTop: "1rem",
                },
              },
            }}
          />
          <InputInstructions
            dirty={dirty}
            value={value}
            maxLength={element.maxChars}
            type={"single"}
          />
        </StyledChatInput>
        <StyledSendIconContainer
          height={`${realHeight}px`}
          onClick={this.handleSubmit}
        >
          <StyledSendIcon src={Send} alt="Send" />
        </StyledSendIconContainer>
      </StyledChatInputContainer>
    )
  }
}

export default withTheme(ChatInput)
