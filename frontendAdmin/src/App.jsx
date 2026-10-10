import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Toast } from './components/common/Toast';

// Views
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { TripList } from './components/trips/TripList';
import { TripModal } from './components/trips/TripModal';
import { PlaceList } from './components/places/PlaceList';
import { PlaceModal } from './components/places/PlaceModal';
import { EnquiriesList } from './components/enquiries/EnquiriesList';
import { BookingsManifest } from './components/bookings/BookingsManifest';

export function AdminApp() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2800);
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="admin-layout">
      {/* Left Sidebar / Mobile Drawer */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="admin-main">
        <Navbar
          activeTab={activeTab}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenNewTrip={() => {
            setEditingTrip(null);
            setIsTripModalOpen(true);
          }}
        />

        <main className="admin-content">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              onNavigateTab={setActiveTab}
              onOpenNewTrip={() => {
                setEditingTrip(null);
                setIsTripModalOpen(true);
              }}
            />
          )}

          {activeTab === 'holidays' && (
            <PlaceList
              onEditPlace={(place) => {
                setEditingPlace(place);
                setIsPlaceModalOpen(true);
              }}
              onOpenNewPlace={() => {
                setEditingPlace(null);
                setIsPlaceModalOpen(true);
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'enquiries' && (
            <EnquiriesList showToast={showToast} />
          )}

          {activeTab === 'trips' && (
            <TripList
              onEditTrip={(trip) => {
                setEditingTrip(trip);
                setIsTripModalOpen(true);
              }}
              onOpenNewTrip={() => {
                setEditingTrip(null);
                setIsTripModalOpen(true);
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsManifest
              showToast={showToast}
              onEditTrip={(trip) => {
                setEditingTrip(trip);
                setIsTripModalOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <PlaceModal
        isOpen={isPlaceModalOpen}
        onClose={() => {
          setIsPlaceModalOpen(false);
          setEditingPlace(null);
        }}
        placeToEdit={editingPlace}
        showToast={showToast}
        onSaveSuccess={() => {}}
      />

      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => {
          setIsTripModalOpen(false);
          setEditingTrip(null);
        }}
        tripToEdit={editingTrip}
        showToast={showToast}
      />

      {/* Global Toast */}
      <Toast message={toastMessage} isVisible={isToastVisible} />
    </div>
  );
}

export default AdminApp;
