import React from 'react';
import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProjectsPage from './pages/admin/ProjectsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import ImagesPage from './pages/admin/ImagesPage';
import './App.css';

const queryClient = new QueryClient();

// 레이아웃 컴포넌트
const MainLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    {/* 관리자 라우트 */}
                    <Route path="/admin" element={<AdminLayout/>}>
                        <Route index element={<DashboardPage/>}/>
                        <Route path="dashboard" element={<DashboardPage/>}/>
                        <Route path="projects" element={<AdminProjectsPage/>}/>
                        <Route path="projects/:id/images" element={<ImagesPage/>}/>
                        <Route path="categories" element={<CategoriesPage/>}/>
                        <Route path="images" element={<ImagesPage/>}/>
                    </Route>

                    {/* 사용자 라우트 */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage/>}/>
                        <Route path="projects" element={<ProjectsPage/>}/>
                        <Route path="projects/:id" element={<ProjectDetailPage/>}/>
                        <Route path="about" element={<AboutPage/>}/>
                        <Route path="contact" element={<ContactPage/>}/>
                        {/* 404 페이지 */}
                        <Route path="*" element={<NotFoundPage/>}/>
                    </Route>
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;