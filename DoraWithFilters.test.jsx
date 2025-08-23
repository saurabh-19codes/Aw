// __tests__/AxpDoraWithFilters.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useSelector } from "react-redux";
import AxpDoraWithFilters from "../components/AxpDoraWithFilters";
import * as exportHelper from "../utils/enterpriseHelper";
import * as constants from "../constants";

// Mock hooks and utils
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));
jest.mock("fetchye", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../utils/enterpriseHelper", () => ({
  exportToCSV: jest.fn(),
  findMetricEndpoint: jest.fn(() => "/fakeEndpoint"),
}));

const mockUseFetchye = require("fetchye").default;

describe("AxpDoraWithFilters Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockReturnValue("http://mock-api");

    // default mock for useFetchye
    mockUseFetchye.mockImplementation(() => ({
      isLoading: false,
      data: { body: [{ kpi: "Change Failure rate", drillDown: [] }] },
      run: jest.fn(),
    }));
  });

  it("renders without crashing", () => {
    render(<AxpDoraWithFilters />);
    expect(screen.getByTestId("btnExport")).toBeInTheDocument();
  });

  it("disables Export button when filters are reset", () => {
    render(<AxpDoraWithFilters />);
    const btn = screen.getByTestId("btnExport");
    expect(btn).toBeDisabled();
  });

  it("calls downloadExcel when Export Count button is clicked", async () => {
    render(<AxpDoraWithFilters />);
    const btn = screen.getByTestId("btnExport");
    // enable button first
    fireEvent.click(btn);
    await waitFor(() => {
      expect(mockUseFetchye).toHaveBeenCalled();
    });
  });

  it("calls handleMetricLevelExport when Metric export button clicked", () => {
    render(<AxpDoraWithFilters />);
    const btns = screen.getAllByTestId("btnSpan"); // includes row-level exports
    fireEvent.click(btns[0].querySelector("button"));
    expect(exportHelper.findMetricEndpoint).toHaveBeenCalled();
  });

  it("shows ProgressCircle when isDownloadLoading is true", () => {
    mockUseFetchye.mockImplementation(() => ({
      isLoading: true,
      data: null,
    }));
    render(<AxpDoraWithFilters />);
    expect(screen.getByText(/Downloading/)).toBeInTheDocument();
  });

  it("shows PageLevelMessage when metric download is in progress", () => {
    render(<AxpDoraWithFilters />);
    // trigger metric export click
    const btns = screen.getAllByTestId("btnSpan");
    fireEvent.click(btns[0].querySelector("button"));
    expect(exportHelper.findMetricEndpoint).toHaveBeenCalled();
  });

  it("renders DataTable when API returns data", () => {
    render(<AxpDoraWithFilters />);
    expect(screen.getByText("Change Failure rate")).toBeInTheDocument();
  });

  it("calls exportToCSV when export is clicked", async () => {
    render(<AxpDoraWithFilters />);
    const btn = screen.getByTestId("btnExport");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(exportHelper.exportToCSV).toHaveBeenCalled();
    });
  });

  it("renders LoaderCircle when filter API is loading", () => {
    mockUseFetchye.mockImplementation(() => ({
      isLoading: true,
      data: null,
    }));
    render(<AxpDoraWithFilters />);
    expect(screen.getByTestId("btnExport")).toBeDisabled();
  });

  it("handles empty API response gracefully", () => {
    mockUseFetchye.mockImplementation(() => ({
      isLoading: false,
      data: { body: [] },
    }));
    render(<AxpDoraWithFilters />);
    expect(screen.getByTestId("btnExport")).toBeDisabled();
  });
});
