// ModalComponentForGraph.spec.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalComponentForGraph from "../ModalComponentForGraph";
import HighchartsReact from "highcharts-react-official";

// Mock HighchartsReact (to avoid actual chart rendering)
jest.mock("highcharts-react-official", () => jest.fn(() => <div data-testid="chart-mock" />));

describe("ModalComponentForGraph", () => {
  const mockHandleShowMonthlyGraph = jest.fn();

  const defaultProps = {
    handleShowMonthlyGraph: mockHandleShowMonthlyGraph,
    selectedMonthlyData: ["10", "20"],
    selectedMonthlyDataExt: ["15", "25"],
    monthlyDataCumulative: ["30", "50"],
    monthlyDataExtCumulative: ["35", "60"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with header and body correctly", () => {
    render(<ModalComponentForGraph {...defaultProps} />);

    // Header
    expect(
      screen.getByText("Commits Monthly & Cumulative trends")
    ).toBeInTheDocument();

    // Charts should render twice (monthly + cumulative)
    const charts = screen.getAllByTestId("chart-mock");
    expect(charts).toHaveLength(2);
  });

  it("passes correct props to HighchartsReact for monthly chart", () => {
    render(<ModalComponentForGraph {...defaultProps} />);
    // HighchartsReact was called with options containing correct series
    const firstCall = HighchartsReact.mock.calls[0][0];
    expect(firstCall.options.series[0].name).toBe("2024");
    expect(firstCall.options.series[1].name).toBe("2025");
    expect(firstCall.options.series[0].data).toEqual([10, 20]); // converted from string
    expect(firstCall.options.series[1].data).toEqual([15, 25]);
  });

  it("passes correct props to HighchartsReact for cumulative chart", () => {
    render(<ModalComponentForGraph {...defaultProps} />);
    const secondCall = HighchartsReact.mock.calls[1][0];
    expect(secondCall.options.series[0].data).toEqual([30, 50]);
    expect(secondCall.options.series[1].data).toEqual([35, 60]);
  });

  it("calls handleShowMonthlyGraph with reset data on close", () => {
    render(<ModalComponentForGraph {...defaultProps} />);

    const modal = screen.getByTestId("smallScreenModal");
    fireEvent.click(modal); // triggers onClose

    expect(mockHandleShowMonthlyGraph).toHaveBeenCalledTimes(1);
    expect(mockHandleShowMonthlyGraph).toHaveBeenCalledWith({
      isClose: true,
      monthlyDataForGraph: [],
      monthlyDataExt: [],
      monthlyDataCumulative: [],
      monthlyDataExtCumulative: [],
    });
  });

  it("renders with empty data arrays without crashing", () => {
    render(
      <ModalComponentForGraph
        {...defaultProps}
        selectedMonthlyData={[]}
        selectedMonthlyDataExt={[]}
        monthlyDataCumulative={[]}
        monthlyDataExtCumulative={[]}
      />
    );

    const charts = screen.getAllByTestId("chart-mock");
    expect(charts).toHaveLength(2);
  });
});
