import React, { useState, useEffect } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import axios from "axios";
import { format, addDays, startOfWeek, endOfWeek, parseISO } from "date-fns";

export default function Calendar() {
  const baseUrl = "https://backend-production-c0ab.up.railway.app";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("day"); // "day", "week", "month"
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  
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

  // Impact color mapping and indicators
  const impactColors = {
    high: "#e53e3e", // red
    medium: "#ed8936", // orange
    low: "#ecc94b" // yellow
  };

  const impactLabels = {
    high: "High",
    medium: "Medium",
    low: "Low"
  };

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
    try {
      // Set processing state
      setProcessingAction(editingEvent ? "Updating..." : "Adding...");
      
      // Format the data for submission
      const eventData = {
        ...formData,
        date_time: `${formData.date}T${formData.time}:00Z`,
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
      setProcessingAction(null);
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
      try {
        setProcessingAction("Deleting...");
        await axios.delete(`${baseUrl}/api/economic-events/${id}/`);
        fetchEvents();
      } catch (err) {
        setError("Failed to delete event");
        console.error(err);
      } finally {
        setProcessingAction(null);
      }
    }
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-none">
        <Header />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <SideNavs />
        
        <div className="flex-1 overflow-y-auto p-2 md:p-4">
          <div className="bg-white rounded-lg shadow-md">
            {/* Calendar Header */}
            <div className="bg-blue-900 text-white px-3 md:px-6 py-3 rounded-t-lg flex flex-col md:flex-row justify-between items-center">
              <h1 className="text-xl font-bold mb-2 md:mb-0">
                <span className="hidden md:inline">Forex Factory </span>
                Economic Calendar
              </h1>
              
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <button 
                    onClick={() => setViewMode("day")} 
                    className={`px-2 py-1 text-sm rounded ${viewMode === "day" ? "bg-blue-700" : "hover:bg-blue-800"}`}
                  >
                    Day
                  </button>
                  <button 
                    onClick={() => setViewMode("week")} 
                    className={`px-2 py-1 text-sm rounded ${viewMode === "week" ? "bg-blue-700" : "hover:bg-blue-800"}`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setViewMode("month")} 
                    className={`px-2 py-1 text-sm rounded ${viewMode === "month" ? "bg-blue-700" : "hover:bg-blue-800"}`}
                  >
                    Month
                  </button>
                </div>
              </div>
            </div>
            
            {/* Navigation Bar */}
            <div className="px-3 md:px-6 py-2 bg-gray-200 flex flex-wrap items-center justify-between">
              <button 
                onClick={handlePrevious}
                className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded flex items-center text-sm"
              >
                <span className="mr-1">←</span> Previous
              </button>
              
              <h2 className="text-base md:text-lg font-medium mx-2">{getTitle()}</h2>
              
              <div className="flex space-x-2 mt-2 md:mt-0">
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
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                >
                  {showAddForm ? "Cancel" : "Add Event"}
                </button>
                
                <button 
                  onClick={handleNext}
                  className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded flex items-center text-sm"
                >
                  Next <span className="ml-1">→</span>
                </button>
              </div>
            </div>
            
            {/* Processing Status */}
            {processingAction && (
              <div className="p-2 bg-blue-100 text-blue-800 text-center font-medium">
                {processingAction}
              </div>
            )}
            
            {/* Event Form */}
            {showAddForm && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium mb-3 text-blue-900">
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input 
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input 
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select 
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Impact</label>
                    <select 
                      name="impact"
                      value={formData.impact}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Event Name</label>
                    <input 
                      type="text"
                      name="event_name"
                      value={formData.event_name}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Actual</label>
                    <input 
                      type="text"
                      name="actual"
                      value={formData.actual}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Forecast</label>
                    <input 
                      type="text"
                      name="forecast"
                      value={formData.forecast}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Previous</label>
                    <input 
                      type="text"
                      name="previous"
                      value={formData.previous}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm"
                      disabled={processingAction !== null}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                      disabled={processingAction !== null}
                    >
                      {editingEvent ? "Update Event" : "Add Event"}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Events Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  <p className="mt-2 text-gray-600">Loading events...</p>
                </div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">{error}</div>
              ) : events.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No events for the selected period</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Currency
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Impact
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Actual
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Forecast
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Previous
                      </th>
                      <th scope="col" className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => {
                      const eventDate = parseISO(event.date_time);
                      return (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {viewMode !== "day" && format(eventDate, "MMM d, ")}
                            {format(eventDate, "h:mm a")}
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {event.currency}
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: impactColors[event.impact] }}
                              ></span>
                              <span className="text-xs text-gray-500 hidden md:inline">
                                {impactLabels[event.impact]}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {event.event_name}
                          </td>
                          <td className={`px-3 md:px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell ${Number(event.actual) > Number(event.forecast) ? 'text-green-600 font-medium' : Number(event.actual) < Number(event.forecast) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {event.actual || "-"}
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                            {event.forecast || "-"}
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                            {event.previous || "-"}
                          </td>
                          <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(event)}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                              disabled={processingAction !== null}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={processingAction !== null}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Color Legend */}
            <div className="px-3 md:px-6 py-3 bg-gray-100 rounded-b-lg flex flex-wrap items-center space-x-4 text-xs">
              <h4 className="font-medium">Impact Legend:</h4>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: impactColors.high }}></span>
                <span>High</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: impactColors.medium }}></span>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: impactColors.low }}></span>
                <span>Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}