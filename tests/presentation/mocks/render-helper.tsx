import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

type Options = {
  route?: string
  path?: string
  probes?: Record<string, ReactElement>
  children?: ReactElement
}

export const renderWithRouter = (ui: ReactElement, options: Options = {}) => {
  const { route = '/', path = '/', probes = {}, children } = options

  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui}>
          {children}
        </Route>
        {Object.entries(probes).map(([probePath, element]) => (
          <Route key={probePath} path={probePath} element={element} />
        ))}
      </Routes>
    </MemoryRouter>,
  )
}
