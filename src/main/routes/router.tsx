import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { makeRepoDetail, makeSearch, makeUserDetail } from '@/main/factories/pages'
import { makeUserProfileLayout } from '@/main/factories/layouts'
import { Footer } from '@/presentation/components/footer'
import { Header } from '@/presentation/components/header'

export function Router() {
  return (
    <BrowserRouter>
      <div className="flex h-screen flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={makeSearch()} />
            <Route path="/users/:username" element={makeUserProfileLayout()}>
              <Route index element={makeUserDetail()} />
              <Route path="repos/:name" element={makeRepoDetail()} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
