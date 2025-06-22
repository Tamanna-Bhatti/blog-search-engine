import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import NavigationBar from './components/NavigationBar';
import HomePage from './pages/HomePage';
import CrawlPage from './pages/CrawlPage';
import ClassifyPage from './pages/ClassifyPage';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <div className="flex flex-col min-h-screen">
          <NavigationBar />
          
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/crawl" element={<CrawlPage />} />
              <Route path="/classify" element={<ClassifyPage />} />
            </Routes>
          </main>

          <footer className="bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500">
                Blog Search Engine - Find authentic personal blog content
              </p>
            </div>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
