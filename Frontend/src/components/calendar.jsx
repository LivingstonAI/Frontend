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

  // Impact color mapping
  const impactColors = {
    high: "#e53e3e", // red-600
    medium: "#ed8936", // orange-500
    low: "#ecc94b" // yellow-500
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
    setProcessing(true);
    setActionType(editingEvent ? "Saving" : "Adding");
    
    try {
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

  // Button styles
  const btnPrimary = "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";
  const btnSecondary = "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50";
  const btnSmall = "px-3 py-1 text-sm";
  const btnDanger = "bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50";
  
  // Input styles
  const inputStyle = "block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-none shadow-md z-10">
        <Header />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <SideNavs />
        
        <div className="flex-1 overflow-y-auto p-2 md:p-4">
          {/* Processing Overlay */}
          {processing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-3"></div>
                <p className="text-lg font-medium">{actionType}...</p>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Calendar Header */}
            <div className="">
              <h5 className="text-xl font-bold">Trading Calendar</h5>
              
              <div className="flex items-center space-x-2 bg-blue-900 bg-opacity-30 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode("day")} 
                  className={`btn btn-primary px-3 py-1 rounded ${viewMode === "day" ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-800"} transition-colors duration-200`}
                >
                  Day
                </button>
                <button 
                  onClick={() => setViewMode("week")} 
                  className={`btn btn-primary px-3 py-1 rounded ${viewMode === "week" ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-800"} transition-colors duration-200`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setViewMode("month")} 
                  className={`btn btn-primary px-3 py-1 rounded ${viewMode === "month" ? "bg-blue-600 text-white" : "text-blue-100 hover:bg-blue-800"} transition-colors duration-200`}
                >
                  Month
                </button>
              </div>
            </div>
            
            {/* Navigation Bar */}
            <div className="px-4 md:px-6 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
              <button 
                onClick={handlePrevious}
                className={`btn btn-primary ${btnSmall} flex items-center`}
              >
                <span className="mr-1">←</span> Previous
              </button>
              
              <h2 className="text-lg font-medium text-blue-900">{getTitle()}</h2>
              
              <div className="flex space-x-2">
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
                  className="btn btn-primary"
                >
                  {showAddForm ? "Cancel" : "Add Event"}
                </button><br /><br />
                
                <button 
                  onClick={handleNext}
                  className={`btn btn-primary ${btnSmall} flex items-center`}
                >
                  Next <span className="ml-1">→</span>
                </button>
              </div>
            </div>
            
            {/* Event Form */}
            {showAddForm && (
              <div className="p-4 md:p-6 border-b border-gray-200 bg-blue-50">
                <h3 className="text-lg font-medium mb-4 text-blue-900">
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
                      className={inputStyle}
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
                      className={inputStyle}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select 
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className={inputStyle}
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
                      className={inputStyle}
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
                      className={inputStyle}
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
                      className={inputStyle}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Forecast</label>
                    <input 
                      type="text"
                      name="forecast"
                      value={formData.forecast}
                      onChange={handleInputChange}
                      className={inputStyle}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Previous</label>
                    <input 
                      type="text"
                      name="previous"
                      value={formData.previous}
                      onChange={handleInputChange}
                      className={inputStyle}
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="btn btn-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={processing}
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
                <div className="p-6 text-center flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-gray-600">Loading events...</span>
                </div>
              ) : error ? (
                <div className="p-6 text-center text-red-500">{error}</div>
              ) : events.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No events for the selected period</div>
              ) : (
                <div className="relative overflow-x-auto shadow-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
                      <tr>
                        <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Currency
                        </th>
                        <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Impact
                        </th>
                        <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Event
                        </th>
                        <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Actual
                        </th>
                        <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Forecast
                        </th>
                        <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Previous
                        </th>
                        <th scope="col" className="px-4 md:px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event) => {
                        const eventDate = parseISO(event.date_time);
                        return (
                          <tr key={event.id} className="hover:bg-blue-50 transition-colors duration-200">
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {viewMode !== "day" && format(eventDate, "MMM d, ")}
                              {format(eventDate, "h:mm a")}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {event.currency}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: impactColors[event.impact] }}
                                ></div>
                                <span className="text-sm capitalize">{event.impact}</span>
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {event.event_name}
                            </td>
                            <td className={`px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium ${Number(event.actual) > Number(event.forecast) ? 'text-green-600' : Number(event.actual) < Number(event.forecast) ? 'text-red-600' : 'text-gray-900'}`}>
                              {event.actual || "—"}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {event.forecast || "—"}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {event.previous || "—"}
                            </td>
                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEdit(event)}
                                className="btn btn-primary text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="btn btn-primary text-red-600 hover:text-red-800 transition-colors duration-200"
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
            
            {/* Color Legend */}
            {/* <div className="px-4 md:px-6 py-3 bg-gray-50 rounded-b-lg flex flex-wrap items-center space-x-4 text-sm border-t border-gray-200">
              <h4 className="font-medium text-gray-700">Impact Legend:</h4>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                <span>High</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span>Low</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}