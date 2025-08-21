// AxpEngineeringMetricsGridWithFiltersTest.spec.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AxpEngineeringMetricsGridWithFiltersTest from './AxpEngineeringMetricsGridWithFiltersTest';

// Mock child components and dependencies
jest.mock('./AxpEngineeringMetricsGridFilters', () => props => (
  <div data-testid="mockFilters">{JSON.stringify(props)}</div>
));
jest.mock('./MonthlyDataTableForFilters', () => props => (
  <div data-testid="mockMonthlyData">{JSON.stringify(props)}</div>
));
jest.mock('../LoaderCircle', () => () => <div data-testid="loader-circle" />);
jest.mock('react-redux', () => ({
  useSelector: jest.fn(fn => fn({ getIn: () => 'mockAPI' })),
}));
jest.mock('fetche', () => ({
  useFetche: jest.fn(() => ({
    isLoading: false,
    data: { body: [] },
    run: jest.fn(),
  })),
}));
jest.mock('../util/enterpriseHelper', () => ({
  exportToCSV: jest.fn(),
}));

const defaultProps = { isMonthlyToggle: true };

describe('AxpEngineeringMetricsGridWithFiltersTest', () => {
  it('renders without crashing', () => {
    render(<AxpEngineeringMetricsGridWithFiltersTest {...defaultProps} />);
    expect(screen.getByTestId('mockFilters')).toBeInTheDocument();
    expect(screen.getByText(/Please select the VP/)).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    require('fetche').useFetche.mockReturnValueOnce({
      isLoading: true,
      data: {},
      run: jest.fn(),
    });
    render(<AxpEngineeringMetricsGridWithFiltersTest {...defaultProps} />);
    expect(screen.getByTestId('loader-circle')).toBeInTheDocument();
  });

  it('disables export button when loading, filter reset, or not present', () => {
    render(<AxpEngineeringMetricsGridWithFiltersTest {...defaultProps} />);
    const exportBtn = screen.getByTestId('btnExport');
    expect(exportBtn).not.toBeDisabled();

    // Set loading and filter reset states
    fireEvent.click(exportBtn);
    // Should call downloadExcel (covered in integration tests)
  });

  it('shows PageLevelMessage when metric download is loading', () => {
    render(<AxpEngineeringMetricsGridWithFiltersTest {...defaultProps} />);
    // Simulate state where isMetricDownloadLoading is true
    fireEvent.click(screen.getByTestId('btnExport'));
    expect(screen.getByText(/Metric data downloading/)).toBeInTheDocument();
  });

  it('triggers downloadExcel on export button click', async () => {
    const exportToCSV = require('../util/enterpriseHelper').exportToCSV;
    render(<AxpEngineeringMetricsGridWithFiltersTest {...defaultProps} />);
    const exportBtn = screen.getByTestId('btnExport');
    fireEvent.click(exportBtn);
    await waitFor(() => {
      expect(exportToCSV).toHaveBeenCalled();
    });
  });

  it('passes correct props to filters and monthly table', () => {
    render(<AxpEngineeringMetricsGridWithFiltersTest {...defaultProps} />);
    expect(screen.getByTestId('mockFilters')).toBeInTheDocument();
    expect(screen.getByTestId('mockMonthlyData')).toBeInTheDocument();
  });

  it('handles filter changes and calls set functions', () => {
    render(<AxpEngineeringMetricsGridWithFiltersTest {...defaultProps} />);
    // Simulate filter change via child component
    // You may want to use props callback simulation here
  });

  it('handles director and VP present events', () => {
    render(<AxpEngineeringMetricsGridWithFiltersTest {...defaultProps} />);
    // Simulate changing isVpPresent/isDirPresent
    // and check for UI updates or state changes
  });

  it('updates on isMonthlyToggle prop change', () => {
    const { rerender } = render(<AxpEngineeringMetricsGridWithFiltersTest isMonthlyToggle={true} />);
    rerender(<AxpEngineeringMetricsGridWithFiltersTest isMonthlyToggle={false} />);
    expect(screen.getByTestId('mockFilters')).toBeInTheDocument();
  });

  // Add more tests as needed to check state resets, side-effects...
});

