import React from 'react';
import { Award, Calendar, BookOpen, Users, Compass, ShieldAlert, Star } from 'lucide-react';

export default function Dashboard({ stats, setActiveTab, setNotification }) {
  const quickActions = [
    {
      title: 'Faculty Feedback',
      desc: 'Submit ratings & read written reviews.',
      icon: Star,
      tab: 'feedback',
      color: '#6366f1'
    },
    {
      title: 'Events Calendar',
      desc: 'Discover workshops, symposiums & set reminders.',
      icon: Calendar,
      tab: 'events',
      color: '#ec4899'
    },
    {
      title: 'Concept Maps',
      desc: 'Interactive visual syllabus repositories.',
      icon: Compass,
      tab: 'maps',
      color: '#10b981'
    },
    {
      title: 'Question Banks',
      desc: 'Access PYQs and important unit-wise revision topics.',
      icon: BookOpen,
      tab: 'questions',
      color: '#f59e0b'
    },
    {
      title: 'Clubs Hub',
      desc: 'Explore active SIMATS clubs & register memberships.',
      icon: Users,
      tab: 'clubs',
      color: '#06b6d4'
    },
    {
      title: 'UGC Upload Portal',
      desc: 'Contribute academic resources & earn credits.',
      icon: ShieldAlert,
      tab: 'upload',
      color: '#a855f7'
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Hero Welcome banner */}
      <div 
        className="glass-card" 
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '2.5rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Welcome, Saveethian!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
            The official academic and campus hub for SIMATS Engineering. Explore concept maps, rate faculty, browse clubs, download question banks, and collaborate with your peers.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('upload')}>
              Contribute Material
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('events')}>
              Explore Events
            </button>
          </div>
        </div>
        <div 
          style={{
            position: 'absolute',
            right: '-50px',
            bottom: '-50px',
            fontSize: '12rem',
            opacity: 0.05,
            pointerEvents: 'none'
          }}
        >
          🏫
        </div>
      </div>

      {/* Stats Counters */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.8rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: 'var(--radius-sm)', color: '#818cf8' }}>
            <Star size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.facultyCount}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Rated Faculty Members</p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.8rem', background: 'rgba(236, 72, 153, 0.15)', borderRadius: 'var(--radius-sm)', color: '#f472b6' }}>
            <Calendar size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.eventsCount}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Upcoming College Events</p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.8rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-sm)', color: '#34d399' }}>
            <Compass size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.conceptMapsCount}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Interactive Concept Maps</p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.8rem', background: 'rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-sm)', color: '#fbbf24' }}>
            <Award size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.contributorCredits}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Peer Contributor Credits</p>
          </div>
        </div>
      </div>

      {/* Live Activity Ticker */}
      <div 
        className="glass-card" 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          borderLeft: '4px solid var(--accent-primary)',
          background: 'rgba(17, 20, 40, 0.4)'
        }}
      >
        <span className="badge badge-blue">System Log</span>
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <marquee scrollamount="4">
            📢 Announcement: SEC Hackfest registration ends soon! • 📊 Review Update: Dr. Ramesh Kumar received a verified review. • 🚀 Club Spotlight: AeroSEC Robotics Drone Trial scheduled for Friday! • 📂 Upload portal verification is now live using standard SAVEETHA domain.
          </marquee>
        </div>
      </div>

      {/* Quick Access Grids */}
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', fontWeight: 700 }}>Quick Navigation</h3>
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <div 
              key={idx} 
              className="glass-card" 
              onClick={() => setActiveTab(action.tab)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                position: 'relative'
              }}
            >
              <div 
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '10px',
                  background: `rgba(${parseInt(action.color.slice(1,3), 16) || 99}, ${parseInt(action.color.slice(3,5), 16) || 102}, ${parseInt(action.color.slice(5,7), 16) || 241}, 0.15)`,
                  color: action.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.5rem'
                }}
              >
                <Icon size={22} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{action.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{action.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
