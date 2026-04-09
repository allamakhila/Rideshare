import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { FaPaperPlane, FaTimes, FaUserCircle, FaCar } from 'react-icons/fa';

function ChatBox({ booking, onClose, currentUser, otherUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history
  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8081/api/chat/history/${booking.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data);
      
      // Mark messages as read
      await axios.put(
        `http://localhost:8081/api/chat/read/${booking.id}?userId=${currentUser.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // Connect to WebSocket
  useEffect(() => {
    fetchChatHistory();

    const socket = new SockJS('http://localhost:8081/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log('Connected to chat WebSocket');
      
      // Subscribe to chat room
      client.subscribe(`/topic/chat/${booking.id}`, (message) => {
        const receivedMsg = JSON.parse(message.body);
        setMessages(prev => [...prev, receivedMsg]);
        
        // If message is from other user, mark as read
        if (receivedMsg.senderId !== currentUser.id) {
          markAsRead();
        }
      });
  
  // Subscribe to unread count updates (only once)
  client.subscribe(`/topic/chat/unread/${currentUser.id}`, (message) => {
    const count = JSON.parse(message.body);
    if (window.updateUnreadCount) {
      window.updateUnreadCount(count);
    }
  });
};

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [booking.id, currentUser.id]);

  const markAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8081/api/chat/read/${booking.id}?userId=${currentUser.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const message = {
        bookingId: booking.id,
        senderId: currentUser.id,
        senderEmail: currentUser.email,
        senderName: currentUser.name,
        receiverId: otherUser.id,
        receiverEmail: otherUser.email,
        message: newMessage,
        type: 'TEXT'
      };

      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.publish({
          destination: '/app/chat.send',
          body: JSON.stringify(message),
        });
      } else {
        // Fallback to REST API
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8081/api/chat/send', message, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchChatHistory();
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
    },
    chatContainer: {
      width: '450px',
      maxWidth: '90%',
      height: '600px',
      background: 'white',
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    },
    chatHeader: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      padding: '16px 20px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rideInfo: {
      fontSize: '12px',
      opacity: 0.8,
      marginTop: '4px',
    },
    closeButton: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      background: '#f8fafc',
    },
    dateDivider: {
      textAlign: 'center',
      margin: '16px 0',
      position: 'relative',
    },
    dateText: {
      background: '#e2e8f0',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      color: '#475569',
    },
    messageRow: (isOwn) => ({
      display: 'flex',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
    }),
    messageBubble: (isOwn) => ({
      maxWidth: '70%',
      padding: '10px 14px',
      borderRadius: '18px',
      background: isOwn ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'white',
      color: isOwn ? 'white' : '#1e293b',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    }),
    messageTime: {
      fontSize: '10px',
      marginTop: '4px',
      opacity: 0.7,
      textAlign: 'right',
    },
    typingIndicator: {
      padding: '8px 16px',
      color: '#64748b',
      fontSize: '12px',
      fontStyle: 'italic',
    },
    inputContainer: {
      padding: '16px',
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      gap: '12px',
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      outline: 'none',
      fontSize: '14px',
    },
    sendButton: {
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      border: 'none',
      borderRadius: '50%',
      width: '44px',
      height: '44px',
      cursor: 'pointer',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.chatContainer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.chatHeader}>
          <div style={styles.headerInfo}>
            <div style={styles.avatar}>
              <FaUserCircle size={24} />
            </div>
            <div>
              <div><strong>{otherUser.name}</strong></div>
              <div style={styles.rideInfo}>
                <FaCar size={10} style={{ marginRight: '4px' }} />
                {booking.ride?.source} → {booking.ride?.destination}
              </div>
            </div>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div style={styles.messagesContainer}>
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div style={styles.dateDivider}>
                <span style={styles.dateText}>{date}</span>
              </div>
              {msgs.map((msg) => (
                <div key={msg.id} style={styles.messageRow(msg.senderId === currentUser.id)}>
                  <div style={styles.messageBubble(msg.senderId === currentUser.id)}>
                    <div>{msg.message}</div>
                    <div style={styles.messageTime}>
                      {formatTime(msg.createdAt)}
                      {msg.senderId === currentUser.id && msg.isRead && (
                        <span style={{ marginLeft: '4px' }}>✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.sendButton} disabled={loading}>
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;