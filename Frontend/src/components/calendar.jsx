import React, { useState, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import axios from "axios";
import { format, addDays, startOfWeek, endOfWeek, parseISO } from "date-fns";

const styles = {
  container: {
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6'
  },
  headerWrapper: {
    flex: 'none',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    zIndex: 10
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '0.5rem'
  },
  processingOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  processingModal: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  spinner: {
    border: '2px solid #e5e7eb',
    borderTopColor: '#2563eb',
    borderRadius: '50%',
    width: '3rem',
    height: '3rem',
    animation: 'spin 1s linear infinite'
  },
  processingText: {
    fontSize: '1.125rem',
    fontWeight: 500,
    marginTop: '0.75rem'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  titleSection: {
    padding: '1rem'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  viewModeButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(30, 58, 138, 0.3)',
    borderRadius: '0.5rem',
    padding: '0.25rem'
  },
  viewBtn: {
    padding: '0.25rem 0.75rem',
    borderRadius: '0.375rem',
    color: '#dbeafe',
    transition: 'all 0.2s',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem'
  },
  viewBtnActive: {
    backgroundColor: '#2563eb',
    color: 'white'
  },
  navBar: {
    padding: '0.75rem 1rem',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem'
  },
  navBtn: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s'
  },
  dateTitle: {
    fontSize: '1.125rem',
    fontWeight: 500,
    color: '#1e3a8a'
  },
  navActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  addEventBtn: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background-color 0.2s'
  },
  formContainer: {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#eff6ff'
  },
  formTitle: {
    fontSize: '1.125rem',
    fontWeight: 500,
    marginBottom: '1rem',
    color: '#1e3a8a'
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  formLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151'
  },
  formInput: {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    color: '#111827',
    fontSize: '0.875rem'
  },
  formActions: {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1rem'
  },
  btnCancel: {
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background-color 0.2s'
  },
  btnSubmit: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background-color 0.2s'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  loadingState: {
    padding: '1.5rem',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    color: '#4b5563',
    marginLeft: '0.75rem'
  },
  errorState: {
    padding: '1.5rem',
    textAlign: 'center',
    color: '#dc2626'
  },
  emptyState: {
    padding: '1.5rem',
    textAlign: 'center',
    color: '#6b7280'
  },
  tableWrapper: {
    position: 'relative',
    overflowX: 'auto',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  table: {
    minWidth: '100%',
    borderCollapse: 'collapse'
  },
  thead: {
    background: 'linear-gradient(to right, #1d4ed8, #2563eb)',
    color: 'white'
  },
  th: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tbody: {
    backgroundColor: 'white'
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '1rem',
    whiteSpace: 'nowrap',
    fontSize: '0.875rem'
  },
  timeCell: {
    color: '#111827',
    fontWeight: 500
  },
  impactCell: {
    textAlign: 'center'
  },
  valueHigher: {
    color: '#16a34a',
    fontWeight: 500
  },
  valueLower: {
    color: '#dc2626',
    fontWeight: 500
  },
  valueEqual: {
    color: '#6b7280',
    fontWeight: 500
  },
  actionsCell: {
    textAlign: 'right',
    fontWeight: 500,
    whiteSpace: 'nowrap'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: '0.25rem 0.5rem',
    transition: 'color 0.2s'
  },
  editBtn: {
    color: '#2563eb',
    marginRight: '0.75rem'
  },
  deleteBtn: {
    color: '#dc2626'
  }
};

