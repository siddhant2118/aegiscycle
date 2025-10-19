
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import HowItWorksPage from './pages/HowItWorksPage';
import EvidencePage from './pages/EvidencePage';
import CliniciansPage from './pages/CliniciansPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import DocsPage from './pages/DocsPage';

const App: React.FC = () => {
    return (
        <ThemeProvider defaultTheme="system" storageKey="aegiscycle-theme">
            <ToastProvider>
                <HashRouter>
                    <MainLayout />
                </HashRouter>
            </ToastProvider>
        </ThemeProvider>
    );
};

const MainLayout: React.FC = () => {
    const location = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-200">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/demo" element={<DemoPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/evidence" element={<EvidencePage />} />
                    <Route path="/clinicians" element={<CliniciansPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/docs" element={<DocsPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;
