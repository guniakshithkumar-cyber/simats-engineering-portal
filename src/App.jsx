import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Star, 
  Calendar, 
  Map, 
  BookOpen, 
  PhoneCall, 
  Users, 
  UploadCloud, 
  Bell, 
  ShieldAlert 
} from 'lucide-react';

// Data & Helpers
import { 
  initialFacultyData, 
  initialEventsData, 
  initialConceptMaps, 
  initialQuestionBanks, 
  initialClubsData, 
  initialUgcSubmissions,
  getStoredData, 
  setStoredData,
  DEPARTMENTS,
  BRANCHES
} from './data/mockData';

// Components
import Dashboard from './components/Dashboard';
import FacultyFeedback from './components/FacultyFeedback';
import EventsCalendar from './components/EventsCalendar';
import ConceptMapViewer from './components/ConceptMapViewer';
import QuestionBanks from './components/QuestionBanks';
import FacultyDirectory from './components/FacultyDirectory';
import ClubsHub from './components/ClubsHub';
import UGCPortal from './components/UGCPortal';

// Force clear old local storage data once to reflect completely empty initial database
if (!localStorage.getItem('simats_portal_empty_reset_v4')) {
  localStorage.removeItem('simats_portal_faculty');
  localStorage.removeItem('simats_portal_events');
  localStorage.removeItem('simats_portal_conceptmaps');
  localStorage.removeItem('simats_portal_questions');
  localStorage.removeItem('simats_portal_clubs');
  localStorage.removeItem('simats_portal_ugc');
  localStorage.setItem('simats_portal_empty_reset_v4', 'true');
}

