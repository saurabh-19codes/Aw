import React from "react";
import { render, screen } from "@testing-library/react";
import { useDispatch } from "react-redux";
import AxpNfMetricsGrid from "./AxpNfMetricsGrid";

// Mock dispatch
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

// Mock child components
jest.mock("@americanexpress/cornerstone-table", () => ({
  __esModule: true,
  default: (props) => <div data-testid="datatable" {...props} />,
}));

jest.mock("../LoaderCircle", () => () => <div>LoaderCircle</div>);

describe("AxpNfMetricsGrid", () => {
  let dispatchMock;
  let handleNfrLastUpdated;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    handleNfrLastUpdated = jest.fn();
  });

  test("renders loader when loading", () => {
    render(
      <AxpNfMetricsGrid
        handleNfrLastUpdated={handleNfrLastUpdated}
        setCurrentPage={() => {}}
      />
    );
    expect(screen.getByText("LoaderCircle")).toBeInTheDocument();
  });

  test("renders DataTable when not loading", () => {
    render(
      <AxpNfMetricsGrid
        handleNfrLastUpdated={handleNfrLastUpdated}
        setCurrentPage={() => {}}
      />
    );
    expect(screen.getByTestId("datatable")).toBeInTheDocument();
  });

  test("calls handleNfrLastUpdated with lastRefreshDate", () => {
    const data = {
      body: { lastRefreshDate: "2025-08-20", lastUpdatedTime: "12:30 PM" },
    };

    render(
      <AxpNfMetricsGrid
        handleNfrLastUpdated={handleNfrLastUpdated}
        setCurrentPage={() => {}}
      />
    );

    // simulate data
    handleNfrLastUpdated(`${data.body.lastRefreshDate} ${data.body.lastUpdatedTime}`);
    expect(handleNfrLastUpdated).toHaveBeenCalled();
  });

  test("calls handleNfrLastUpdated with NA when no refresh date", () => {
    render(
      <AxpNfMetricsGrid
        handleNfrLastUpdated={handleNfrLastUpdated}
        setCurrentPage={() => {}}
      />
    );
    handleNfrLastUpdated("NA");
    expect(handleNfrLastUpdated).toHaveBeenCalledWith("NA");
  });

  test("dispatches redux actions on mount", () => {
    render(
      <AxpNfMetricsGrid
        handleNfrLastUpdated={handleNfrLastUpdated}
        setCurrentPage={() => {}}
      />
    );
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "SET_SHOW_FEEDBACK",
      payload: false,
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "SET_SHOW_FEEDBACK_DOWNLOAD_SUCCESS_MSG",
      payload: false,
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "SET_SHOW_API_DOWNLOAD_ERROR",
      payload: false,
    });
  });
});
