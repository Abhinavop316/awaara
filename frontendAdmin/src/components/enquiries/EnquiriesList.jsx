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
          showToast("Resend API email dispatched successfully! 📧");
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
      {/* Top Header & Actions */}
      <div className="view-header-row">
        <div>
          <h2>Holiday Enquiries & Leads</h2>
          <p className="view-subtitle">
            Review custom trip inquiries from travelers and manage Resend email
            confirmations.
          </p>
        </div>

        <div className="view-header-actions">
          <button
            className="btn btn-outline btn-sm"
            onClick={fetchEnquiries}
            title="Refresh Enquiries"
          >
            <RefreshCw size={15} /> Refresh Leads
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div
        className="stats-cards-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          marginBottom: "24px",
        }}
      >
        <div className="stat-card">
          <div className="stat-label">TOTAL ENQUIRIES</div>
          <div className="stat-value">{enquiries.length}</div>
          <div className="stat-sub">From website visitors</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">NEW / PENDING</div>
          <div className="stat-value" style={{ color: "#e0663f" }}>
            {countNew}
          </div>
          <div className="stat-sub">Awaiting team follow-up</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">CONTACTED</div>
          <div className="stat-value" style={{ color: "#2563eb" }}>
            {countContacted}
          </div>
          <div className="stat-sub">Itinerary shared with traveler</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">CONVERTED / BOOKED</div>
          <div className="stat-value" style={{ color: "#16a34a" }}>
            {countConverted}
          </div>
          <div className="stat-sub">Successfully converted</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="panel-card"
        style={{ padding: "16px 20px", marginBottom: "20px" }}
      >
        <div
          className="places-filter-bar"
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            className="search-input-wrapper"
            style={{ flex: "1", minWidth: "240px", position: "relative" }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#888",
              }}
            />
            <input
              type="text"
              placeholder="Search by traveler name, email, phone, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "36px", width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Filter size={15} color="#666" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
              style={{ minWidth: "150px" }}
            >
              <option value="all">All Statuses</option>
              <option value="new">New / Unread</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="panel-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <div className="spinner-sm" style={{ margin: "0 auto 12px" }}></div>
            <p style={{ color: "#888", fontSize: "14px" }}>
              Loading traveler inquiries...
            </p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <Sparkles
              size={36}
              color="var(--coral)"
              style={{ margin: "0 auto 12px", opacity: 0.8 }}
            />
            <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>
              No Enquiries Found
            </h3>
            <p
              style={{
                color: "#888",
                fontSize: "13.5px",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              When travelers browse India holiday destinations and submit the
              enquiry form, their details and Resend email status will show up
              here.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Traveler</th>
                  <th>Destination</th>
                  <th>Timing & Pax</th>
                  <th>Status</th>
                  <th>Resend Email</th>
                  <th>Received</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enq) => (
                  <tr key={enq._id || enq.id}>
                    <td>
                      <div
                        style={{
                          fontWeight: "700",
                          color: "var(--charcoal)",
                          fontSize: "14px",
                        }}
                      >
                        {enq.name}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          fontSize: "12px",
                          color: "#666",
                          marginTop: "2px",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Mail size={12} /> {enq.email}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Phone size={12} /> {enq.phone}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "var(--charcoal)",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <MapPin size={14} color="var(--coral)" />
                        <span>{enq.placeName}</span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#777",
                          marginTop: "2px",
                        }}
                      >
                        {enq.city ? `${enq.city}, ` : ""}
                        {enq.state} • {enq.duration || "5 Days"}
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "#444",
                        }}
                      >
                        {enq.timing || "Upcoming Month"}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#777",
                          marginTop: "2px",
                        }}
                      >
                        👥 {enq.passengers} Traveler(s) • From{" "}
                        {enq.departureCity || "Delhi NCR"}
                      </div>
                    </td>

                    <td>
                      <select
                        value={enq.status || "new"}
                        onChange={(e) =>
                          handleStatusUpdate(enq._id, e.target.value)
                        }
                        className={`status-select status-${enq.status || "new"}`}
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid #ddd",
                          cursor: "pointer",
                        }}
                      >
                        <option value="new">🟡 New</option>
                        <option value="contacted">🔵 Contacted</option>
                        <option value="converted">🟢 Converted</option>
                        <option value="cancelled">⚪ Cancelled</option>
                      </select>
                    </td>

                    <td>
                      {enq.emailSent ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "#16a34a",
                            fontSize: "12px",
                            fontWeight: "700",
                            background: "#dcfce7",
                            padding: "3px 8px",
                            borderRadius: "999px",
                          }}
                        >
                          <CheckCircle2 size={13} /> Sent via Resend
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            color: "#ca8a04",
                            fontSize: "12px",
                            fontWeight: "700",
                            background: "#fef9c3",
                            padding: "3px 8px",
                            borderRadius: "999px",
                          }}
                        >
                          <Clock size={13} /> Pending
                        </span>
                      )}
                    </td>

                    <td style={{ fontSize: "12px", color: "#888" }}>
                      {enq.createdAt
                        ? new Date(enq.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Recently"}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          className="btn-icon"
                          onClick={() => setSelectedEnquiry(enq)}
                          title="View Full Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleResendEmail(enq._id)}
                          title="Resend Confirmation Email"
                          disabled={actionLoading}
                        >
                          <Send size={15} color="#2563eb" />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDeleteEnquiry(enq._id)}
                          title="Delete Enquiry"
                          style={{ color: "#ef4444" }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                <Send size={14} /> Resend Email via Resend
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