export default function App() {
  // Navigation View State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Application Data States (synced to LocalStorage)
  const [facultyList, setFacultyList] = useState(() => getStoredData('faculty', initialFacultyData));
  const [eventsList, setEventsList] = useState(() => getStoredData('events', initialEventsData));
  const [conceptMaps, setConceptMaps] = useState(() => getStoredData('conceptmaps', initialConceptMaps));
  const [questionList, setQuestionList] = useState(() => getStoredData('questions', initialQuestionBanks));
  const [clubsList, setClubsList] = useState(() => getStoredData('clubs', initialClubsData));
  const [ugcList, setUgcList] = useState(() => getStoredData('ugc', initialUgcSubmissions));

  // Notification Toast State
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  // Sync to localStorage
  useEffect(() => { setStoredData('faculty', facultyList); }, [facultyList]);
  useEffect(() => { setStoredData('events', eventsList); }, [eventsList]);
  useEffect(() => { setStoredData('conceptmaps', conceptMaps); }, [conceptMaps]);
  useEffect(() => { setStoredData('questions', questionList); }, [questionList]);
  useEffect(() => { setStoredData('clubs', clubsList); }, [clubsList]);
  useEffect(() => { setStoredData('ugc', ugcList); }, [ugcList]);

  // Trigger custom toast alerts
  const triggerToast = (title, message) => {
    setToast({ visible: true, title, message });
    setTimeout(() => {
      setToast({ visible: false, title: '', message: '' });
    }, 4000);
  };

  // Compile Dynamic Global Statistics
  const getGlobalStats = () => {
    // Count total concept maps
    let totalMaps = 0;
    Object.values(conceptMaps).forEach(branchData => {
      totalMaps += (branchData.maps || []).length;
    });

    // Count contributor credits
    const approvedCredits = ugcList
      .filter(item => item.status === 'Approved')
      .reduce((sum, item) => sum + item.credits, 0);

    return {
      facultyCount: facultyList.length,
      eventsCount: eventsList.filter(e => new Date(e.date) >= new Date()).length,
      conceptMapsCount: totalMaps,
      contributorCredits: approvedCredits + 150 // Seed with base credits
    };
  };

  const stats = getGlobalStats();

  // Navigation Items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'feedback', label: 'Faculty Feedback', icon: Star },
    { id: 'events', label: 'Events Calendar', icon: Calendar },
    { id: 'maps', label: 'Concept Maps', icon: Map },
    { id: 'questions', label: 'Question Banks', icon: BookOpen },
    { id: 'directory', label: 'Faculty Contact', icon: PhoneCall },
    { id: 'clubs', label: 'Clubs & Hub', icon: Users },
    { id: 'upload', label: 'Upload Portal', icon: UploadCloud }
  ];

  // Views Router
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            setActiveTab={setActiveTab} 
            setNotification={triggerToast} 
          />
        );
      case 'feedback':
        return (
          <FacultyFeedback 
            facultyList={facultyList} 
            setFacultyList={setFacultyList} 
            departments={DEPARTMENTS} 
            triggerToast={triggerToast} 
          />
        );
      case 'events':
        return (
          <EventsCalendar 
            eventsList={eventsList} 
            setEventsList={setEventsList} 
            triggerToast={triggerToast} 
          />
        );
      case 'maps':
        return (
          <ConceptMapViewer 
            conceptMaps={conceptMaps} 
            setConceptMaps={setConceptMaps} 
            branches={BRANCHES} 
            triggerToast={triggerToast} 
          />
        );
      case 'questions':
        return (
          <QuestionBanks 
            initialQuestions={questionList} 
            branches={BRANCHES} 
            triggerToast={triggerToast} 
          />
        );
      case 'directory':
        return (
          <FacultyDirectory 
            facultyList={facultyList} 
            departments={DEPARTMENTS} 
          />
        );
      case 'clubs':
        return (
          <ClubsHub 
            clubsList={clubsList} 
            setClubsList={setClubsList} 
            triggerToast={triggerToast} 
          />
        );
      case 'upload':
        return (
          <UGCPortal 
            ugcList={ugcList} 
            setUgcList={setUgcList} 
            facultyList={facultyList} 
            setFacultyList={setFacultyList}
            eventsList={eventsList} 
            setEventsList={setEventsList}
            conceptMaps={conceptMaps} 
            setConceptMaps={setConceptMaps}
            questionList={questionList} 
            setQuestionList={setQuestionList}
            clubsList={clubsList}
            setClubsList={setClubsList}
            triggerToast={triggerToast} 
          />
        );
      default:
        return <Dashboard stats={stats} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Layout */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', padding: '0.6rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={26} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SIMATS Engineering
            </h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Student Portal
            </span>
          </div>
        </div>

        <nav>
          <ul className="nav-menu">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li 
                  key={item.id} 
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer info in sidebar */}
        <div style={{ marginTop: 'auto', paddingLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <span style={{ width: '6px', height: '6px', background: 'var(--accent-tertiary)', borderRadius: '50%' }}></span>
            <span>SIMATS Portal Live</span>
          </div>
          <div>© 2026 SIMATS University</div>
        </div>
      </aside>

      {/* Main Board content container */}
      <main className="main-content">
        <header className="college-header">
          <div className="college-title">
            <h1>SIMATS Engineering</h1>
            <p>Integrated Student Academics & Activity Ecosystem</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div 
              style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid var(--glass-border)', 
                padding: '0.5rem 1rem', 
                borderRadius: '50px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('upload')}
            >
              <span>⭐ Credits:</span>
              <strong style={{ color: '#fbbf24' }}>{stats.contributorCredits}</strong>
            </div>

            <div 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'rgba(99, 102, 241, 0.1)', 
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => triggerToast('Notification Panel', 'No unread notifications. All systems operational!')}
            >
              <Bell size={18} />
              <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', background: 'var(--accent-secondary)', borderRadius: '50%' }}></span>
            </div>
          </div>
        </header>

        {/* Dynamic Route View */}
        {renderView()}
      </main>

      {/* Custom Toast Alert Notification */}
      {toast.visible && (
        <div className="toast">
          <ShieldAlert size={18} color="var(--accent-primary)" />
          <div>
            <strong style={{ display: 'block', fontSize: '0.85rem' }}>{toast.title}</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
