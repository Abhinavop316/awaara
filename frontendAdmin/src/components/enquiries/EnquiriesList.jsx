import React, { useState, useEffect, useCallback } from "react";
import { enquiryApi } from "../../services/enquiryApi";
import {
  Mail,
  Phone,
  Calendar,
  Users,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Eye,
  MapPin,
  Sparkles,
} from "lucide-react";

export const EnquiriesList = ({ showToast }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await enquiryApi.getAllEnquiries();
      if (res && res.success && Array.isArray(res.enquiries)) {
        setEnquiries(res.enquiries);
      }
    } catch (err) {
      console.error("Error loading enquiries:", err);
      if (showToast) showToast("Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await enquiryApi.updateStatus(id, newStatus);
      if (res && res.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e)),
        );
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
        if (showToast) showToast(`Status updated to "${newStatus}"!`);
      }
    } catch {
      if (showToast) showToast("Error updating status.");
    }
  };

  const handleResendEmail = async (id) => {
    setActionLoading(true);
    try {
      const res = await enquiryApi.resendConfirmation(id);
      if (res && res.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, emailSent: true } : e)),
        );
        if (showToast)
          showToast("Confirmation email dispatched successfully.");
      } else {
        if (showToast) showToast(res.message || "Error dispatching email.");
      }
    } catch {
      if (showToast) showToast("Failed to resend confirmation email.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?"))
      return;
    try {
      const res = await enquiryApi.deleteEnquiry(id);
      if (res && res.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry(null);
        }
        if (showToast) showToast("Enquiry removed.");
      }
    } catch {
      if (showToast) showToast("Error deleting enquiry.");
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchSearch =
      !searchTerm ||
      e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone?.includes(searchTerm) ||
      e.placeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const countNew = enquiries.filter((e) => e.status === "new").length;
  const countContacted = enquiries.filter(
    (e) => e.status === "contacted",
  ).length;
  const countConverted = enquiries.filter(
    (e) => e.status === "converted",
  ).length;

  return (
    <div className="admin-places-view">
      {/* Action Header Toolbar (No duplicate title) */}
      <div className="admin-toolbar-row">
        <div className="toolbar-info">
          <div className="toolbar-badge">
            <Mail size={14} />
            <span>LEAD & INQUIRY PIPELINE</span>
          </div>
          <span className="toolbar-count">
            Showing <strong>{filteredEnquiries.length}</strong> of <strong>{enquiries.length}</strong> traveler inquiries
          </span>
        </div>

        <div className="toolbar-actions">
          <button
            className="btn btn-outline btn-sm filter-refresh-btn"
            onClick={fetchEnquiries}
            title="Refresh Enquiries"
          >
            <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh Leads
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="admin-kpi-grid kpi-4-col">
        <div className="kpi-card" onClick={() => setStatusFilter("all")}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb" }}>
            <Mail size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">TOTAL ENQUIRIES</span>
            <div className="kpi-value">{enquiries.length}</div>
            <span className="kpi-sub">Website itinerary requests</span>
          </div>
        </div>

        <div className="kpi-card highlight" onClick={() => setStatusFilter("new")}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(234, 88, 12, 0.12)", color: "#ea580c" }}>
            <Sparkles size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">NEW / PENDING</span>
            <div className="kpi-value" style={{ color: "#ea580c" }}>{countNew}</div>
            <span className="kpi-sub">Awaiting team follow-up</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setStatusFilter("contacted")}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(14, 165, 233, 0.12)", color: "#0284c7" }}>
            <Clock size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">CONTACTED</span>
            <div className="kpi-value" style={{ color: "#0284c7" }}>{countContacted}</div>
            <span className="kpi-sub">Itinerary shared with traveler</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setStatusFilter("converted")}>
          <div className="kpi-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#059669" }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">CONVERTED / BOOKED</span>
            <div className="kpi-value" style={{ color: "#059669" }}>{countConverted}</div>
            <span className="kpi-sub">Successfully closed bookings</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar-card">
        <div className="filter-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by traveler name, email, phone, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-text-input"
          />
        </div>

        <div className="filter-controls-group">
          <div className="filter-select-wrapper">
            <Filter size={14} className="filter-select-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select-input"
            >
              <option value="all">All Statuses ({enquiries.length})</option>
              <option value="new">New / Unread ({countNew})</option>
              <option value="contacted">Contacted ({countContacted})</option>
              <option value="converted">Converted ({countConverted})</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button className="btn btn-outline btn-sm filter-refresh-btn" onClick={fetchEnquiries} title="Refresh list">
            <RefreshCw size={14} className={loading ? "spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Enquiries SaaS Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading-state">
            <div className="spinner"></div>
            <p>Loading traveler inquiries & leads...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="admin-empty-state">
            <Sparkles size={38} color="var(--coral)" style={{ opacity: 0.8 }} />
            <h3>No Enquiries Found</h3>
            <p>
              When travelers browse India holiday destinations and submit custom inquiry forms,
              their details, timing, and confirmation status will display here.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-crm-table">
              <thead>
                <tr>
                  <th>Traveler</th>
                  <th>Destination Package</th>
                  <th>Travel Plan & Pax</th>
                  <th>Lead Status</th>
                  <th>Email Status</th>
                  <th>Received</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enq) => {
                  const initials = (enq.name || "T")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  const statusKey = (enq.status || "new").toLowerCase();

                  return (
                    <tr key={enq._id || enq.id} className="crm-table-row">
                      {/* Traveler Info */}
                      <td>
                        <div className="crm-traveler-cell">
                          <div className="crm-avatar">
                            {initials}
                          </div>
                          <div className="crm-traveler-details">
                            <span className="traveler-name">{enq.name}</span>
                            <div className="traveler-contacts">
                              <a href={`mailto:${enq.email}`} className="contact-link" title="Send email">
                                <Mail size={12} />
                                <span>{enq.email}</span>
                              </a>
                              {enq.phone && (
                                <a href={`tel:${enq.phone}`} className="contact-link" title="Call traveler">
                                  <Phone size={12} />
                                  <span>{enq.phone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Destination Package */}
                      <td>
                        <div className="crm-destination-cell">
                          <div className="destination-name">
                            <MapPin size={13} className="pin-icon" />
                            <span>{enq.placeName}</span>
                          </div>
                          <div className="destination-meta">
                            {enq.city ? `${enq.city}, ` : ""}
                            {enq.state} • {enq.duration || "5 Days"}
                          </div>
                        </div>
                      </td>

                      {/* Travel Timing & Pax */}
                      <td>
                        <div className="crm-plan-cell">
                          <div className="plan-timing">
                            <Calendar size={12} />
                            <span>{enq.timing || "Next 30–60 Days"}</span>
                          </div>
                          <div className="plan-pax">
                            <Users size={12} />
                            <span>{enq.passengers} Traveler(s) • From {enq.departureCity || "Delhi NCR"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Lead Status Dropdown */}
                      <td>
                        <select
                          value={statusKey}
                          onChange={(e) => handleStatusUpdate(enq._id, e.target.value)}
                          className={`crm-status-select status-${statusKey}`}
                        >
                          <option value="new">● New</option>
                          <option value="contacted">● Contacted</option>
                          <option value="converted">● Converted</option>
                          <option value="cancelled">● Cancelled</option>
                        </select>
                      </td>

                      {/* Email Delivery */}
                      <td>
                        {enq.emailSent ? (
                          <span className="email-status-pill sent">
                            <CheckCircle2 size={13} />
                            <span>Sent</span>
                          </span>
                        ) : (
                          <span className="email-status-pill pending">
                            <Clock size={13} />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Received Date */}
                      <td>
                        <span className="crm-date-text">
                          {enq.createdAt
                            ? new Date(enq.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Recently"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }}>
                        <div className="crm-actions-wrap">
                          <button
                            className="crm-action-btn"
                            onClick={() => setSelectedEnquiry(enq)}
                            title="View Full Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="crm-action-btn primary"
                            onClick={() => handleResendEmail(enq._id)}
                            title="Resend Confirmation Email"
                            disabled={actionLoading}
                          >
                            <Send size={14} />
                          </button>
                          <button
                            className="crm-action-btn danger"
                            onClick={() => handleDeleteEnquiry(enq._id)}
                            title="Delete Enquiry"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enquiry Detail Drawer / Modal */}
      {selectedEnquiry && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="modal-card"
            style={{ maxWidth: "580px", width: "92%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedEnquiry(null)}
            >
              &times;
            </button>

            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(224, 102, 63, 0.12)",
                  color: "var(--coral)",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "11.5px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                ENQUIRY DETAILS
              </div>
              <h3
                style={{
                  fontSize: "22px",
                  margin: "0 0 4px",
                  color: "var(--charcoal)",
                }}
              >
                {selectedEnquiry.name}
              </h3>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#666" }}>
                Holiday inquiry for <strong>{selectedEnquiry.placeName}</strong>{" "}
                ({selectedEnquiry.city}, {selectedEnquiry.state})
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#888",
                    textTransform: "uppercase",
                    fontWeight: "700",
                  }}
                >
                  Email Address
                </span>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginTop: "2px",
                  }}
                >
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    style={{ color: "#2563eb", textDecoration: "none" }}
                  >
                    {selectedEnquiry.email}
                  </a>
                </div>
              </div>

              <div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#888",
                    textTransform: "uppercase",
                    fontWeight: "700",
                  }}
                >
                  Phone Number
                </span>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginTop: "2px",
                  }}
                >
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    style={{ color: "#2563eb", textDecoration: "none" }}
                  >
                    {selectedEnquiry.phone}
                  </a>
                </div>
              </div>

              <div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#888",
                    textTransform: "uppercase",
                    fontWeight: "700",
                  }}
                >
                  Travel Timing
                </span>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginTop: "2px",
                  }}
                >
                  {selectedEnquiry.timing || "Not specified"}
                </div>
              </div>

              <div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#888",
                    textTransform: "uppercase",
                    fontWeight: "700",
                  }}
                >
                  Passengers & Departure
                </span>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginTop: "2px",
                  }}
                >
                  {selectedEnquiry.passengers} Pax • From{" "}
                  {selectedEnquiry.departureCity || "Delhi NCR"}
                </div>
              </div>
            </div>

            {selectedEnquiry.specialRequests && (
              <div style={{ marginBottom: "20px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    textTransform: "uppercase",
                    fontWeight: "700",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Traveler Special Requests / Notes:
                </span>
                <div
                  style={{
                    background: "#fefce8",
                    border: "1px solid #fef08a",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    fontSize: "13.5px",
                    color: "#713f12",
                    lineHeight: "1.5",
                  }}
                >
                  "{selectedEnquiry.specialRequests}"
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "16px",
                borderTop: "1px solid #eee",
              }}
            >
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleResendEmail(selectedEnquiry._id)}
                disabled={actionLoading}
              >
                <Send size={14} /> Resend Confirmation Email
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedEnquiry(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
