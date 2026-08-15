import React, { useState } from 'react';
import { Star, Filter, Search, PlusCircle, CheckCircle2, MessageSquare, ThumbsUp, ThumbsDown, ShieldCheck } from 'lucide-react';

export default function FacultyFeedback({ facultyList, setFacultyList, departments, triggerToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [expandedFaculty, setExpandedFaculty] = useState(null);

  // Review Modal State
  const [showModal, setShowModal] = useState(false);
  const [targetFacultyId, setTargetFacultyId] = useState('');
  const [newRating, setNewRating] = useState(85);
  const [newStyle, setNewStyle] = useState(50);
  const [newReviewText, setNewReviewText] = useState('');
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  // Add New Faculty State
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [newFacName, setNewFacName] = useState('');
  const [newFacDept, setNewFacDept] = useState(departments[0]);
  const [newFacEmail, setNewFacEmail] = useState('');
  const [newFacOffice, setNewFacOffice] = useState('');
  const [newFacSubject, setNewFacSubject] = useState('');

  // Send Mock OTP
  const handleSendOtp = () => {
    if (!email.match(/^[a-zA-Z0-9._%+-]+@saveetha\.com$/)) {
      alert('Please enter a valid SIMATS Engineering student email ID (e.g. name@saveetha.com).');
      return;
    }
    setOtpSent(true);
    setOtpCode('123456'); // Standard hardcoded mockup OTP for ease of testing
    triggerToast('Success', 'Verification OTP sent to ' + email + ' (Use 123456 to verify!)');
  };

  // Verify Mock OTP
  const handleVerifyOtp = () => {
    if (enteredOtp === otpCode) {
      setIsVerified(true);
      triggerToast('Success', 'Student Email Verified Successfully!');
    } else {
      alert('Invalid OTP code. Please enter 123456');
    }
  };

  // Submit Review
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Please verify your college email before submitting a review.');
      return;
    }
    if (!newReviewText.trim()) {
      alert('Please enter a detailed review.');
      return;
    }

    const updatedFaculty = facultyList.map((fac) => {
      if (fac.id === targetFacultyId) {
        const newReview = {
          id: `rev-${fac.id}-${Date.now()}`,
          rating: Number(newRating),
          teachingStyle: Number(newStyle),
          reviewerEmail: email,
          reviewText: newReviewText,
          date: new Date().toISOString().split('T')[0],
          verified: true,
          upvotes: 0,
          downvotes: 0
        };
        const allReviews = [...fac.reviews, newReview];
        
        // Calculate new aggregates
        const averageRating = Math.round(allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length);
        const averageStyle = Math.round(allReviews.reduce((sum, r) => sum + r.teachingStyle, 0) / allReviews.length);

        return {
          ...fac,
          rating: averageRating,
          teachingStyle: averageStyle,
          reviews: allReviews
        };
      }
      return fac;
    });

    setFacultyList(updatedFaculty);
    triggerToast('Success', 'Feedback submitted and compiled successfully!');
    
    // Reset Modal
    setShowModal(false);
    setNewReviewText('');
    setEmail('');
    setIsVerified(false);
    setOtpSent(false);
    setEnteredOtp('');
  };

  // Submit Add Faculty
  const handleAddFaculty = (e) => {
    e.preventDefault();
    if (!newFacName.trim() || !newFacEmail.trim()) {
      alert('Name and Email are required.');
      return;
    }
    const newFac = {
      id: `fac-${Date.now()}`,
      name: newFacName,
      department: newFacDept,
      email: newFacEmail,
      phone: '+91 98401 ' + Math.floor(10000 + Math.random() * 90000),
      office: newFacOffice || 'Block A, Office Cabin',
      consultationHours: 'Tuesday & Thursday, 2:00 PM - 4:00 PM',
      rating: 50,
      teachingStyle: 50,
      subjectsTaught: newFacSubject ? [newFacSubject] : ['Engineering Subject'],
      reviews: []
    };

    setFacultyList([newFac, ...facultyList]);
    triggerToast('Success', `${newFacName} added to directory!`);
    setShowAddFaculty(false);
    setNewFacName('');
    setNewFacEmail('');
    setNewFacOffice('');
    setNewFacSubject('');
  };

  // Handle Review Upvotes/Downvotes
  const handleVote = (facId, revId, isUpvote) => {
    const updatedFaculty = facultyList.map((fac) => {
      if (fac.id === facId) {
        return {
          ...fac,
          reviews: fac.reviews.map((rev) => {
            if (rev.id === revId) {
              return {
                ...rev,
                upvotes: isUpvote ? rev.upvotes + 1 : rev.upvotes,
                downvotes: !isUpvote ? rev.downvotes + 1 : rev.downvotes
              };
            }
            return rev;
          })
        };
      }
      return fac;
    });
    setFacultyList(updatedFaculty);
  };

  // Get strictness text
  const getStyleLabel = (val) => {
    if (val >= 70) return 'Strict (Focuses on discipline & standard rules)';
    if (val <= 40) return 'Lenient (Focuses on project-based loose learning)';
    return 'Balanced (Hybrid approach)';
  };

  // Filters
  const filteredFaculty = facultyList.filter((fac) => {
    const matchesSearch = fac.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          fac.subjectsTaught.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = selectedDept === 'All' || fac.department === selectedDept;
    
    // Style Filter
    let matchesStyle = true;
    if (selectedStyle === 'Strict') matchesStyle = fac.teachingStyle >= 70;
    else if (selectedStyle === 'Lenient') matchesStyle = fac.teachingStyle <= 40;
    else if (selectedStyle === 'Balanced') matchesStyle = fac.teachingStyle > 40 && fac.teachingStyle < 70;

    // Rating Filter
    let matchesRating = true;
    if (selectedRating === '90+') matchesRating = fac.rating >= 90;
    else if (selectedRating === '80-89') matchesRating = fac.rating >= 80 && fac.rating < 90;
    else if (selectedRating === '70-79') matchesRating = fac.rating >= 70 && fac.rating < 80;
    else if (selectedRating === '<70') matchesRating = fac.rating < 70;

    return matchesSearch && matchesDept && matchesStyle && matchesRating;
  });

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Faculty Feedback System</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Review teaching patterns, strictness scores, and help peer students decide courses.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowAddFaculty(true)}>
            <PlusCircle size={18} /> Add Faculty
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search faculty by name or subject taught..." 
              className="glass-input" 
              style={{ paddingLeft: '2.8rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={{ minWidth: '180px' }}>
            <select className="glass-input glass-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="All">All Departments</option>
              {departments.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Filter size={14} /> Quick Filters:
          </span>
          
          <select className="glass-input glass-select" style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 0.8rem', fontSize: '0.85rem' }} value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
            <option value="All">All Teaching Styles</option>
            <option value="Strict">Strict (70+ score)</option>
            <option value="Balanced">Balanced (41-69 score)</option>
            <option value="Lenient">Lenient (1-40 score)</option>
          </select>

          <select className="glass-input glass-select" style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 0.8rem', fontSize: '0.85rem' }} value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
            <option value="All">All Ratings</option>
            <option value="90+">Excellent (90+)</option>
            <option value="80-89">Very Good (80-89)</option>
            <option value="70-79">Good (70-79)</option>
            <option value="<70">Below Average (&lt;70)</option>
          </select>

          {(selectedDept !== 'All' || selectedStyle !== 'All' || selectedRating !== 'All' || searchTerm) && (
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              onClick={() => {
                setSelectedDept('All');
                setSelectedStyle('All');
                setSelectedRating('All');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Faculty List Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredFaculty.map((fac) => {
          const isExpanded = expandedFaculty === fac.id;
          return (
            <div key={fac.id} className="glass-card" style={{ borderLeft: `4px solid ${fac.rating >= 85 ? 'var(--accent-tertiary)' : 'var(--accent-primary)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>{fac.department}</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0.2rem 0' }}>{fac.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Subjects: {fac.subjectsTaught.join(', ')}</p>
                  
                  {/* Performance Indicators */}
                  <div style={{ display: 'flex', gap: '2rem', marginTop: '1.2rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                        <span>Overall rating score:</span>
                        <span style={{ fontWeight: 600, color: 'white' }}>{fac.rating}/100</span>
                      </div>
                      <div className="rating-bar-container" style={{ width: '150px' }}>
                        <div className="rating-bar-fill" style={{ width: `${fac.rating}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary))' }}></div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                        <span>Teaching style (Strictness):</span>
                        <span style={{ fontWeight: 600, color: 'white' }}>{fac.teachingStyle}/100</span>
                      </div>
                      <div className="rating-bar-container" style={{ width: '150px' }}>
                        <div className="rating-bar-fill" style={{ width: `${fac.teachingStyle}%`, background: 'linear-gradient(90deg, #34d399, #f59e0b, #ef4444)' }}></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: fac.teachingStyle >= 70 ? '#f87171' : fac.teachingStyle <= 40 ? '#34d399' : '#fbbf24' }}>
                        {fac.teachingStyle >= 70 ? 'Strict' : fac.teachingStyle <= 40 ? 'Lenient' : 'Balanced'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '1.2rem', fontWeight: 700 }}>
                    <Star size={18} fill="currentColor" color="var(--accent-warning)" />
                    <span>{(fac.rating / 20).toFixed(1)} / 5.0</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fac.reviews.length} reviews submitted</span>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => {
                        setTargetFacultyId(fac.id);
                        setShowModal(true);
                      }}
                    >
                      Write Feedback
                    </button>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => setExpandedFaculty(isExpanded ? null : fac.id)}
                    >
                      {isExpanded ? 'Hide Reviews' : 'View Reviews'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Reviews Section */}
              {isExpanded && (
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', animation: 'fadeIn 0.2s ease-out' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={16} /> Detailed Student Testimonials ({fac.reviews.length})
                  </h4>
                  
                  {fac.reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No detailed written reviews yet. Be the first to add feedback!</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {fac.reviews.map((rev) => (
                        <div key={rev.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>Anonymous Peer</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {rev.date}</span>
                              {rev.verified && (
                                <span className="badge badge-green" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.15rem 0.4rem' }}>
                                  <ShieldCheck size={10} /> Verified SIMATS Email
                                </span>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                              <span>Rating: <strong style={{ color: 'var(--accent-tertiary)' }}>{rev.rating}/100</strong></span>
                              <span>Style: <strong>{rev.teachingStyle}/100 ({rev.teachingStyle >= 70 ? 'Strict' : rev.teachingStyle <= 40 ? 'Lenient' : 'Balanced'})</strong></span>
                            </div>
                          </div>
                          
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.8rem' }}>
                            "{rev.reviewText}"
                          </p>

                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <button 
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.8rem' }}
                              onClick={() => handleVote(fac.id, rev.id, true)}
                            >
                              <ThumbsUp size={14} /> Helpful ({rev.upvotes})
                            </button>
                            <button 
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.8rem' }}
                              onClick={() => handleVote(fac.id, rev.id, false)}
                            >
                              <ThumbsDown size={14} /> Unhelpful ({rev.downvotes})
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaculty.length === 0 && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No faculty members match your filter settings. Try clearing the filters!
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowModal(false)}>✕</button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Submit Faculty Feedback</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Review for: <strong style={{ color: 'white' }}>{facultyList.find(f => f.id === targetFacultyId)?.name}</strong>
            </p>

            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* College email validation step */}
              <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={16} color="var(--accent-primary)" /> SIMATS Student Email Verification
                </h4>
                
                {!isVerified ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      To prevent system spam, rating requires email validation ending with `@saveetha.com`.
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="email" 
                        placeholder="e.g. register_no@saveetha.com" 
                        className="glass-input" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={otpSent}
                        required
                      />
                      {!otpSent ? (
                        <button type="button" className="btn btn-primary" onClick={handleSendOtp} style={{ whiteSpace: 'nowrap' }}>
                          Send OTP
                        </button>
                      ) : (
                        <button type="button" className="btn btn-secondary" onClick={() => setOtpSent(false)}>
                          Change Email
                        </button>
                      )}
                    </div>

                    {otpSent && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', animation: 'fadeIn 0.2s' }}>
                        <input 
                          type="text" 
                          placeholder="Enter OTP Code (123456)" 
                          className="glass-input" 
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          maxLength={6}
                        />
                        <button type="button" className="btn btn-success" onClick={handleVerifyOtp}>
                          Verify
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-tertiary)', fontSize: '0.9rem', fontWeight: 600 }}>
                    <CheckCircle2 size={18} />
                    <span>Verified! Authenticated as {email}</span>
                  </div>
                )}
              </div>

              {/* Rating 1-100 */}
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>
                  <span>Teaching Quality Score (1 to 100):</span>
                  <strong style={{ color: 'var(--accent-primary)' }}>{newRating} / 100</strong>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={newRating} 
                  onChange={(e) => setNewRating(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>1 (Poor)</span>
                  <span>50 (Average)</span>
                  <span>100 (Excellent)</span>
                </div>
              </div>

              {/* Strict vs Lenient Slider */}
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>
                  <span>Teaching Style Metric (Leniency vs Strictness):</span>
                  <strong style={{ color: newStyle >= 70 ? 'red' : newStyle <= 40 ? 'green' : 'orange' }}>{newStyle} / 100</strong>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={newStyle} 
                  onChange={(e) => setNewStyle(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>1 (Very Lenient / Project-based)</span>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>100 (Very Strict / Attendance Heavy)</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                  Selected Style: {getStyleLabel(newStyle)}
                </p>
              </div>

              {/* Written review text */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>
                  Detailed Written Review:
                </label>
                <textarea 
                  rows="4" 
                  placeholder="Share details on course structure, notes, assignments, grading, exam preparation help, etc..."
                  className="glass-input"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={!isVerified}>
                  Submit Feedback
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Faculty Modal */}
      {showAddFaculty && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowAddFaculty(false)}>✕</button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Faculty Member</h3>
            
            <form onSubmit={handleAddFaculty} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Full Name:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dr. K. Venkatraman" 
                  className="glass-input" 
                  value={newFacName}
                  onChange={(e) => setNewFacName(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Department:</label>
                  <select 
                    className="glass-input glass-select" 
                    value={newFacDept}
                    onChange={(e) => setNewFacDept(e.target.value)}
                  >
                    {departments.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Official Email:</label>
                  <input 
                    type="email" 
                    placeholder="e.g. venkatraman@saveetha.com" 
                    className="glass-input" 
                    value={newFacEmail}
                    onChange={(e) => setNewFacEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Office Cabin Room:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Block B, 2nd Floor, B209" 
                    className="glass-input" 
                    value={newFacOffice}
                    onChange={(e) => setNewFacOffice(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Primary Subject Taught:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Computer Networks" 
                    className="glass-input" 
                    value={newFacSubject}
                    onChange={(e) => setNewFacSubject(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create Listing
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddFaculty(false)}>
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
