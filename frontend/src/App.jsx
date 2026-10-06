import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DisclaimerFooter from './components/DisclaimerFooter';

import Home from './pages/Home';
import DatasetPage from './pages/DatasetPage';
import RiskAnalysisPage from './pages/RiskAnalysisPage';
import PortfolioPage from './pages/PortfolioPage';
import ComparisonPage from './pages/ComparisonPage';
import CorrelationPage from './pages/CorrelationPage';
import ResultsPage from './pages/ResultsPage';
import MethodologyPage from './pages/MethodologyPage';

import { fetchDatasetSummary } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [summary, setSummary] = useState(null);
  const [isDemo, setIsDemo] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    async function initSummary() {
      try {
        const res = await fetchDatasetSummary();
        setSummary(res.quality_summary);
        setIsDemo(res.is_demo);
      } catch (err) {
        console.warn("Could not fetch dataset summary from Flask backend:", err);
      }
    }
    initSummary();
  }, []);

  const availableStocks = summary?.stocks || [
    "HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK",
    "TCS", "INFY", "WIPRO", "SUNPHARMA", "DRREDDY",
    "TATAMOTORS", "MARUTI", "RELIANCE", "NTPC",
    "LT", "ITC", "HINDUNILVR", "BAJFINANCE"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Fixed Header */}
      <Navbar 
        isDemo={isDemo} 
        qualitySummary={summary} 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />

      {/* Main Layout Body */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activePage === 'home' && (
            <Home 
              setActivePage={setActivePage} 
              summary={summary} 
              portfolioData={portfolioData} 
            />
          )}

          {activePage === 'dataset' && (
            <DatasetPage 
              summary={summary} 
              setSummary={setSummary} 
              isDemo={isDemo} 
              setIsDemo={setIsDemo} 
              setActivePage={setActivePage} 
            />
          )}

          {activePage === 'risk' && (
            <RiskAnalysisPage availableStocks={availableStocks} />
          )}

          {activePage === 'portfolio' && (
            <PortfolioPage 
              availableStocks={availableStocks} 
              setPortfolioData={setPortfolioData} 
            />
          )}

          {activePage === 'comparison' && (
            <ComparisonPage availableStocks={availableStocks} />
          )}

          {activePage === 'correlation' && (
            <CorrelationPage availableStocks={availableStocks} />
          )}

          {activePage === 'results' && (
            <ResultsPage />
          )}

          {activePage === 'methodology' && (
            <MethodologyPage />
          )}

          <DisclaimerFooter />
        </main>
      </div>
    </div>
  );
}
