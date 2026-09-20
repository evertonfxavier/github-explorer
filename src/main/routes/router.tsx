import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { makeRepoDetail, makeSearch, makeUserDetail } from '@/main/factories/pages'
import { Footer } from '@/presentation/components/footer'
import { Header } from '@/presentation/components/header'

export function Router() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={makeSearch()} />
            <Route path="/users/:username" element={makeUserDetail()} />
            <Route path="/users/:username/repos/:name" element={makeRepoDetail()} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
