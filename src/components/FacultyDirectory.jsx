import React, { useState } from 'react';
import { Search, Mail, Phone, MapPin, Clock, BookOpen, Star } from 'lucide-react';

export default function FacultyDirectory({ facultyList, departments }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Filter faculty listings
  const filteredDirectory = facultyList.filter((fac) => {
    const matchesSearch = fac.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          fac.subjectsTaught.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          fac.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'All' || fac.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Faculty Contact Directory</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Quick-search official contact emails, phone extensions, office cabins, and weekly consultation schedules.</p>
      </div>

      {/* Directory Filters */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
          <input 
            type="text" 
            placeholder="Search by faculty name, subject, or email..." 
            className="glass-input" 
            style={{ paddingLeft: '2.8rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ minWidth: '220px' }}>
          <select className="glass-input glass-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
            <option value="All">All Departments</option>
            {departments.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid-3">
        {filteredDirectory.map((fac) => (
          <div key={fac.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>{fac.department}</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.2rem 0' }}>{fac.name}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <Star size={12} fill="currentColor" color="var(--accent-warning)" />
                <span>Rating: <strong>{(fac.rating / 20).toFixed(1)} / 5.0</strong></span>
              </div>

              {/* Contact Specific details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={14} color="var(--accent-primary)" style={{ minWidth: '14px' }} />
                  <a href={`mailto:${fac.email}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', wordBreak: 'break-all' }} className="hover-link">
                    {fac.email}
                  </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={14} color="var(--accent-primary)" style={{ minWidth: '14px' }} />
                  <span>{fac.phone}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <MapPin size={14} color="var(--accent-primary)" style={{ minWidth: '14px', marginTop: '2px' }} />
                  <span>{fac.office}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Clock size={14} color="var(--accent-primary)" style={{ minWidth: '14px', marginTop: '2px' }} />
                  <span><strong>Consult Hours:</strong><br />{fac.consultationHours}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <BookOpen size={14} color="var(--accent-primary)" style={{ minWidth: '14px', marginTop: '2px' }} />
                  <span><strong>Classes:</strong><br />{fac.subjectsTaught.join(', ')}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <a href={`mailto:${fac.email}`} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}>
                Email Faculty
              </a>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                onClick={() => {
                  navigator.clipboard.writeText(fac.phone);
                  alert('Phone number copied to clipboard!');
                }}
              >
                Copy Phone
              </button>
            </div>
          </div>
        ))}

        {filteredDirectory.length === 0 && (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No faculty details match your search keyword.
          </div>
        )}
      </div>
    </div>
  );
}
