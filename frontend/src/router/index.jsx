import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Spinner from '../components/Spinner'

const PortfolioPage = lazy(() => import('../pages/PortfolioPage'))
const LoginPage     = lazy(() => import('../pages/LoginPage'))
const BlogHome      = lazy(() => import('../pages/Blog_home'))
const Article       = lazy(() => import('../pages/Article'))
const TopicPage     = lazy(() => import('../pages/TopicPage'))
const Dashboard     = lazy(() => import('../pages/admin/Dashboard'))
const Posts         = lazy(() => import('../pages/admin/Posts'))
const EditCV        = lazy(() => import('../pages/admin/EditCV'))
const EditProfile   = lazy(() => import('../pages/admin/EditProfile'))
const Analytics     = lazy(() => import('../pages/admin/Analytics'))

function AppRouter() {
    return (
        <Suspense fallback={<Spinner />}>
        <Routes>
            <Route path="/"                   element={<PortfolioPage />} />
            <Route path="/login"              element={<LoginPage />} />
            <Route path="/blog"               element={<BlogHome />} />
            <Route path="/blog/topics/:type" element={<TopicPage />} />
            <Route path="/blog/:id"           element={<Article />} />
            <Route path="/admin"              element={<Dashboard />} />
            <Route path="/admin/posts"        element={<Posts />} />
            <Route path="/admin/edit-cv"      element={<EditCV />} />
            <Route path="/admin/edit-profile" element={<EditProfile />} />
            <Route path="/admin/analytics"    element={<Analytics />} />
        </Routes>
        </Suspense>
    )
}

export default AppRouter
