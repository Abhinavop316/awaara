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
import { BusList } from './components/buses/BusList';
import { BusModal } from './components/buses/BusModal';
import { SeatLayoutStudio } from './components/busLayout/SeatLayoutStudio';
import { BookingsManifest } from './components/bookings/BookingsManifest';

export function AdminApp() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);

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
          onOpenNewBus={() => {
            setEditingBus(null);
            setIsBusModalOpen(true);
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
              onOpenNewBus={() => {
                setEditingBus(null);
                setIsBusModalOpen(true);
              }}
            />
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
              onOpenNewBus={() => {
                setEditingBus(null);
                setIsBusModalOpen(true);
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'buses' && (
            <BusList
              onEditBus={(bus) => {
                setEditingBus(bus);
                setIsBusModalOpen(true);
              }}
              onOpenNewBus={() => {
                setEditingBus(null);
                setIsBusModalOpen(true);
              }}
              onOpenStudioWithBus={() => setActiveTab('layout-studio')}
              showToast={showToast}
            />
          )}

          {activeTab === 'layout-studio' && (
            <SeatLayoutStudio showToast={showToast} />
          )}

          {activeTab === 'bookings' && (
            <BookingsManifest showToast={showToast} />
          )}
        </main>
      </div>

      {/* Modals */}
      <TripModal
        isOpen={isTripModalOpen}
        onClose={() => {
          setIsTripModalOpen(false);
          setEditingTrip(null);
        }}
        tripToEdit={editingTrip}
        onOpenNewBus={() => {
          setEditingBus(null);
          setIsBusModalOpen(true);
        }}
        showToast={showToast}
      />

      <BusModal
        isOpen={isBusModalOpen}
        onClose={() => {
          setIsBusModalOpen(false);
          setEditingBus(null);
        }}
        busToEdit={editingBus}
        showToast={showToast}
      />

      {/* Global Toast */}
      <Toast message={toastMessage} isVisible={isToastVisible} />
    </div>
  );
}

export default AdminApp;