export default function Calendar() {
  const baseUrl = "https://backend-production-c0ab.up.railway.app";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("day"); // "day", "week", "month"
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [actionType, setActionType] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00",
    currency: "USD",
    impact: "medium",
    event_name: "",
    actual: "",
    forecast: "",
    previous: ""
  });

  useEffect(() => {
    fetchEvents();
  }, [currentDate, viewMode]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let start, end;
      
      if (viewMode === "day") {
        start = format(currentDate, "yyyy-MM-dd");
        end = format(currentDate, "yyyy-MM-dd");
      } else if (viewMode === "week") {
        start = format(startOfWeek(currentDate), "yyyy-MM-dd");
        end = format(endOfWeek(currentDate), "yyyy-MM-dd");
      } else {
        // Month view logic here
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        start = format(firstDayOfMonth, "yyyy-MM-dd");
        end = format(lastDayOfMonth, "yyyy-MM-dd");
      }
      
      const response = await axios.get(`${baseUrl}/api/economic-events/`, {
        params: { start_date: start, end_date: end }
      });
      setEvents(response.data);
    } catch (err) {
      setError("Failed to fetch events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (viewMode === "day") {
      setCurrentDate(prev => addDays(prev, -1));
    } else if (viewMode === "week") {
      setCurrentDate(prev => addDays(prev, -7));
    } else {
      // Month view
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "day") {
      setCurrentDate(prev => addDays(prev, 1));
    } else if (viewMode === "week") {
      setCurrentDate(prev => addDays(prev, 7));
    } else {
      // Month view
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setActionType(editingEvent ? "Saving" : "Adding");
    
    try {
      // Format the data for submission WITHOUT the 'Z' suffix
      const eventData = {
        ...formData,
        date_time: `${formData.date}T${formData.time}:00`,
      };
      
      if (editingEvent) {
        // Update existing event
        await axios.put(`${baseUrl}/api/economic-events/${editingEvent.id}/`, eventData);
      } else {
        // Create new event
        await axios.post(`${baseUrl}/api/economic-events/`, eventData);
      }
      
      // Reset form and refresh events
      setFormData({
        date: format(new Date(), "yyyy-MM-dd"),
        time: "10:00",
        currency: "USD",
        impact: "medium",
        event_name: "",
        actual: "",
        forecast: "",
        previous: ""
      });
      setShowAddForm(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      setError("Failed to save event");
      console.error(err);
    } finally {
      setProcessing(false);
      setActionType("");
    }
  };

  const handleEdit = (event) => {
    // Parse event data into form format
    const eventDate = parseISO(event.date_time);
    setFormData({
      date: format(eventDate, "yyyy-MM-dd"),
      time: format(eventDate, "HH:mm"),
      currency: event.currency,
      impact: event.impact,
      event_name: event.event_name,
      actual: event.actual || "",
      forecast: event.forecast || "",
      previous: event.previous || ""
    });
    setEditingEvent(event);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setProcessing(true);
      setActionType("Deleting");
      try {
        await axios.delete(`${baseUrl}/api/economic-events/${id}/`);
        fetchEvents();
      } catch (err) {
        setError("Failed to delete event");
        console.error(err);
      } finally {
        setProcessing(false);
        setActionType("");
      }
    }
  };

  // Function to extract numeric value from strings like "3.2%", "1.5B", "500K", etc.
  const extractNumericValue = (value) => {
    if (!value || value === "—") return null;
    
    // Remove all non-numeric characters except for decimal point
    const numericString = value.replace(/[^0-9.-]/g, '');
    
    // Convert to number
    const numericValue = parseFloat(numericString);
    
    // Check if it's a valid number
    if (isNaN(numericValue)) return null;
    
    return numericValue;
  };

  // Function to compare actual vs forecast values
  const compareValues = (actual, forecast) => {
    const actualValue = extractNumericValue(actual);
    const forecastValue = extractNumericValue(forecast);
    
    // If either value is not a valid number, return null (no comparison)
    if (actualValue === null || forecastValue === null) return null;
    
    if (actualValue > forecastValue) return 'higher';
    if (actualValue < forecastValue) return 'lower';
    return 'equal';
  };

  // Format title based on view mode
  const getTitle = () => {
    if (viewMode === "day") {
      return format(currentDate, "MMM d, yyyy");
    } else if (viewMode === "week") {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    } else {
      return format(currentDate, "MMMM yyyy");
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .spinner { animation: spin 1s linear infinite; }
          @media (min-width: 768px) {
            .calendar-content { padding: 1rem; }
            .nav-bar { padding: 0.75rem 1.5rem; }
            .form-container { padding: 1.5rem; }
            .form { grid-template-columns: repeat(2, 1fr); }
            .form-group-full { grid-column: 1 / -1; }
            .table th, .table td { padding: 0.75rem 1.5rem; }
          }
          .view-btn:hover { background-color: #1e3a8a; }
          .nav-btn:hover { background-color: #1d4ed8; }
          .add-event-btn:hover { background-color: #1d4ed8; }
          .btn-cancel:hover { background-color: #d1d5db; }
          .btn-submit:hover:not(:disabled) { background-color: #1d4ed8; }
          .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
          .table-row:hover { background-color: #eff6ff; }
          .edit-btn:hover { color: #1d4ed8; }
          .delete-btn:hover { color: #b91c1c; }
        `}
      </style>
      <div style={styles.headerWrapper}>
        <Header />
      </div>
      
      <div style={styles.main}>
        <SideNavs />
        
        <div style={styles.content} className="calendar-content">
          {/* Processing Overlay */}
          {processing && (
            <div style={styles.processingOverlay}>
              <div style={styles.processingModal}>
                <div style={styles.spinner} className="spinner"></div>
                <p style={styles.processingText}>{actionType}...</p>
              </div>
            </div>
          )}
          
          <div style={styles.card}>
            {/* Calendar Header */}
            <div style={styles.titleSection}>
              <h5 style={styles.title}>Trading Calendar</h5>
              
              <div style={styles.viewModeButtons}>
                <button 
                  onClick={() => setViewMode("day")} 
                  style={{...styles.viewBtn, ...(viewMode === "day" ? styles.viewBtnActive : {})}}
                  className="view-btn"
                >
                  Day
                </button>
                <button 
                  onClick={() => setViewMode("week")} 
                  style={{...styles.viewBtn, ...(viewMode === "week" ? styles.viewBtnActive : {})}}
                  className="view-btn"
                >
                  Week
                </button>
                <button 
                  onClick={() => setViewMode("month")} 
                  style={{...styles.viewBtn, ...(viewMode === "month" ? styles.viewBtnActive : {})}}
                  className="view-btn"
                >
                  Month
                </button>
              </div>
            </div>
            
            {/* Navigation Bar */}
            <div style={styles.navBar} className="nav-bar">
              <button 
                onClick={handlePrevious}
                style={styles.navBtn}
                className="nav-btn"
              >
                <span style={{marginRight: '0.25rem'}}>←</span> Previous
              </button>
              
              <h5 style={styles.dateTitle}>{getTitle()}</h5>
              
              <div style={styles.navActions}>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setFormData({
                      date: format(new Date(), "yyyy-MM-dd"),
                      time: "10:00",
                      currency: "USD",
                      impact: "medium",
                      event_name: "",
                      actual: "",
                      forecast: "",
                      previous: ""
                    });
                    setShowAddForm(!showAddForm);
                  }}
                  style={styles.addEventBtn}
                  className="add-event-btn"
                >
                  {showAddForm ? "Cancel" : "Add Event"}
                </button>
                
                <button 
                  onClick={handleNext}
                  style={styles.navBtn}
                  className="nav-btn"
                >
                  Next <span style={{marginLeft: '0.25rem'}}>→</span>
                </button>
              </div>
            </div>
            
            {/* Event Form */}
            {showAddForm && (
              <div style={styles.formContainer} className="form-container">
                <h5 style={styles.formTitle}>
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h5>
                <form onSubmit={handleSubmit} style={styles.form} className="form">
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Date</label>
                    <input 
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      style={styles.formInput}
                      required
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Time</label>
                    <input 
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      style={styles.formInput}
                      required
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Currency</label>
                    <select 
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      style={styles.formInput}
                      required
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                      <option value="AUD">AUD</option>
                      <option value="CAD">CAD</option>
                      <option value="CHF">CHF</option>
                      <option value="CNY">CNY</option>
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Impact</label>
                    <select 
                      name="impact"
                      value={formData.impact}
                      onChange={handleInputChange}
                      style={styles.formInput}
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div style={{...styles.formGroup, gridColumn: '1 / -1'}} className="form-group-full">
                    <label style={styles.formLabel}>Event Name</label>
                    <input 
                      type="text"
                      name="event_name"
                      value={formData.event_name}
                      onChange={handleInputChange}
                      style={styles.formInput}
                      required
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Actual</label>
                    <input 
                      type="text"
                      name="actual"
                      value={formData.actual}
                      onChange={handleInputChange}
                      style={styles.formInput}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Forecast</label>
                    <input 
                      type="text"
                      name="forecast"
                      value={formData.forecast}
                      onChange={handleInputChange}
                      style={styles.formInput}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Previous</label>
                    <input 
                      type="text"
                      name="previous"
                      value={formData.previous}
                      onChange={handleInputChange}
                      style={styles.formInput}
                    />
                  </div>
                  
                  <div style={styles.formActions}>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      style={styles.btnCancel}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={styles.btnSubmit}
                      className="btn-submit"
                      disabled={processing}
                    >
                      {editingEvent ? "Update Event" : "Add Event"}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Events Table */}
            <div style={styles.tableContainer}>
              {loading ? (
                <div style={styles.loadingState}>
                  <div style={styles.spinner} className="spinner"></div>
                  <span style={styles.loadingText}>Loading events...</span>
                </div>
              ) : error ? (
                <div style={styles.errorState}>{error}</div>
              ) : events.length === 0 ? (
                <div style={styles.emptyState}>No events for the selected period</div>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table} className="table">
                    <thead style={styles.thead}>
                      <tr>
                        <th style={styles.th}>Time</th>
                        <th style={styles.th}>Currency</th>
                        <th style={styles.th}>Impact</th>
                        <th style={styles.th}>Event</th>
                        <th style={styles.th}>Actual</th>
                        <th style={styles.th}>Forecast</th>
                        <th style={styles.th}>Previous</th>
                        <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody style={styles.tbody}>
                      {events.map((event) => {
                        const eventDate = parseISO(event.date_time);
                        const comparison = compareValues(event.actual, event.forecast);
                        
                        return (
                          <tr key={event.id} style={styles.tr} className="table-row">
                            <td style={{...styles.td, ...styles.timeCell}}>
                              {viewMode !== "day" && format(eventDate, "MMM d, ")}
                              {format(eventDate, "h:mm a")}
                            </td>
                            <td style={{...styles.td, ...styles.timeCell}}>
                              {event.currency}
                            </td>
                            <td style={{...styles.td, ...styles.impactCell}}>
                              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <span>
                                  {event.impact === "high" && "🔴"}
                                  {event.impact === "medium" && "🟠"} 
                                  {event.impact === "low" && "🟡"} 
                                </span>
                              </div>
                            </td>
                            <td style={styles.td}>
                              {event.event_name}
                            </td>
                            <td style={{
                              ...styles.td,
                              ...(comparison === 'higher' ? styles.valueHigher : 
                                  comparison === 'lower' ? styles.valueLower : 
                                  styles.valueEqual)
                            }}>
                              {event.actual || "—"}
                            </td>
                            <td style={styles.td}>
                              {event.forecast || "—"}
                            </td>
                            <td style={styles.td}>
                              {event.previous || "—"}
                            </td>
                            <td style={styles.actionsCell}>
                              <button 
                                onClick={() => handleEdit(event)} 
                                style={{...styles.actionBtn, ...styles.editBtn}}
                                className="edit-btn"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(event.id)} 
                                style={{...styles.actionBtn, ...styles.deleteBtn}}
                                className="delete-btn"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}