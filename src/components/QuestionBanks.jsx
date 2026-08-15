import React, { useState } from 'react';
import { BookOpen, Search, Download, HelpCircle, Star, Sparkles, Filter, FileText } from 'lucide-react';

export default function QuestionBanks({ initialQuestions, branches, triggerToast }) {
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState('All');
  
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // List of subjects based on selected branch
  const subjectsMap = {
    CSE: ['Data Structures and Algorithms', 'Database Management Systems', 'Operating Systems', 'Computer Networks'],
    ECE: ['Digital Signal Processing', 'Microprocessors & Microcontrollers', 'Electromagnetic Fields'],
    MECH: ['Thermodynamics', 'Fluid Mechanics', 'Strength of Materials'],
    CIVIL: ['Structural Analysis', 'Surveying', 'Concrete Technology'],
    EEE: ['Power Electronics', 'Control Systems', 'Electrical Machines'],
    BIOTECH: ['Bioinformatics', 'Microbiology', 'Biochemistry']
  };

  const currentSubjects = subjectsMap[selectedBranch] || [];
  const [selectedSubject, setSelectedSubject] = useState(currentSubjects[0] || '');

  // Reset subject when branch changes
  React.useEffect(() => {
    setSelectedSubject(subjectsMap[selectedBranch]?.[0] || '');
    setExpandedQuestion(null);
  }, [selectedBranch]);

  // Filters questions
  const filteredQuestions = initialQuestions.filter((q) => {
    const matchesBranch = q.branch === selectedBranch;
    const matchesSubject = q.subject === selectedSubject;
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchesUnit = selectedUnit === 'All' || q.unit.includes(selectedUnit);

    return matchesBranch && matchesSubject && matchesSearch && matchesDifficulty && matchesUnit;
  });

  // Extract units for filter
  const unitList = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];

  // Mock Previous Year Question Papers files
  const mockPyqPapers = [
    { name: `SEC Semester Exam May 2025 - ${selectedSubject}`, year: 2025, code: 'SEC-19DS301' },
    { name: `SEC Semester Exam Nov 2024 - ${selectedSubject}`, year: 2024, code: 'SEC-19DS301' },
    { name: `SEC Internal Assessment Test 2 (IAT) 2025`, year: 2025, code: 'SEC-IAT-2' }
  ];

  // Revision topics for the selected subject
  const importantTopicsMap = {
    'Data Structures and Algorithms': [
      'Infix-to-Postfix conversion (Unit 1 stack trace)',
      'AVL Tree Balancing Rotations (Single/Double)',
      'Dijkstra\'s Shortest Path Algorithm dry-run',
      'Binary Search Tree insertion/deletion cases'
    ],
    'Database Management Systems': [
      'BCNF vs 3NF comparison with design proofs',
      'Two-Phase Locking (2PL) Concurrency Protocol',
      'ER Diagram to Relational Schema mappings',
      'ACID transaction validation examples'
    ],
    'Digital Signal Processing': [
      '8-point DIT FFT butterfly computation',
      'Butterworth Filter design equations',
      'ROC properties of Z-Transforms',
      'FIR filter window function derivations'
    ]
  };

  const activeImportantTopics = importantTopicsMap[selectedSubject] || [
    'Syllabus Core Concepts review',
    'Previous Year Questions mapping',
    'Standard numerical proof patterns'
  ];

  const handleDownloadPaper = (paperName) => {
    triggerToast('Download Started', `Downloading: ${paperName}.pdf`);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Subject-Wise Question Banks</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Exam-focused databases comprising Previous Year Papers, unit-wise QA, and important revision nodes.</p>
        </div>
      </div>

      {/* Branch Selection Toolbar */}
      <div className="glass-card" style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Select Engineering Branch:</span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {branches.map((b) => (
              <button 
                key={b.id} 
                className={`btn ${selectedBranch === b.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => setSelectedBranch(b.id)}
              >
                {b.id}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Subject:</label>
            {currentSubjects.length > 0 ? (
              <select 
                className="glass-input glass-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {currentSubjects.map((sub, i) => (
                  <option key={i} value={sub}>{sub}</option>
                ))}
              </select>
            ) : (
              <div style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No subjects mapped for this branch yet.</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Unit / Module:</label>
              <select className="glass-input glass-select" value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)}>
                <option value="All">All Units</option>
                {unitList.map((unit, i) => (
                  <option key={i} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Difficulty:</label>
              <select className="glass-input glass-select" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
          <input 
            type="text" 
            placeholder="Search questions by keyword or topic..." 
            className="glass-input" 
            style={{ paddingLeft: '2.8rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'flex-start' }} className="grid-2">
        {/* Left Side: Question List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="var(--accent-primary)" /> Exam Revision Q&A ({filteredQuestions.length})
          </h3>

          {filteredQuestions.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No specific questions found for this subject matching the filters. Try changing filters or branch.
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isExpanded = expandedQuestion === q.id;
              return (
                <div key={q.id} className="glass-card" style={{ padding: '1.25rem', borderLeft: `3px solid ${q.difficulty === 'Hard' ? 'var(--accent-danger)' : q.difficulty === 'Medium' ? 'var(--accent-warning)' : 'var(--accent-tertiary)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{q.unit}</span>
                        <span className={`badge ${q.difficulty === 'Hard' ? 'badge-pink' : q.difficulty === 'Medium' ? 'badge-yellow' : 'badge-green'}`} style={{ fontSize: '0.65rem' }}>
                          {q.difficulty}
                        </span>
                        <span className="badge badge-yellow" style={{ fontSize: '0.65rem' }}>Exam Year: {q.year}</span>
                      </div>
                      
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.5, color: 'white' }}>
                        {q.question}
                      </h4>
                    </div>

                    <button 
                      className={`btn ${isExpanded ? 'btn-secondary' : 'btn-primary'}`} 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                    >
                      {isExpanded ? 'Hide Answer' : 'Show Answer'}
                    </button>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
                    {q.tags.map((tag, i) => (
                      <span key={i} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', padding: '0.15rem 0.4rem', borderRadius: '3px', color: 'var(--text-secondary)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Answer Preview Notes */}
                  {isExpanded && (
                    <div 
                      style={{ 
                        marginTop: '1.25rem', 
                        paddingTop: '1rem', 
                        borderTop: '1px dashed var(--glass-border)', 
                        animation: 'fadeIn 0.2s ease-out' 
                      }}
                    >
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-tertiary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Sparkles size={14} /> Revision Key Points:
                      </h5>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        {q.answerReview}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Revision Notes & PYQ Downloads */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Important Topics card */}
          <div className="glass-card" style={{ border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', marginBottom: '1rem' }}>
              <Star size={18} fill="currentColor" /> Important Revision Topics
            </h3>
            
            <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem' }}>
              {activeImportantTopics.map((topic, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <span style={{ color: '#fbbf24' }}>★</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Previous Year Papers */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
              <FileText size={18} color="var(--accent-primary)" /> PYQ Papers (.PDF)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {mockPyqPapers.map((paper, i) => (
                <div 
                  key={i} 
                  style={{ 
                    padding: '0.75rem', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {paper.name}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Code: {paper.code}</span>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer', fontWeight: 600 }}
                      onClick={() => handleDownloadPaper(paper.name)}
                    >
                      <Download size={12} /> Get PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
