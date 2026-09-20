import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { makeRepoDetail, makeSearch, makeUserDetail } from '@/main/factories/pages'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={makeSearch()} />
        <Route path="/users/:username" element={makeUserDetail()} />
        <Route path="/users/:username/repos/:name" element={makeRepoDetail()} />
      </Routes>
    </BrowserRouter>
  )
}
