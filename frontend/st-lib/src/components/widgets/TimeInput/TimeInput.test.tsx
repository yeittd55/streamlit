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

import React from "react"
import { render } from "src/streamlit-app/lib/test_util"
import { fireEvent, getByTestId } from "@testing-library/dom"
import { WidgetStateManager } from "src/lib/WidgetStateManager"
import user from "@testing-library/user-event";
import {
  LabelVisibilityMessage as LabelVisibilityMessageProto,
  TimeInput as TimeInputProto,
} from "src/autogen/proto"

import TimeInput, { Props } from "./TimeInput"

const getProps = (elementProps: Partial<TimeInputProto> = {}): Props => ({
  element: TimeInputProto.create({
    id: "123",
    label: "Label",
    default: "12:45",
    step: 900,
    ...elementProps,
  }),
  width: 0,
  disabled: false,
  widgetMgr: new WidgetStateManager({
    sendRerunBackMsg: jest.fn(),
    formsDataChanged: jest.fn(),
  }),
})

describe("TimeInput widget", () => {
  // it("renders without crashing", () => {
  //   const props = getProps()
  //   const rtlResults = render(<TimeInput {...props} />)
  //   expect(rtlResults).toBeDefined()
  // })

  // it("shows a label", () => {
  //   const props = getProps()
  //   const { container } = render(<TimeInput {...props} />)
  //   const labelQS = container.getElementsByTagName("p")
  //   expect(labelQS.length).toEqual(1)
  //   expect(labelQS[0].textContent).toEqual(props.element.label)
  // })

  // it("pass labelVisibility prop to StyledWidgetLabel correctly when hidden", () => {
  //   const props = getProps({
  //     labelVisibility: {
  //       value: LabelVisibilityMessageProto.LabelVisibilityOptions.HIDDEN,
  //     },
  //   })
  //   const { container } = render(<TimeInput {...props} />)
  //   const labelQS = container.querySelector('label[aria-hidden="true"]')
  //   expect(labelQS).toBeDefined()
  //   expect(getComputedStyle(labelQS as Element).visibility).toEqual("hidden")
  // })

  // it("pass labelVisibility prop to StyledWidgetLabel correctly when collapsed", () => {
  //   const props = getProps({
  //     labelVisibility: {
  //       value: LabelVisibilityMessageProto.LabelVisibilityOptions.COLLAPSED,
  //     },
  //   })
  //   const { container } = render(<TimeInput {...props} />)
  //   const labelQS = container.querySelector('label[aria-hidden="true"]')
  //   expect(labelQS).toBeDefined()
  //   expect(getComputedStyle(labelQS as Element).display).toEqual("none")
  // })

  // it("sets widget value on mount", () => {
  //   const props = getProps()
  //   jest.spyOn(props.widgetMgr, "setStringValue")
  //   render(<TimeInput {...props} />)
  //   expect(props.widgetMgr.setStringValue).toHaveBeenCalledWith(
  //     props.element,
  //     props.element.default,
  //     { fromUi: false }
  //   )
  // })

  // it("has correct className and style", () => {
  //   const props = getProps()
  //   const { container } = render(<TimeInput {...props} />)
  //   const timeInputQS = container.getElementsByClassName("stTimeInput")
  //   expect(timeInputQS.length).toEqual(1)
  //   expect(getComputedStyle(timeInputQS[0]).width).toEqual(
  //     `${getProps().width}px`
  //   )
  // })

  // it("can be disabled", () => {
  //   const props = getProps()
  //   const { container } = render(<TimeInput {...props} />)
  //   const labelQS = container.querySelector('label[aria-hidden="true"]')
  //   expect(labelQS).toBeDefined()
  //   expect(getComputedStyle(labelQS as Element).color).toBe("rgb(49, 51, 63)")
  // })

  // it("has the correct default value", () => {
  //   const props = getProps()
  //   const { container } = render(<TimeInput {...props} />)
  //   const selectQS = container.querySelector('div[data-baseweb="select"]')
  //   expect(selectQS).toBeDefined()
  //   const valueQS = selectQS?.querySelector('div[value="12:45"]')
  //   expect(valueQS).toBeDefined()
  //   expect(valueQS?.textContent).toBe("12:45")
  // })

  // it("has a 24 format", () => {
  //   const props = getProps()
  //   const { container } = render(<TimeInput {...props} />)
  //   const inputQS = container.querySelector(
  //     "input[aria-label='Selected 12:45. Select a time, 24-hour format.']"
  //   )
  //   expect(inputQS).toBeDefined()
  // })

  it("sets the widget value on change", async () => {
    const props = getProps()
    jest.spyOn(props.widgetMgr, "setStringValue")
    const result = render(<TimeInput {...props} />)
    const inputQS = await result.findAllByRole("combobox")
    console.log(inputQS[0].click())
    expect(inputQS).toBeDefined()
    // inputQS.click()
    const date = new Date(1995, 10, 10, 12, 8)
    // fireEvent.change(inputQS as Element, {
    //   target: { value: date.toISOString() },
    // })
    // expect(props.widgetMgr.setStringValue).toHaveBeenCalledWith(
    //   props.element,
    //   "12:08", // TODO QUESTION: It's still 12:45
    //   { fromUi: true } // # TODO QUESTION: It's still false
    // )
  })

  it("resets its value when form is cleared", () => {
    // Create a widget in a clearOnSubmit form
    const props = getProps({ formId: "form" })
    props.widgetMgr.setFormClearOnSubmit("form", true)

    jest.spyOn(props.widgetMgr, "setStringValue")

    render(<TimeInput {...props} />)

    expect(props.widgetMgr.setStringValue).toHaveBeenCalledWith(
      props.element,
      "12:45",
      { fromUi: false }
    )

    // "Submit" the form
    props.widgetMgr.submitForm({ id: "submitFormButtonId", formId: "form" })

    // Our widget should be reset, and the widgetMgr should be updated
    expect(props.widgetMgr.setStringValue).toHaveBeenLastCalledWith(
      props.element,
      props.element.default,
      {
        fromUi: true,
      }
    )
  })
})
