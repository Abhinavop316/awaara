import React, { useState, useEffect } from 'react';
import { placeApi } from '../../services/placeApi';
import { enquiryApi } from '../../services/enquiryApi';
import {
  MapPin,
  Mail,
  Compass,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const DashboardOverview = ({ onNavigateTab, onOpenNewPlace }) => {
  const [places, setPlaces] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [placesRes, enquiriesRes] = await Promise.allSettled([
          placeApi.getAllPlaces({ limit: 100 }),
          enquiryApi.getAllEnquiries()
        ]);

        if (isMounted) {
          if (placesRes.status === 'fulfilled' && placesRes.value?.places) {
            setPlaces(placesRes.value.places);
          }
          if (enquiriesRes.status === 'fulfilled' && enquiriesRes.value?.enquiries) {
            setEnquiries(enquiriesRes.value.enquiries);
          }
        }
      } catch (err) {
        console.warn('Dashboard data fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const totalStates = new Set(places.map((p) => p.state).filter(Boolean)).size;
  const newEnquiriesCount = enquiries.filter((e) => (e.status || 'New').toLowerCase() === 'new').length;
  const recentEnquiries = enquiries.slice(0, 5);
  const featuredPlaces = places.slice(0, 4);

  return (
    <div className="admin-dashboard-view">
      {/* 4 Executive KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card" onClick={() => onNavigateTab('holidays')}>
          <div className="kpi-icon-wrap" style={{ background: 'rgba(224, 102, 63, 0.1)', color: 'var(--coral)' }}>
            <MapPin size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">HOLIDAY DESTINATIONS</span>
            <div className="kpi-value">{places.length}</div>
            <span className="kpi-sub">Curated Indian travel packages</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('holidays')}>
          <div className="kpi-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
            <Compass size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">STATES COVERED</span>
            <div className="kpi-value">{totalStates || 12}</div>
            <span className="kpi-sub">Pan-India scenic regions</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigateTab('enquiries')}>
          <div className="kpi-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
            <Mail size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">TOTAL LEADS & ENQUIRIES</span>
            <div className="kpi-value">{enquiries.length}</div>
            <span className="kpi-sub">Received from travelers</span>
          </div>
        </div>

        <div className="kpi-card highlight" onClick={() => onNavigateTab('enquiries')}>
          <div className="kpi-icon-wrap" style={{ background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c' }}>
            <Clock size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">PENDING FOLLOW-UPS</span>
            <div className="kpi-value" style={{ color: '#ea580c' }}>{newEnquiriesCount}</div>
            <span className="kpi-sub">Awaiting concierge contact</span>
          </div>
        </div>
      </div>

      {/* Hero Welcome & Quick Action Banner */}
      <div className="admin-banner-card">
        <div className="banner-text">
          <div className="banner-badge">
            <Sparkles size={13} />
            <span>HOLIDAY PACKAGES & LEADS PORTAL</span>
          </div>
          <h2>Curated India Holidays Management</h2>
          <p>
            Create bespoke travel packages with day-by-day itineraries, track incoming traveler inquiries,
            and follow up with custom proposals.
          </p>
        </div>
        <div className="banner-actions">
          <button className="btn btn-primary" onClick={onOpenNewPlace}>
            <Plus size={16} /> New Holiday Package
          </button>
          <button className="btn btn-outline-light" onClick={() => onNavigateTab('enquiries')}>
            Manage Leads <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Two Panes Grid */}
      <div className="dashboard-panes-grid">
        {/* Left Pane: Recent Traveler Enquiries */}
        <div className="admin-pane-card">
          <div className="pane-header">
            <div>
              <h3>Recent Traveler Enquiries</h3>
              <p>Latest customized itinerary requests</p>
            </div>
            <button className="pane-link-btn" onClick={() => onNavigateTab('enquiries')}>
              View All ({enquiries.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div className="pane-content">
            {recentEnquiries.length > 0 ? (
              <div className="dashboard-leads-list">
                {recentEnquiries.map((enq) => (
                  <div key={enq._id} className="dashboard-lead-item">
                    <div className="lead-avatar">
                      {(enq.name || 'T')[0].toUpperCase()}
                    </div>
                    <div className="lead-main">
                      <div className="lead-name-row">
                        <strong>{enq.name}</strong>
                        <span className={`status-badge-pill status-${(enq.status || 'New').toLowerCase()}`}>
                          {enq.status || 'New'}
                        </span>
                      </div>
                      <div className="lead-destination">
                        <MapPin size={12} />
                        <span>{enq.placeName}</span>
                        <span className="lead-meta-sep">•</span>
                        <span>{enq.timing || 'Upcoming Season'}</span>
                      </div>
                      <div className="lead-contact">
                        <span>{enq.phone}</span>
                        <span className="lead-meta-sep">•</span>
                        <span>{enq.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pane-empty">
                <Mail size={32} color="#9ca3af" />
                <p>No traveler inquiries yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Top Holiday Destinations */}
        <div className="admin-pane-card">
          <div className="pane-header">
            <div>
              <h3>Curated Holiday Destinations</h3>
              <p>Active India travel itineraries</p>
            </div>
            <button className="pane-link-btn" onClick={() => onNavigateTab('holidays')}>
              View All ({places.length}) <ArrowRight size={14} />
            </button>
          </div>

          <div className="pane-content">
            {featuredPlaces.length > 0 ? (
              <div className="dashboard-places-list">
                {featuredPlaces.map((place) => (
                  <div key={place._id || place.id} className="dashboard-place-item">
                    <img
                      src={place.img}
                      alt={place.name}
                      className="dashboard-place-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="dashboard-place-info">
                      <strong>{place.name}</strong>
                      <div className="dashboard-place-meta">
                        <span>{place.city}, {place.state}</span>
                        <span className="lead-meta-sep">•</span>
                        <span>{place.days || `${place.durationDays || 5} Days`}</span>
                      </div>
                      <div className="dashboard-place-price">
                        From ₹{place.price?.toLocaleString('en-IN') || '14,999'}/person
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pane-empty">
                <Compass size={32} color="#9ca3af" />
                <p>No holiday destinations loaded.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
