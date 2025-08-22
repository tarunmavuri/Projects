
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { OriginModal } from './components/OriginModal';
import { SettingsModal } from './components/SettingsModal';
import { LoginModal } from './components/LoginModal';
import { InfoModal } from './components/InfoModal';
import { LanguageModal } from './components/LanguageModal';
import { GuideDisplay } from './components/GuideDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { WelcomeMessage } from './components/WelcomeMessage';
import { AuthProviderModal } from './components/AuthProviderModal';
import { TripHistory } from './components/TripHistory';
import { generateTravelGuide, generateDestinationImage } from './services/geminiService';
import type { TravelGuide, TripHistoryItem, HotelPreference, TravelMode, GroundingChunk } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

type ModalType = 'origin' | 'settings' | 'login' | 'language' | 'faq' | 'privacy' | 'help' | 'auth_provider';

const MainApp: React.FC = () => {
  const [guide, setGuide] = useState<TravelGuide | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState<string>('');
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [authProvider, setAuthProvider] = useState<string | null>(null);
  const [tripHistory, setTripHistory] = useState<TripHistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('tripHistory');
      if (storedHistory) {
        setTripHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load trip history from localStorage", e);
      setTripHistory([]);
    }
  }, []);

  const updateTripHistory = (newItem: { destination: string; origin: string; hotelPreference: HotelPreference, travelMode: TravelMode }) => {
    setTripHistory(prevHistory => {
      const newHistory = [
        { ...newItem, timestamp: Date.now() },
        ...prevHistory.filter(item => item.destination.toLowerCase() !== newItem.destination.toLowerCase())
      ].slice(0, 5); // Keep last 5 trips

      try {
        localStorage.setItem('tripHistory', JSON.stringify(newHistory));
      } catch (e) {
        console.error("Failed to save trip history to localStorage", e);
      }
      return newHistory;
    });
  };

  const handleDestinationSubmit = useCallback((dest: string) => {
    if (!dest) return;
    setGuide(null);
    setSources([]);
    setError(null);
    setDestination(dest);
    setActiveModal('origin');
  }, []);

  const generateGuide = useCallback(async (dest: string, origin: string, hotelPreference: HotelPreference, travelMode: TravelMode) => {
    setIsLoading(true);
    setError(null);
    setGuide(null);
    setSources([]);
    setBackgroundImage('');

    try {
      // Generate guide first to get theme color, then fetch image in parallel
      const { guide: guideResult, sources: sourceResult } = await generateTravelGuide(dest, origin, hotelPreference, travelMode);
      setGuide(guideResult);
      setSources(sourceResult || []);
       if (guideResult.themeColorHex) {
          document.documentElement.style.setProperty('--accent-color', guideResult.themeColorHex);
      }
      
      const imageUrl = await generateDestinationImage(dest);
      if (imageUrl) {
        setBackgroundImage(imageUrl);
      }
      
      updateTripHistory({ destination: dest, origin, hotelPreference, travelMode });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOriginSubmit = useCallback(async (origin: string, hotelPreference: HotelPreference, travelMode: TravelMode) => {
    setActiveModal(null);
    await generateGuide(destination, origin, hotelPreference, travelMode);
  }, [destination, generateGuide]);

  const handleHistorySelect = useCallback(async (item: TripHistoryItem) => {
    setDestination(item.destination);
    await generateGuide(item.destination, item.origin, item.hotelPreference, item.travelMode);
  }, [generateGuide]);

  const handleCloseModals = useCallback(() => {
    setActiveModal(null);
    setAuthProvider(null);
  }, []);
  
  const handleNavigateModal = useCallback((modal: ModalType) => {
    setActiveModal(modal);
  }, []);
  
  const handleLogin = useCallback((userData: { name: string }) => {
    setUser(userData);
    setActiveModal(null);
    setAuthProvider(null);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setActiveModal(null);
  }, []);
  
  const handleAuthProviderSelect = useCallback((provider: string) => {
    setAuthProvider(provider);
    setActiveModal('auth_provider');
  }, []);

  const isModalOpen = activeModal !== null;
  const showWelcomeArea = !isLoading && !error && !guide && !isModalOpen;

  return (
    <div className="min-h-screen text-slate-200 font-sans">
      <div 
        className={`fixed inset-0 bg-cover bg-center transition-opacity duration-1000 ${backgroundImage ? 'animate-background-fade-in' : 'default-bg'}`}
        style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : '' }}
      ></div>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Header onSettingsClick={() => setActiveModal('settings')} user={user} />
        <main className="mt-8">
          <SearchForm onSearch={handleDestinationSubmit} isLoading={isLoading || isModalOpen} />

          {activeModal === 'origin' && (
            <OriginModal
              destination={destination}
              onConfirm={handleOriginSubmit}
              onCancel={handleCloseModals}
            />
          )}

          {activeModal === 'settings' && (
            <SettingsModal 
              user={user}
              onClose={handleCloseModals} 
              onNavigate={handleNavigateModal}
              onLogout={handleLogout}
            />
          )}
          
          {activeModal === 'login' && (
            <LoginModal onSelectProvider={handleAuthProviderSelect} onClose={handleCloseModals} onLogin={handleLogin} />
          )}

          {activeModal === 'auth_provider' && authProvider && (
            <AuthProviderModal 
              provider={authProvider}
              onLogin={handleLogin}
              onClose={handleCloseModals}
            />
          )}
          
          {(activeModal === 'faq' || activeModal === 'privacy' || activeModal === 'help') && (
            <InfoModal type={activeModal} onClose={handleCloseModals} />
          )}

          {activeModal === 'language' && (
              <LanguageModal onClose={handleCloseModals} />
          )}

          <div className="mt-12">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {guide && <GuideDisplay guide={guide} sources={sources} />}
            {showWelcomeArea && (
              tripHistory.length > 0 ? (
                <TripHistory history={tripHistory} onSelect={handleHistorySelect} />
              ) : (
                <WelcomeMessage onInspirationSelect={handleDestinationSubmit} />
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  )
}

export default App;