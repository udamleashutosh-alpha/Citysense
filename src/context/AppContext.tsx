import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type { PageKey, SafetyReport, Place } from '@/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/utils/storage';
import { sampleSafetyReports } from '@/data/insights';
import { punePlaces } from '@/data/places';

interface AppContextValue {
  page: PageKey;
  setPage: (page: PageKey) => void;
  selectedPlaceId: string | null;
  setSelectedPlaceId: (id: string | null) => void;
  selectedPlace: Place | null;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  reports: SafetyReport[];
  addReport: (report: Omit<SafetyReport, 'id' | 'timestamp' | 'status'>) => void;
  updateReportStatus: (id: string, status: SafetyReport['status']) => void;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  allReports: SafetyReport[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPageState] = useState<PageKey>('discover');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() =>
    loadFromStorage<string[]>(STORAGE_KEYS.bookmarks, [])
  );
  const [reports, setReports] = useState<SafetyReport[]>(() =>
    loadFromStorage<SafetyReport[]>(STORAGE_KEYS.reports, [])
  );
  const [compareIds, setCompareIds] = useState<string[]>(() =>
    loadFromStorage<string[]>(STORAGE_KEYS.compareList, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.bookmarks, bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.reports, reports);
  }, [reports]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.compareList, compareIds);
  }, [compareIds]);

  const setPage = useCallback((p: PageKey) => {
    setPageState(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.includes(id),
    [bookmarks]
  );

  const addReport = useCallback(
    (report: Omit<SafetyReport, 'id' | 'timestamp' | 'status'>) => {
      const newReport: SafetyReport = {
        ...report,
        id: `usr-${Date.now()}`,
        timestamp: Date.now(),
        status: 'Unverified',
      };
      setReports((prev) => [newReport, ...prev]);
    },
    []
  );

  const updateReportStatus = useCallback(
    (id: string, status: SafetyReport['status']) => {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    },
    []
  );

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, id];
    });
  }, []);

  const isInCompare = useCallback(
    (id: string) => compareIds.includes(id),
    [compareIds]
  );

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const allReports = useMemo(
    () => [...reports, ...sampleSafetyReports],
    [reports]
  );

  const selectedPlace = useMemo(
    () => punePlaces.find((p) => p.id === selectedPlaceId) ?? null,
    [selectedPlaceId]
  );

  const value: AppContextValue = {
    page,
    setPage,
    selectedPlaceId,
    setSelectedPlaceId,
    selectedPlace,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    reports,
    addReport,
    updateReportStatus,
    compareIds,
    toggleCompare,
    isInCompare,
    clearCompare,
    allReports,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
