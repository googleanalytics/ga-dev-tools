import React from "react"
import { render, screen, fireEvent, within } from "@testing-library/react"
import "@testing-library/jest-dom"
import ValidateEvent, { ValidateEventProps } from "."
import { EventCtx, EventPayload } from ".."
import useValidateEvent from "./useValidateEvent"
import { EventType } from "../types"

// Mock the useValidateEvent hook. This allows us to control its output and check if it's called correctly.
jest.mock("./useValidateEvent", () => ({
  __esModule: true,
  default: jest.fn(),
}))

const mockedUseValidateEvent = useValidateEvent as jest.Mock

// Mock child components that are not relevant to this test.
jest.mock("@/components/PrettyJson", () => () => <div>PrettyJson</div>)
jest.mock("@/components/Spinner", () => () => <div>Spinner</div>)

const mockValidateEventFn = jest.fn()

// A minimal set of props to render the component.
const defaultProps: ValidateEventProps = {
  measurement_id: "",
  app_instance_id: "",
  firebase_app_id: "",
  api_secret: "",
  client_id: "",
  user_id: "",
  formatPayload: jest.fn(),
  payloadErrors: undefined,
  useTextBox: false,
}

// A helper to render the component with context.
const renderComponent = (props: Partial<ValidateEventProps> = {}) => {
  // The component relies on EventCtx for some data. This should be a valid
  // EventPayload.
  const contextValue: EventPayload = {
    instanceId: {
      measurement_id: "G-12345",
      firebase_app_id: "app:12345",
    },
    eventName: "test_event",
    type: EventType.CustomEvent,
    parameters: [],
    items: [],
    userProperties: [],
    timestamp_micros: "",
    non_personalized_ads: false,
    useTextBox: false,
    payloadObj: [],
    api_secret: "secret123",
    clientIds: {},
    ip_override: "",
    user_location: {
      city: "Mountain View",
      region_id: "CA",
      country_id: "US",
      subcontinent_id: "021",
      continent_id: "019"
    },
    user_agent: "",
    device: {
      category: "mobile",
      language: "en",
      screen_resolution: "1280x2856",
      operating_system: "Android",
      operating_system_version: "14",
      model: "Pixel 9 Pro",
      brand: "Google",
      browser: "Chrome",
      browser_version: "136.0.7103.60"
   }
  }

  return render(
    <EventCtx.Provider value={contextValue}>
      <ValidateEvent {...defaultProps} {...props} />
    </EventCtx.Provider>
  )
}

describe("ValidateEvent EU endpoint functionality", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    // Setup the default mock implementation for useValidateEvent to render the initial state.
    mockedUseValidateEvent.mockReturnValue({
      status: "not-started",
      validateEvent: mockValidateEventFn,
    })
  })

  it("should render with the default endpoint and allow switching to the EU endpoint", () => {
    renderComponent()

    // 1. Check initial state (default endpoint)
    expect(screen.getByText("HOST: www.google-analytics.com", { exact: false })).toBeInTheDocument()
    expect(screen.queryByText("HOST: region1.google-analytics.com", { exact: false })).not.toBeInTheDocument()
    expect(mockedUseValidateEvent).toHaveBeenCalledWith(false)

    // 2. Find and interact with the switch
    const euSwitch = within(screen.getByTestId("use-eu-endpoint")).getByRole('checkbox')
    expect(euSwitch).toHaveProperty('checked', false)
    fireEvent.click(euSwitch)

    // 3. Check the new state (EU endpoint)
    expect(euSwitch).toHaveProperty('checked', true)
    expect(screen.getByText("HOST: region1.google-analytics.com", { exact: false })).toBeInTheDocument()
    expect(mockedUseValidateEvent).toHaveBeenCalledTimes(2)
    expect(mockedUseValidateEvent).toHaveBeenLastCalledWith(true)
  })
})
