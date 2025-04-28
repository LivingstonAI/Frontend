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
  const [processing, setProcessing] = useState(null); // "saving", "deleting", null
  
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
    high: "bg-red-600",
    medium: "bg-orange-500",
    low: "bg-yellow-500"
  };

  const impactTextColors = {
    high: "text-red-600",
    medium: "text-orange-500",
    low: "text-yellow-500"
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
    setProcessing("saving");
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
      setProcessing(null);
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
      setProcessing("deleting");
      try {
        await axios.delete(`${baseUrl}/api/economic-events/${id}/`);
        fetchEvents();
      } catch (err) {
        setError("Failed to delete event");
        console.error(err);
      } finally {
        setProcessing(null);
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
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex-none">
        <Header />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <SideNavs />
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
              <h1 className="text-xl font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Trading Calendar
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2 bg-blue-800 bg-opacity-50 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode("day")} 
                    className={`px-3 py-1 rounded-md transition duration-200 ${viewMode === "day" ? "bg-blue-600 text-white" : "hover:bg-blue-700 text-blue-200"}`}
                  >
                    Day
                  </button>
                  <button 
                    onClick={() => setViewMode("week")} 
                    className={`px-3 py-1 rounded-md transition duration-200 ${viewMode === "week" ? "bg-blue-600 text-white" : "hover:bg-blue-700 text-blue-200"}`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setViewMode("month")} 
                    className={`px-3 py-1 rounded-md transition duration-200 ${viewMode === "month" ? "bg-blue-600 text-white" : "hover:bg-blue-700 text-blue-200"}`}
                  >
                    Month
                  </button>
                </div>
              </div>
            </div>
            
            {/* Navigation Bar */}
            <div className="px-6 py-3 bg-gray-700 flex flex-wrap items-center justify-between gap-2">
              <button 
                onClick={handlePrevious}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center transition duration-200 disabled:opacity-50"
                disabled={processing}
              >
                <span className="mr-1">←</span> Previous
              </button>
              
              <h2 className="text-lg font-medium text-white px-2">{getTitle()}</h2>
              
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
                  className={`bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition duration-200 flex items-center disabled:opacity-50`}
                  disabled={processing}
                >
                  {showAddForm ? (
                    <><span className="mr-1">×</span> Cancel</>
                  ) : (
                    <><span className="mr-1">+</span> Add Event</>
                  )}
                </button>
                
                <button 
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center transition duration-200 disabled:opacity-50"
                  disabled={processing}
                >
                  Next <span className="ml-1">→</span>
                </button>
              </div>
            </div>

            {/* Processing Indicator */}
            {processing && (
              <div className="p-2 bg-blue-900 text-white text-center animate-pulse">
                {processing === "saving" && (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving event...
                  </div>
                )}
                {processing === "deleting" && (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting event...
                  </div>
                )}
              </div>
            )}
            
            {/* Event Form */}
            {showAddForm && (
              <div className="p-6 border-b border-gray-600 bg-gray-750">
                <h3 className="text-lg font-medium mb-4 text-blue-300">
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Date</label>
                    <input 
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Time</label>
                    <input 
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Currency</label>
                    <select 
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-sm font-medium text-gray-300">Impact</label>
                    <select 
                      name="impact"
                      value={formData.impact}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300">Event Name</label>
                    <input 
                      type="text"
                      name="event_name"
                      value={formData.event_name}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Actual</label>
                    <input 
                      type="text"
                      name="actual"
                      value={formData.actual}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Forecast</label>
                    <input 
                      type="text"
                      name="forecast"
                      value={formData.forecast}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Previous</label>
                    <input 
                      type="text"
                      name="previous"
                      value={formData.previous}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition duration-200 disabled:opacity-50"
                      disabled={processing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200 flex items-center disabled:opacity-50"
                      disabled={processing === "saving"}
                    >
                      {processing === "saving" ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>{editingEvent ? "Update Event" : "Add Event"}</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Events Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading events...
                  </div>
                </div>
              ) : error ? (
                <div className="p-6 text-center text-red-400">{error}</div>
              ) : events.length === 0 ? (
                <div className="p-6 text-center text-gray-400">No events for the selected period</div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Currency
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Impact
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Event
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actual
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Forecast
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Previous
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-600">
                      {events.map((event) => {
                        const eventDate = parseISO(event.date_time);
                        return (
                          <tr key={event.id} className="hover:bg-gray-750 transition duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                              {viewMode !== "day" && format(eventDate, "MMM d, ")}
                              {format(eventDate, "h:mm a")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 font-medium">
                              {event.currency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex justify-center">
                                <div className={`w-3 h-3 rounded-full ${impactColors[event.impact]} shadow-lg shadow-${event.impact === 'high' ? 'red' : event.impact === 'medium' ? 'orange' : 'yellow'}-400/50`}
                                  title={`${event.impact} impact`}>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 font-medium">
                              {event.event_name}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${Number(event.actual) > Number(event.forecast) ? 'text-green-400' : Number(event.actual) < Number(event.forecast) ? 'text-red-400' : 'text-gray-200'}`}>
                              {event.actual || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {event.forecast || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {event.previous || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEdit(event)}
                                className="text-blue-400 hover:text-blue-300 mr-3 transition duration-150 disabled:opacity-50"
                                disabled={processing}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="text-red-400 hover:text-red-300 transition duration-150 disabled:opacity-50"
                                disabled={processing}
                              >
                                {processing === "deleting" ? "Deleting..." : "Delete"}
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
            <div className="px-6 py-4 bg-gray-750 rounded-b-lg flex flex-wrap items-center gap-4 text-sm border-t border-gray-600">
              <h4 className="font-medium text-gray-300">Impact Legend:</h4>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2 shadow-lg shadow-red-500/50"></span>
                <span className="text-gray-200">High</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2 shadow-lg shadow-orange-500/50"></span>
                <span className="text-gray-200">Medium</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2 shadow-lg shadow-yellow-500/50"></span>
                <span className="text-gray-200">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}