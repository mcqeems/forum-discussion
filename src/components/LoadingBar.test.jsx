/**
 * Skenario pengujian:
 *
 * - LoadingBar component
 *   - should render nothing when loading counter is zero
 *   - should render progressbar when loading counter is above zero
 */

import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import LoadingBar from './LoadingBar.jsx';
import loadingBarReducer from '../states/loadingBar/slice.js';

function renderWithCounter(counter) {
  const store = configureStore({ reducer: { loadingBar: loadingBarReducer }, preloadedState: { loadingBar: counter } });
  return render(
    <Provider store={store}>
      <LoadingBar />
    </Provider>,
  );
}

describe('LoadingBar component', () => {
  it('should render nothing when loading counter is zero', () => {
    const { container } = renderWithCounter(0);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it('should render progressbar when loading counter is above zero', () => {
    renderWithCounter(2);

    expect(screen.getByRole('progressbar', { name: 'memuat data' })).toBeInTheDocument();
  });
});
