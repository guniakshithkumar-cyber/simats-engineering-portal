import React, { useState } from 'react';
import { Upload, ShieldCheck, CheckCircle2, AlertTriangle, Star, History, Award, Trash, Check, HelpCircle } from 'lucide-react';

export default function UGCPortal({ 
  ugcList, setUgcList, 
  facultyList, setFacultyList,
  eventsList, setEventsList,
  conceptMaps, setConceptMaps,
  questionList, setQuestionList,
  clubsList, setClubsList,
  triggerToast 
}) {
  // Verification states
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');

  // Universal Form Category selector
  const [category, setCategory] = useState('faculty-feedback'); // faculty-feedback, events, concept-maps, exam-questions, clubs
  const [branch, setBranch] = useState('CSE');
  const [subject, setSubject] = useState('Data Structures and Algorithms');

  // Sub-forms states:
  // 1. Faculty Feedback UGC:
  const [facFeedbackTarget, setFacFeedbackTarget] = useState('');
  const [facFeedbackRating, setFacFeedbackRating] = useState(85);
  const [facFeedbackStyle, setFacFeedbackStyle] = useState(50);
  const [facFeedbackReviewText, setFacFeedbackReviewText] = useState('');
  
  // 2. Events UGC:
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventEligible, setEventEligible] = useState('Open to all branches');
  const [eventCategory, setEventCategory] = useState('tech');
  const [eventDesc, setEventDesc] = useState('');

  // 3. Concept Maps UGC:
  const [mapSubject, setMapSubject] = useState('');
  const [mapSem, setMapSem] = useState(3);
  const [mapDesc, setMapDesc] = useState('');

  // 4. Exam Questions UGC:
  const [questText, setQuestText] = useState('');
  const [questAnswer, setQuestAnswer] = useState('');
  const [questDifficulty, setQuestDifficulty] = useState('Medium');
  const [questUnit, setQuestUnit] = useState('Unit 1: Introduction');

  // 5. Clubs UGC:
  const [clubName, setClubName] = useState('');
  const [clubType, setClubType] = useState('Technical');
  const [clubSchedule, setClubSchedule] = useState('Thursdays, 4:30 PM');
  const [clubFee, setClubFee] = useState('Free');
  const [clubActivitiesText, setClubActivitiesText] = useState('');
  const [clubAchievementsText, setClubAchievementsText] = useState('');
  
  // Flagging report
  const [reportText, setReportText] = useState('');

  // Selected Submission for Moderation/View
  const [selectedSub, setSelectedSub] = useState(null);

  // Leaderboard
  const leaderboard = [
    { email: 'abhishek.s24@saveetha.com', credits: 110, branch: 'CSE' },
    { email: 'sneha.ece2@saveetha.com', credits: 85, branch: 'ECE' },
    { email: 'nanda.mech@saveetha.com', credits: 60, branch: 'MECH' },
    { email: 'karthik.civil@saveetha.com', credits: 40, branch: 'CIVIL' }
  ];

  // Send Mock OTP
  const handleSendOtp = () => {
    if (!email.match(/^[a-zA-Z0-9._%+-]+@saveetha\.com$/)) {
      alert('Please enter a valid SIMATS Engineering student email ID (e.g. name@saveetha.com).');
      return;
    }
    setOtpSent(true);
    triggerToast('Success', 'Verification OTP code sent. Enter code 123456');
  };

  // Verify Mock OTP
  const handleVerifyOtp = () => {
    if (enteredOtp === '123456') {
      setIsVerified(true);
      triggerToast('Verified', 'Email verified. You can now contribute documents.');
    } else {
      alert('Invalid OTP. Please enter 123456');
    }
  };

  // Submit UGC Item
  const handleUgcSubmit = (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert('Email verification is required.');
      return;
    }

    let payload = {};
    let itemTitle = '';

    if (category === 'faculty-feedback') {
      if (!facFeedbackTarget || !facFeedbackReviewText.trim()) {
        alert('Please select a faculty member and enter a written review.');
        return;
      }
      itemTitle = `Review for ${facFeedbackTarget}`;
      payload = {
        facultyId: facFeedbackTarget,
        rating: Number(facFeedbackRating),
        teachingStyle: Number(facFeedbackStyle),
        reviewText: facFeedbackReviewText
      };
    } else if (category === 'events') {
      if (!eventTitle.trim() || !eventDate.trim() || !eventVenue.trim()) {
        alert('Event Title, Date, and Venue are required.');
        return;
      }
      itemTitle = `Event: ${eventTitle}`;
      payload = {
        title: eventTitle,
        date: eventDate,
        time: eventTime || '10:00 AM - 04:00 PM',
        venue: eventVenue,
        category: eventCategory,
        eligibility: eventEligible,
        description: eventDesc || 'No description provided.'
      };
    } else if (category === 'concept-maps') {
      if (!mapSubject.trim()) {
        alert('Subject name is required.');
        return;
      }
      itemTitle = `Concept Map: ${mapSubject}`;
      payload = {
        subject: mapSubject,
        semester: Number(mapSem),
        description: mapDesc || 'Concept map layout.'
      };
    } else if (category === 'exam-questions') {
      if (!questText.trim() || !questAnswer.trim()) {
        alert('Question and answer key are required.');
        return;
      }
      itemTitle = `Question: ${questText.substring(0, 50)}...`;
      payload = {
        questionText: questText,
        answerReview: questAnswer,
        difficulty: questDifficulty,
        unit: questUnit
      };
    } else if (category === 'clubs') {
      if (!clubName.trim()) {
        alert('Club Name is required.');
        return;
      }
      itemTitle = `New Club Request: ${clubName}`;
      payload = {
        name: clubName,
        type: clubType,
        meetingSchedule: clubSchedule,
        membershipFee: clubFee,
        activities: clubActivitiesText ? clubActivitiesText.split('\n').filter(x => x.trim()) : ['Club meetings'],
        achievements: clubAchievementsText ? clubAchievementsText.split('\n').filter(x => x.trim()) : ['Club establishment']
      };
    }

    const newItem = {
      id: `sub-${Date.now()}`,
      category,
      title: itemTitle,
      subject,
      branch,
      contributorEmail: email,
      details: JSON.stringify(payload, null, 2),
      credits: category === 'concept-maps' ? 20 : category === 'exam-questions' ? 15 : 10,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0],
      versionHistory: [
        { version: 'v1.0', date: new Date().toISOString().split('T')[0], comment: 'Initial student submission.' }
      ]
    };

    setUgcList([newItem, ...ugcList]);
    triggerToast('Submitted', 'Material submitted successfully for review!');
    
    // Clear forms
    setFacFeedbackReviewText('');
    setEventTitle('');
    setEventDate('');
    setEventVenue('');
    setEventDesc('');
    setMapSubject('');
    setMapDesc('');
    setQuestText('');
    setQuestAnswer('');
    setClubName('');
    setClubActivitiesText('');
    setClubAchievementsText('');
  };

  // Moderator Action: Approve Item (Integrate into respective live modules)
  const handleApprove = (item) => {
    const updatedUgcList = ugcList.map((ugc) => {
      if (ugc.id === item.id) {
        return { 
          ...ugc, 
          status: 'Approved',
          versionHistory: [...ugc.versionHistory, { version: `v1.1`, date: new Date().toISOString().split('T')[0], comment: 'Approved by moderator.' }]
        };
      }
      return ugc;
    });
    setUgcList(updatedUgcList);

    const data = JSON.parse(item.details);

    // Dynamic Injection into active databases based on category
    if (item.category === 'faculty-feedback') {
      const updatedFaculty = facultyList.map((fac) => {
        if (fac.name === data.facultyId || fac.id === data.facultyId) {
          const newReview = {
            id: `rev-${fac.id}-${Date.now()}`,
            rating: data.rating,
            teachingStyle: data.teachingStyle,
            reviewerEmail: item.contributorEmail,
            reviewText: data.reviewText,
            date: new Date().toISOString().split('T')[0],
            verified: true,
            upvotes: 0,
            downvotes: 0
          };
          const allReviews = [...fac.reviews, newReview];
          
          return {
            ...fac,
            rating: Math.round(allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length),
            teachingStyle: Math.round(allReviews.reduce((sum, r) => sum + r.teachingStyle, 0) / allReviews.length),
            reviews: allReviews
          };
        }
        return fac;
      });
      setFacultyList(updatedFaculty);

    } else if (item.category === 'events') {
      const newEvent = {
        id: `evt-${Date.now()}`,
        title: data.title,
        date: data.date,
        time: data.time,
        venue: data.venue,
        organizingDept: item.branch,
        category: data.category,
        eligibility: data.eligibility,
        description: data.description,
        reminderSet: false,
        participantsCount: 1
      };
      setEventsList([newEvent, ...eventsList]);

    } else if (item.category === 'concept-maps') {
      const newMap = {
        id: `map-${item.branch}-${Date.now()}`,
        subject: data.subject,
        semester: data.semester,
        description: data.description,
        nodes: [
          { id: '1', label: data.subject, x: 400, y: 80, type: 'core' },
          { id: '2', label: 'Peer Review Topic', x: 400, y: 220, type: 'sub' }
        ],
        links: [
          { source: '1', target: '2' }
        ],
        contributor: item.contributorEmail,
        downloads: 0
      };
      const currentBranch = conceptMaps[item.branch] || { semesters: [3], maps: [] };
      setConceptMaps({
        ...conceptMaps,
        [item.branch]: {
          ...currentBranch,
          maps: [...currentBranch.maps, newMap]
        }
      });

    } else if (item.category === 'exam-questions') {
      const newQuestion = {
        id: `qb-${Date.now()}`,
        branch: item.branch,
        subject: item.subject,
        unit: data.unit,
        difficulty: data.difficulty,
        question: data.questionText,
        answerReview: data.answerReview,
        year: new Date().getFullYear(),
        tags: ['PYQ', 'Peer Contribution']
      };
      setQuestionList([newQuestion, ...questionList]);

    } else if (item.category === 'clubs') {
      const newClub = {
        id: `club-${Date.now()}`,
        name: data.name,
        type: data.type,
        logo: '🌟',
        website: 'https://saveetha.com',
        socials: { instagram: '#' },
        registrationStatus: 'open',
        membershipFee: data.membershipFee,
        meetingSchedule: data.meetingSchedule,
        activities: data.activities,
        achievements: data.achievements,
        gallery: [
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
        ],
        pastEvents: []
      };
      setClubsList([newClub, ...clubsList]);
    }

    triggerToast('Approved', `"${item.title}" approved and posted live!`);
    setSelectedSub(null);
  };

  // Moderator Action: Reject Item
  const handleReject = (item) => {
    const updated = ugcList.map((ugc) => {
      if (ugc.id === item.id) {
        return { 
          ...ugc, 
          status: 'Rejected',
          versionHistory: [...ugc.versionHistory, { version: `v1.1`, date: new Date().toISOString().split('T')[0], comment: 'Rejected due to duplicate material.' }]
        };
      }
      return ugc;
    });
    setUgcList(updated);
    triggerToast('Rejected', 'Submission rejected.');
    setSelectedSub(null);
  };

  // Report Inappropriate Material
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    triggerToast('Report Received', 'Thank you. Content flagged. Admins will review within 24 hours.');
    setReportText('');
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>SIMATS Engineering Upload Portal</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Collaborate by uploading past questions, visual syllabus maps, event schedules, club listings, and faculty feedback. Earn academic credits for approvals.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }} className="grid-2">
        {/* Left Side: Upload Form / Moderation Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Upload Form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={20} color="var(--accent-primary)" /> Upload Academic Resource
            </h3>

            {/* Verification Alert */}
            {!isVerified ? (
              <div 
                style={{ 
                  padding: '1.25rem', 
                  background: 'rgba(99, 102, 241, 0.05)', 
                  border: '1px solid rgba(99, 102, 241, 0.2)', 
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.5rem' 
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} color="var(--accent-primary)" /> Student Verification Required
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  You must confirm your SIMATS Engineering student email ending in `@saveetha.com` to post to the portal.
                </p>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="email" 
                    placeholder="yourname@saveetha.com" 
                    className="glass-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                  />
                  {!otpSent ? (
                    <button type="button" className="btn btn-primary" onClick={handleSendOtp}>Send OTP</button>
                  ) : (
                    <button type="button" className="btn btn-secondary" onClick={() => setOtpSent(false)}>Edit</button>
                  )}
                </div>

                {otpSent && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', animation: 'fadeIn 0.2s' }}>
                    <input 
                      type="text" 
                      placeholder="Enter verification code (123456)" 
                      className="glass-input"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                    <button type="button" className="btn btn-success" onClick={handleVerifyOtp}>Verify</button>
                  </div>
                )}
              </div>
            ) : (
              <div 
                style={{ 
                  padding: '1rem', 
                  background: 'rgba(16, 185, 129, 0.05)', 
                  border: '1px solid rgba(16, 185, 129, 0.2)', 
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--accent-tertiary)',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                <CheckCircle2 size={18} />
                <span>Verified Contributor Account: {email}</span>
              </div>
            )}

            {/* Actual Upload Form */}
            <form onSubmit={handleUgcSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', opacity: isVerified ? 1 : 0.5, pointerEvents: isVerified ? 'auto' : 'none' }}>
              <div className="grid-3">
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Information Category:</label>
                  <select className="glass-input glass-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="faculty-feedback">Faculty Rating & Review</option>
                    <option value="events">College Event Announcement</option>
                    <option value="concept-maps">Curriculum Concept Map</option>
                    <option value="exam-questions">Subject Question QA / PYQ</option>
                    <option value="clubs">Student Club / Organization</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Branch:</label>
                  <select className="glass-input glass-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">Mechanical</option>
                    <option value="CIVIL">Civil</option>
                    <option value="EEE">EEE</option>
                    <option value="BIOTECH">Bio-Tech</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Branch/Subject labels */}
              {category !== 'clubs' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Curriculum Subject:</label>
                  <select className="glass-input glass-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="Data Structures and Algorithms">Data Structures and Algorithms</option>
                    <option value="Database Management Systems">Database Management Systems</option>
                    <option value="Digital Signal Processing">Digital Signal Processing</option>
                    <option value="Microprocessors & Microcontrollers">Microprocessors & Microcontrollers</option>
                    <option value="Thermodynamics">Thermodynamics</option>
                  </select>
                </div>
              )}

              {/* ----------------- SUB FORM: FACULTY FEEDBACK ----------------- */}
              {category === 'faculty-feedback' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Target Faculty Member:</label>
                    <select className="glass-input glass-select" value={facFeedbackTarget} onChange={(e) => setFacFeedbackTarget(e.target.value)} required>
                      <option value="">-- Choose Faculty --</option>
                      {facultyList.map(f => (
                        <option key={f.id} value={f.name}>{f.name} ({f.department})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid-2">
                    <div>
                      <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                        <span>Quality Score:</span>
                        <strong>{facFeedbackRating}/100</strong>
                      </label>
                      <input type="range" min="1" max="100" value={facFeedbackRating} onChange={(e) => setFacFeedbackRating(e.target.value)} style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                        <span>Style (Leniency vs Strictness):</span>
                        <strong>{facFeedbackStyle}/100</strong>
                      </label>
                      <input type="range" min="1" max="100" value={facFeedbackStyle} onChange={(e) => setFacFeedbackStyle(e.target.value)} style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Written Testimonial:</label>
                    <textarea rows="3" className="glass-input" placeholder="Notes, teaching patterns, homework load, etc..." value={facFeedbackReviewText} onChange={(e) => setFacFeedbackReviewText(e.target.value)} required></textarea>
                  </div>
                </div>
              )}

              {/* ----------------- SUB FORM: EVENTS ----------------- */}
              {category === 'events' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Event Title:</label>
                    <input type="text" className="glass-input" placeholder="e.g. Aero Workshop 2026" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required />
                  </div>
                  <div className="grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Event Date:</label>
                      <input type="date" className="glass-input" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Event Time:</label>
                      <input type="text" className="glass-input" placeholder="e.g. 10:00 AM - 03:00 PM" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Event Venue:</label>
                      <input type="text" className="glass-input" placeholder="e.g. Seminar Hall, Block C" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Eligibility:</label>
                      <input type="text" className="glass-input" placeholder="e.g. All engineering students" value={eventEligible} onChange={(e) => setEventEligible(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Category:</label>
                      <select className="glass-input glass-select" value={eventCategory} onChange={(e) => setEventCategory(e.target.value)}>
                        <option value="tech">Technical Event</option>
                        <option value="cultural">Cultural Event</option>
                        <option value="academic">Academic Seminar</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Details & Description:</label>
                    <textarea rows="2" className="glass-input" placeholder="Registration guidelines, event rules, prize details..." value={eventDesc} onChange={(e) => setEventDesc(e.target.value)}></textarea>
                  </div>
                </div>
              )}

              {/* ----------------- SUB FORM: CONCEPT MAPS ----------------- */}
              {category === 'concept-maps' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Subject Name:</label>
                      <input type="text" className="glass-input" placeholder="e.g. Operating Systems" value={mapSubject} onChange={(e) => setMapSubject(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Semester:</label>
                      <select className="glass-input glass-select" value={mapSem} onChange={(e) => setMapSem(Number(e.target.value))}>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Map Description / Syllabus Summary:</label>
                    <textarea rows="3" className="glass-input" placeholder="Details of how nodes flow..." value={mapDesc} onChange={(e) => setMapDesc(e.target.value)}></textarea>
                  </div>
                </div>
              )}

              {/* ----------------- SUB FORM: EXAM QUESTIONS ----------------- */}
              {category === 'exam-questions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="grid-3">
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Unit / Chapter Label:</label>
                      <input type="text" className="glass-input" placeholder="e.g. Unit 3: Normalization" value={questUnit} onChange={(e) => setQuestUnit(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Difficulty:</label>
                      <select className="glass-input glass-select" value={questDifficulty} onChange={(e) => setQuestDifficulty(e.target.value)}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Question Text:</label>
                    <textarea rows="2" className="glass-input" placeholder="Type the question that appeared in exams..." value={questText} onChange={(e) => setQuestText(e.target.value)} required></textarea>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Answer / Key Points:</label>
                    <textarea rows="3" className="glass-input" placeholder="Provide quick revision summary or solution key..." value={questAnswer} onChange={(e) => setQuestAnswer(e.target.value)} required></textarea>
                  </div>
                </div>
              )}

              {/* ----------------- SUB FORM: CLUBS ----------------- */}
              {category === 'clubs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Club Name:</label>
                      <input type="text" className="glass-input" placeholder="e.g. SIMATS Photography" value={clubName} onChange={(e) => setClubName(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Club Type:</label>
                      <select className="glass-input glass-select" value={clubType} onChange={(e) => setClubType(e.target.value)}>
                        <option value="Technical">Technical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Innovation Cell">Innovation Cell</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Meeting Schedule:</label>
                      <input type="text" className="glass-input" placeholder="Mondays, 4:30 PM" value={clubSchedule} onChange={(e) => setClubSchedule(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Membership Fee:</label>
                      <input type="text" className="glass-input" placeholder="Free / ₹100" value={clubFee} onChange={(e) => setClubFee(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Weekly Activities (one per line):</label>
                    <textarea rows="2" className="glass-input" placeholder="Activity 1&#10;Activity 2" value={clubActivitiesText} onChange={(e) => setClubActivitiesText(e.target.value)}></textarea>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Key Achievements (one per line):</label>
                    <textarea rows="2" className="glass-input" placeholder="Won 1st prize SIH 2025&#10;Conducted drone workshop" value={clubAchievementsText} onChange={(e) => setClubAchievementsText(e.target.value)}></textarea>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={!isVerified}>
                Submit to Moderation Queue
              </button>
            </form>
          </div>

          {/* Interactive Moderation Dashboard */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-warning)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fbbf24' }}>
              Moderator Sandbox Console
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
              <strong>Admin simulation:</strong> Approve or Reject submissions. Approvals dynamically post live to target branches!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ugcList.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.6rem', textTransform: 'capitalize' }}>{item.category.replace('-', ' ')}</span>
                      <span className={`badge ${
                        item.status === 'Approved' ? 'badge-green' : item.status === 'Rejected' ? 'badge-pink' : 'badge-yellow'
                      }`} style={{ fontSize: '0.6rem' }}>
                        {item.status}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contributed by: {item.contributorEmail}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => setSelectedSub(item)}
                    >
                      Inspect Logs
                    </button>
                    {item.status === 'Pending' && (
                      <>
                        <button 
                          className="btn btn-success" 
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => handleApprove(item)}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => handleReject(item)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Guidelines, Leaderboard, Reporting */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Credits Leaderboard */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={18} color="#fbbf24" /> Top Peer Contributors
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {leaderboard.map((lead, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.5rem' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                    <strong>#{i+1}</strong> <span style={{ color: 'var(--text-secondary)' }}>{lead.email}</span>
                  </div>
                  <span className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>{lead.credits} Cr</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Guidelines */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Guidelines for Submission</h3>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.6rem', lineHeight: 1.4 }}>
              <li>Ensure questions have correct course labels matching official SIMATS syllabus.</li>
              <li>Hand-drawn concept maps must be clear, legible, and structured semester-wise.</li>
              <li>Events and Club listings must represent active campus bodies.</li>
              <li>Spam submissions will result in immediate suspension from the database.</li>
            </ul>
          </div>

          {/* Content Reporting Mechanism */}
          <div className="glass-card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-danger)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={18} /> Report Inappropriate Content
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.8rem', lineHeight: 1.4 }}>
              Found incorrect data, copyright material, or inappropriate reviews? Flag it to moderators below.
            </p>
            
            <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <textarea 
                rows="2" 
                placeholder="Mention subject name / review comment you wish to report..." 
                className="glass-input"
                style={{ fontSize: '0.8rem' }}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                required
              ></textarea>
              <button type="submit" className="btn btn-danger" style={{ padding: '0.4rem', fontSize: '0.8rem' }}>
                Flag Material
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Inspect Log & Version History Modal */}
      {selectedSub && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedSub(null)}>✕</button>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>UGC Logs & Version History</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
              Document ID: <strong style={{ color: 'white' }}>{selectedSub.id}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
              <div>
                <strong>Title:</strong> {selectedSub.title}
              </div>
              <div>
                <strong>Details:</strong>
                <pre style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.3rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.4 }}>
                  {selectedSub.details}
                </pre>
              </div>
              <div className="grid-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div><strong>Category:</strong> {selectedSub.category}</div>
                <div><strong>Branch:</strong> {selectedSub.branch}</div>
                <div><strong>Submitted:</strong> {selectedSub.submittedAt}</div>
              </div>
            </div>

            {/* Version Logs */}
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <History size={16} /> Version Control Log
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {selectedSub.versionHistory.map((ver, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      padding: '0.6rem 0.8rem', 
                      background: 'rgba(255,255,255,0.01)', 
                      borderLeft: '2px solid var(--accent-primary)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong>{ver.version}</strong>: {ver.comment}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>{ver.date}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {selectedSub.status === 'Pending' && (
                <>
                  <button className="btn btn-success" style={{ flex: 1 }} onClick={() => handleApprove(selectedSub)}>Approve and Post Live</button>
                  <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleReject(selectedSub)}>Reject Submission</button>
                </>
              )}
              <button className="btn btn-secondary" style={{ flex: selectedSub.status === 'Pending' ? 'none' : 1 }} onClick={() => setSelectedSub(null)}>Close Logs</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
