import * as React from "react"
import { render, fireEvent, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import TimestampPicker from './TimestampPicker';
import { UseFirebaseCtx } from '.';
import { Label } from './types';

describe("TimestampPicker", () => {
  const setTimestamp = jest.fn()

  beforeEach(() => {
    setTimestamp.mockClear()
  })

  it("renders with initial values", () => {
    render(
      <UseFirebaseCtx.Provider value={false}>
        <TimestampPicker
          timestamp="1678886400000000"
          scope="event"
          setTimestamp={setTimestamp}
        />
      </UseFirebaseCtx.Provider>
    )

    expect(screen.getByLabelText(Label.TimestampMicros)).toHaveValue(
      "1678886400000000"
    )
  })

  it("calls setTimestamp when text input changes", () => {
    render(
      <UseFirebaseCtx.Provider value={false}>
        <TimestampPicker
          timestamp="1678886400000000"
          scope="event"
          setTimestamp={setTimestamp}
        />
      </UseFirebaseCtx.Provider>
    )

    const input = screen.getByLabelText(Label.TimestampMicros)
    fireEvent.change(input, { target: { value: "1678886400000001" } })

    expect(setTimestamp).toHaveBeenCalledWith("1678886400000001")
  })

  it("shows validation error for invalid timestamp", () => {
    render(
      <UseFirebaseCtx.Provider value={false}>
        <TimestampPicker
          timestamp="1678886400000000"
          scope="event"
          setTimestamp={setTimestamp}
        />
      </UseFirebaseCtx.Provider>
    )

    const input = screen.getByLabelText(Label.TimestampMicros)
    fireEvent.change(input, { target: { value: "invalid" } })

    expect(screen.getByText("Timestamp must be a number.")).toBeInTheDocument()
  })

  it("shows validation error for negative timestamp", () => {
    render(
      <UseFirebaseCtx.Provider value={false}>
        <TimestampPicker
          timestamp="1678886400000000"
          scope="event"
          setTimestamp={setTimestamp}
        />
      </UseFirebaseCtx.Provider>
    )

    const input = screen.getByLabelText(Label.TimestampMicros)
    fireEvent.change(input, { target: { value: "-100" } })

    expect(
      screen.getByText("Timestamp must be a positive number.")
    ).toBeInTheDocument()
  })

  it("clears validation error for empty timestamp", () => {
    render(
      <UseFirebaseCtx.Provider value={false}>
        <TimestampPicker
          timestamp="1678886400000000"
          scope="event"
          setTimestamp={setTimestamp}
        />
      </UseFirebaseCtx.Provider>
    )

    const input = screen.getByLabelText(Label.TimestampMicros)
    fireEvent.change(input, { target: { value: "invalid" } })
    fireEvent.change(input, { target: { value: "" } })

    expect(
      screen.getByText("The timestamp of the event. Optional.")
    ).toBeInTheDocument()
  })

  it("sets timestamp to current time", () => {
    jest.useFakeTimers("modern")
    jest.setSystemTime(new Date("2023-03-15T12:00:00.000Z"))

    const expectedTimestamp = "1678881600000000"

    render(
      <UseFirebaseCtx.Provider value={false}>
        <TimestampPicker
          timestamp=""
          scope="event"
          setTimestamp={setTimestamp}
        />
      </UseFirebaseCtx.Provider>
    )

    const button = screen.getByRole("button", { name: "Set to current time" })
    fireEvent.click(button)

    expect(setTimestamp).toHaveBeenCalledWith(expectedTimestamp)

    jest.useRealTimers()
  })

  it("initializes timezone field to user's timezone", async () => {
    // Mock browser's timezone as America/New_York 
    jest.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
      timeZone: "America/New_York",
      locale: "en-US",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      calendar: "gregory",
      numberingSystem: "latn",
    })

    render(
      <UseFirebaseCtx.Provider value={false}>
        <TimestampPicker
          timestamp=""
          scope="event"
          setTimestamp={setTimestamp}
        />
      </UseFirebaseCtx.Provider>
    )

    const timezoneButton = screen.getByRole("button", { name: "Select timezone" })
    userEvent.click(timezoneButton)

    expect(screen.getByLabelText(Label.TimezoneSelect)).toHaveValue("America/New_York")
    jest.restoreAllMocks()
  })

  it("updates timestamp when timezone changes", async () => {
    const initialTimestamp = "1678881600000000"
    const expectedTimestamp = "1678892400000000"

    jest.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
      timeZone: "America/New_York",
      locale: "en-US",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      calendar: "gregory",
      numberingSystem: "latn",
    })

    render(
      <UseFirebaseCtx.Provider value={false}>
        <TimestampPicker
          timestamp={initialTimestamp}
          scope="event"
          setTimestamp={setTimestamp}
        />
      </UseFirebaseCtx.Provider>
    )

    const timezoneButton = screen.getByRole("button", { name: "Select timezone" })
    userEvent.click(timezoneButton)

    const timezoneInput = screen.getByLabelText(Label.TimezoneSelect)
    await userEvent.type(timezoneInput, "America/Los_Angeles", { delay: 1 })

    const laOption = await screen.findByText("America/Los_Angeles")
    userEvent.click(laOption)

    expect(setTimestamp).toHaveBeenCalledWith(expectedTimestamp)

    jest.restoreAllMocks()
  })
})
