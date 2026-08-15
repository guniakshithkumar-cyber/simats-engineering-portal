import React, { useState } from 'react';
import { Users, ExternalLink, Award, Calendar, Activity, Check, CheckCircle2, Heart } from 'lucide-react';

export default function ClubsHub({ clubsList, setClubsList, triggerToast }) {
  const [selectedClub, setSelectedClub] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Join form states
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentDept, setStudentDept] = useState('Computer Science & Engineering');
  const [studentYear, setStudentYear] = useState('1st Year');
  const [motivationText, setMotivationText] = useState('');

  const handleJoinClub = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) {
      alert('Name and Email are required.');
      return;
    }

    triggerToast('Applied!', `Application to join "${selectedClub.name}" submitted successfully! You will receive confirmation via ${studentEmail}.`);
    setShowJoinModal(false);

    // Reset Form
    setStudentName('');
    setStudentEmail('');
    setMotivationText('');
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Clubs & Organizations Hub</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Explore active technical cells, cultural clubs, innovation houses, and register for club memberships.</p>
      </div>

      {/* Clubs Grid */}
      <div className="grid-2" style={{ marginBottom: '3rem' }}>
        {clubsList.map((club) => (
          <div key={club.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{club.logo}</span>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{club.name}</h3>
                    <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{club.type}</span>
                  </div>
                </div>
                <a href={club.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }} className="hover-link">
                  <ExternalLink size={18} />
                </a>
              </div>

              {/* Schedule and Details */}
              <div style={{ margin: '1rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>🗓️ <strong>Weekly Meetings:</strong> {club.meetingSchedule}</div>
                <div>💰 <strong>Fee:</strong> {club.membershipFee}</div>
              </div>

              {/* Core Activities */}
              <div style={{ margin: '1rem 0' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Activity size={14} color="var(--accent-primary)" /> Weekly Activities
                </h4>
                <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingLeft: '0.2rem' }}>
                  {club.activities.map((act, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <Check size={12} color="var(--accent-tertiary)" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Achievements Showcase */}
              <div style={{ margin: '1rem 0', background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245, 158, 11, 0.15)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fbbf24', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Award size={14} /> Club Achievements
                </h4>
                <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {club.achievements.map((ach, i) => (
                    <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.3rem' }}>
                      <span>🏆</span> <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Past Event Galleries */}
              <div style={{ margin: '1rem 0' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>Past Event Photos</h4>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {club.gallery.map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt="Club Activity" 
                      style={{ 
                        width: '100px', 
                        height: '70px', 
                        objectFit: 'cover', 
                        borderRadius: '4px', 
                        border: '1px solid var(--glass-border)',
                        flexShrink: 0 
                      }} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Socials & Registration */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.8rem' }}>
                {club.socials.instagram && (
                  <a href={club.socials.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover-link">
                    Instagram
                  </a>
                )}
                {club.socials.linkedin && (
                  <a href={club.socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover-link">
                    LinkedIn
                  </a>
                )}
              </div>

              <button 
                className="btn btn-primary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                onClick={() => {
                  setSelectedClub(club);
                  setShowJoinModal(true);
                }}
              >
                Join Club
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Join Membership Modal */}
      {showJoinModal && selectedClub && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowJoinModal(false)}>✕</button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Membership Registration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Applying to join: <strong style={{ color: 'white' }}>{selectedClub.name}</strong>
            </p>

            <form onSubmit={handleJoinClub} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Full Name:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Priyan" 
                  className="glass-input" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Student Email:</label>
                  <input 
                    type="email" 
                    placeholder="e.g. student@sec.saveetha.com" 
                    className="glass-input" 
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Year of Study:</label>
                  <select className="glass-input glass-select" value={studentYear} onChange={(e) => setStudentYear(e.target.value)}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
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

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Why do you want to join this club?</label>
                <textarea 
                  rows="3" 
                  placeholder="Share a short brief about your skills, interests, and motivation..."
                  className="glass-input"
                  value={motivationText}
                  onChange={(e) => setMotivationText(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit Membership Request
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowJoinModal(false)}>
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
