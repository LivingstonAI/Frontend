import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Device } from 'twilio-client';
import axios from 'axios';

export default function CallAI() {
    const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, connected, disconnected
    const [device, setDevice] = useState(null);
    const [connection, setConnection] = useState(null);
    const [logs, setLogs] = useState([]);
    const [twilioToken, setTwilioToken] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Add a log message with timestamp
    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prevLogs => [...prevLogs, `[${timestamp}] ${message}`]);
    };
    
    // Initialize Twilio device when token is available
    useEffect(() => {
        if (!twilioToken) return;
        
        const initializeTwilio = async () => {
            try {
                const newDevice = new Device(twilioToken);
                
                newDevice.on('ready', () => {
                    addLog('Twilio device is ready');
                });
                
                newDevice.on('error', (error) => {
                    addLog(`Error: ${error.message}`);
                    setCallStatus('idle');
                });
                
                newDevice.on('connect', (conn) => {
                    setConnection(conn);
                    setCallStatus('connected');
                    addLog('Call connected');
                    
                    conn.on('disconnect', () => {
                        setCallStatus('disconnected');
                        addLog('Call disconnected');
                    });
                });
                
                newDevice.on('disconnect', () => {
                    setConnection(null);
                    setCallStatus('disconnected');
                    addLog('Call ended');
                });
                
                setDevice(newDevice);
                addLog('Twilio device initialized');
            } catch (error) {
                addLog(`Failed to initialize Twilio: ${error.message}`);
            }
        };
        
        initializeTwilio();
        
        return () => {
            if (device) {
                device.destroy();
            }
        };
    }, [twilioToken]);
    
    // Get Twilio token from Django backend
    const fetchTwilioToken = async () => {
        try {
            setIsLoading(true);
            // Using Django's CSRF token for security
            const csrfToken = Cookies.get('csrftoken');
            
            const response = await axios.post('/api/twilio/token/', {}, {
                headers: {
                    'X-CSRFToken': csrfToken
                }
            });
            
            setTwilioToken(response.data.token);
            addLog('Received Twilio token');
        } catch (error) {
            addLog(`Failed to get Twilio token: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Initialize when component mounts
    useEffect(() => {
        fetchTwilioToken();
    }, []);
    
    // Start a call to the OpenAI-powered service
    const startCall = async () => {
        if (!device) {
            addLog('Twilio device not initialized');
            return;
        }
        
        if (!phoneNumber) {
            addLog('Please enter a phone number');
            return;
        }
        
        try {
            setCallStatus('connecting');
            addLog(`Calling ${phoneNumber}...`);
            
            // Get OpenAI API key (stored securely in cookies or use from backend)
            const openAiApiKey = Cookies.get('openai_api_key') || '';
            
            const conn = await device.connect({
                To: phoneNumber,
                openAiApiKey: openAiApiKey,
            });
            
            setConnection(conn);
        } catch (error) {
            addLog(`Call failed: ${error.message}`);
            setCallStatus('idle');
        }
    };
    
    // End the current call
    const endCall = () => {
        if (connection) {
            connection.disconnect();
            setConnection(null);
            setCallStatus('disconnecting');
            addLog('Ending call...');
        }
    };
    
    return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">
                    <h5 className="major-upcoming-news-events-header">Call Livingston</h5>
                    
                    <div className="caller-container">
                        <div className="caller-input-group">
                            <input 
                                type="text" 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter phone number" 
                                className="phone-input"
                                disabled={callStatus !== 'idle' && callStatus !== 'disconnected'}
                            />
                            
                            {(callStatus === 'idle' || callStatus === 'disconnected') && (
                                <button 
                                    onClick={startCall} 
                                    className="call-button"
                                    disabled={!device || !phoneNumber || isLoading}
                                >
                                    {isLoading ? "Loading..." : "Start Call"}
                                </button>
                            )}
                            
                            {(callStatus === 'connecting' || callStatus === 'connected') && (
                                <button 
                                    onClick={endCall} 
                                    className="end-call-button"
                                >
                                    End Call
                                </button>
                            )}
                        </div>
                        
                        <div className="call-status">
                            Status: {callStatus.charAt(0).toUpperCase() + callStatus.slice(1)}
                        </div>
                        
                        <div className="call-logs">
                            <h6>Activity Log</h6>
                            <div className="logs-container">
                                {logs.map((log, index) => (
                                    <div key={index} className="log-entry">
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}