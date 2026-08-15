import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Award, CheckCircle, Bell, BellOff, Link2, PlusCircle } from 'lucide-react';

export default function EventsCalendar({ eventsList, setEventsList, triggerToast }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Registration form state
  const [studentName, setStudentName] = useState('');
  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentDept, setStudentDept] = useState('Computer Science & Engineering');

  // Add Event Form State
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newDept, setNewDept] = useState('Computer Science & Engineering');
  const [newCategory, setNewCategory] = useState('tech');
  const [newEligible, setNewEligible] = useState('Open to all branches');
  const [newDesc, setNewDesc] = useState('');

  // Toggle Reminder
  const toggleReminder = (id) => {
    const updated = eventsList.map((evt) => {
      if (evt.id === id) {
        const nextState = !evt.reminderSet;
        if (nextState) {
          triggerToast('Reminder Set', `You will receive a notification 1 hour before "${evt.title}" starts!`);
        } else {
          triggerToast('Reminder Cleared', `Reminder removed for "${evt.title}"`);
        }
        return { ...evt, reminderSet: nextState };
      }
      return evt;
    });
    setEventsList(updated);
  };

  // Submit Event Registration
  const handleRegisterEvent = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentRegNo.trim() || !studentEmail.trim()) {
      alert('All registration fields are required.');
      return;
    }
    
    // Simulate API registration
    const updated = eventsList.map((evt) => {
      if (evt.id === selectedEvent.id) {
        return { ...evt, participantsCount: evt.participantsCount + 1 };
      }
      return evt;
    });

    setEventsList(updated);
    triggerToast('Registered', `Successfully registered for "${selectedEvent.title}"! Ticket ID: SIMATS-${Math.floor(100000 + Math.random() * 900000)}`);
    setShowRegModal(false);
    
    // Reset Form
    setStudentName('');
    setStudentRegNo('');
    setStudentEmail('');
  };

  // Create Custom Event Announcement
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate.trim() || !newVenue.trim()) {
      alert('Event Title, Date, and Venue are required.');
      return;
    }
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      date: newDate,
      time: newTime || '10:00 AM - 04:00 PM',
      venue: newVenue,
      organizingDept: newDept,
      category: newCategory,
      eligibility: newEligible,
      registrationLink: 'https://saveetha.com/events',
      description: newDesc || 'No details provided.',
      reminderSet: false,
      participantsCount: 1
    };

    setEventsList([newEvent, ...eventsList]);
    triggerToast('Success', `Event "${newTitle}" announced!`);
    setShowAddEvent(false);
    
    // Reset form
    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setNewVenue('');
    setNewDesc('');
  };

  // Filter Categories
  const filteredEvents = eventsList.filter((evt) => {
    if (activeFilter === 'all') return true;
    return evt.category === activeFilter;
  });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>College Events Calendar</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Ongoing and upcoming workshops, conferences, and culturals happening at SIMATS.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => setShowAddEvent(true)}>
          <PlusCircle size={18} /> Announce Event
        </button>
      </div>

      {/* Tabs / Filter buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {['all', 'tech', 'cultural', 'academic'].map((cat) => (
          <button 
            key={cat} 
            className={`btn ${activeFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.5rem 1.2rem', textTransform: 'capitalize', fontSize: '0.85rem' }}
            onClick={() => setActiveFilter(cat)}
          >
            {cat === 'all' ? 'Show All' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Events */}
      <div className="grid-2">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between', position: 'relative' }}>
            
            {/* Category Tag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`badge ${
                evt.category === 'tech' ? 'badge-blue' : evt.category === 'cultural' ? 'badge-pink' : 'badge-yellow'
              }`}>
                {evt.category}
              </span>
              <button 
                onClick={() => toggleReminder(evt.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: evt.reminderSet ? 'var(--accent-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.8rem'
                }}
              >
                {evt.reminderSet ? <Bell size={18} /> : <BellOff size={18} />}
                <span>{evt.reminderSet ? 'Reminder Active' : 'Set Reminder'}</span>
              </button>
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '0.5rem', marginBottom: '0.5rem' }}>{evt.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                {evt.description}
              </p>

              {/* Event Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} color="var(--accent-primary)" />
                  <span><strong>Date:</strong> {evt.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} color="var(--accent-primary)" />
                  <span><strong>Time:</strong> {evt.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} color="var(--accent-primary)" />
                  <span><strong>Venue:</strong> {evt.venue}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={14} color="var(--accent-primary)" />
                  <span><strong>Eligible:</strong> {evt.eligibility}</span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                👥 {evt.participantsCount} registered participants
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a 
                  href={evt.registrationLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  <Link2 size={12} /> Link
                </a>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  onClick={() => {
                    setSelectedEvent(evt);
                    setShowRegModal(true);
                  }}
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No upcoming events matching this category. Check back later!
        </div>
      )}

      {/* Registration Modal */}
      {showRegModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowRegModal(false)}>✕</button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Event Registration Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Signing up for: <strong style={{ color: 'white' }}>{selectedEvent.title}</strong>
            </p>

            <form onSubmit={handleRegisterEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Full Name:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Adarsh" 
                  className="glass-input" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Register Number:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 191501001" 
                    className="glass-input" 
                    value={studentRegNo}
                    onChange={(e) => setStudentRegNo(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>College Email:</label>
                  <input 
                    type="email" 
                    placeholder="e.g. register@saveetha.com" 
                    className="glass-input" 
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Department:</label>
                <select className="glass-input glass-select" value={studentDept} onChange={(e) => setStudentDept(e.target.value)}>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                  <option value="Bio-Technology">Bio-Technology</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm Registration
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRegModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announce Event Modal */}
      {showAddEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowAddEvent(false)}>✕</button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.2rem' }}>Announce Campus Event</h3>

            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Event Title:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Aero Drone Flight Show 2026" 
                  className="glass-input" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Event Date:</label>
                  <input 
                    type="date" 
                    className="glass-input" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Event Time:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 10:00 AM - 01:00 PM" 
                    className="glass-input" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Venue Location:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. College OAT / Block A Seminar Hall" 
                    className="glass-input" 
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Organizing Department/Club:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aero Club / Coding Club" 
                    className="glass-input" 
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Event Category:</label>
                  <select className="glass-input glass-select" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="tech">Technical Event</option>
                    <option value="cultural">Cultural Event</option>
                    <option value="academic">Academic / Seminar</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Eligibility Criteria:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CSE & ECE branches only / Open to all" 
                    className="glass-input" 
                    value={newEligible}
                    onChange={(e) => setNewEligible(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Event Description:</label>
                <textarea 
                  rows="3" 
                  placeholder="Share a short brief about the event schedule, rules, and rewards..."
                  className="glass-input"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Announcement
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddEvent(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
