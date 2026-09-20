import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecentSearchesPanel } from '@/presentation/pages/search/components/recent-searches'

describe('RecentSearchesPanel', () => {
  it('should render an empty state and no clear button when there are no recent searches', () => {
    render(<RecentSearchesPanel usernames={[]} onSelect={() => {}} onClear={() => {}} />)

    expect(screen.getByTestId('recent-searches-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('clear-recent-searches')).not.toBeInTheDocument()
    expect(screen.queryByTestId('recent-search-item')).not.toBeInTheDocument()
  })

  it('should render one item per username', () => {
    render(<RecentSearchesPanel usernames={['diego3g', 'torvalds']} onSelect={() => {}} onClear={() => {}} />)

    const items = screen.getAllByTestId('recent-search-item')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('diego3g')
    expect(items[1]).toHaveTextContent('torvalds')
  })

  it('should call onSelect with the username when an item is clicked', async () => {
    const onSelect = vi.fn()
    render(<RecentSearchesPanel usernames={['diego3g']} onSelect={onSelect} onClear={() => {}} />)

    await userEvent.click(screen.getByTestId('recent-search-item'))

    expect(onSelect).toHaveBeenCalledWith('diego3g')
  })

  it('should call onClear when the clear button is clicked', async () => {
    const onClear = vi.fn()
    render(<RecentSearchesPanel usernames={['diego3g']} onSelect={() => {}} onClear={onClear} />)

    await userEvent.click(screen.getByTestId('clear-recent-searches'))

    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
