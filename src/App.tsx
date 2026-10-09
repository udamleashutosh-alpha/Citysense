import { AppProvider, useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import PlaceDetailsModal from '@/components/PlaceDetailsModal';
import DiscoverPage from '@/pages/DiscoverPage';
import MapPage from '@/pages/MapPage';
import SafetyPage from '@/pages/SafetyPage';
import ComparePage from '@/pages/ComparePage';
import HeritagePage from '@/pages/HeritagePage';
import ReportsPage from '@/pages/ReportsPage';
import InsightsPage from '@/pages/InsightsPage';
import AboutPage from '@/pages/AboutPage';

function PageRouter() {
  const { page, selectedPlaceId, setSelectedPlaceId } = useApp();

  switch (page) {
    case 'discover':
      return <DiscoverPage />;
    case 'map':
      return <MapPage />;
    case 'safety':
      return <SafetyPage />;
    case 'compare':
      return <ComparePage />;
    case 'heritage':
      return <HeritagePage />;
    case 'reports':
      return <ReportsPage />;
    case 'insights':
      return <InsightsPage />;
    case 'about':
      return <AboutPage />;
    default:
      return <DiscoverPage />;
  }
}

function AppContent() {
  const { selectedPlaceId, setSelectedPlaceId, page } = useApp();

  return (
    <Layout>
      <PageRouter />
      {/* Details modal accessible from any page */}
      {selectedPlaceId && page === 'discover' && (
        <PlaceDetailsModal
          placeId={selectedPlaceId}
          onClose={() => setSelectedPlaceId(null)}
        />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
