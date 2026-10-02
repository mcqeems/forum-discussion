/**
 * Skenario pengujian:
 *
 * - CategoryFilter component
 *   - should render Semua button and all categories
 *   - should mark the selected category as active
 *   - should call onSelect with the category when a chip is clicked
 *   - should call onSelect with empty string when the active chip is clicked again
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from './CategoryFilter.jsx';

describe('CategoryFilter component', () => {
  it('should render Semua button and all categories', () => {
    render(<CategoryFilter categories={['react', 'redux']} selected="" onSelect={() => {}} />);

    expect(screen.getByText('Semua')).toBeInTheDocument();
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#redux')).toBeInTheDocument();
  });

  it('should mark the selected category as active', () => {
    render(<CategoryFilter categories={['react', 'redux']} selected="react" onSelect={() => {}} />);

    expect(screen.getByText('#react')).toHaveClass('chip-active');
    expect(screen.getByText('#redux')).not.toHaveClass('chip-active');
    expect(screen.getByText('Semua')).not.toHaveClass('chip-active');
  });

  it('should call onSelect with the category when a chip is clicked', async () => {
    const onSelect = vi.fn();
    render(<CategoryFilter categories={['react', 'redux']} selected="" onSelect={onSelect} />);

    await userEvent.click(screen.getByText('#redux'));

    expect(onSelect).toHaveBeenCalledWith('redux');
  });

  it('should call onSelect with empty string when the active chip is clicked again', async () => {
    const onSelect = vi.fn();
    render(<CategoryFilter categories={['react']} selected="react" onSelect={onSelect} />);

    await userEvent.click(screen.getByText('#react'));

    expect(onSelect).toHaveBeenCalledWith('');
  });
});
