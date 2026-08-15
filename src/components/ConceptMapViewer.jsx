import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Download, Printer, Upload, BookOpen } from 'lucide-react';

export default function ConceptMapViewer({ conceptMaps, setConceptMaps, branches, triggerToast }) {
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSem, setSelectedSem] = useState(3);
  const [selectedMap, setSelectedMap] = useState(null);

  // Zoom and Pan State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef(null);

  // Upload/Contribute State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadSem, setUploadSem] = useState(3);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const currentBranchData = conceptMaps[selectedBranch] || { semesters: [], maps: [] };
  const semesterMaps = currentBranchData.maps.filter(m => m.semester === Number(selectedSem));

  // Set default map when selections change
  useEffect(() => {
    if (semesterMaps.length > 0) {
      setSelectedMap(semesterMaps[0]);
    } else {
      setSelectedMap(null);
    }
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [selectedBranch, selectedSem]);

  // Mouse Drag Panning Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom Helpers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Print Map Function
  const handlePrint = () => {
    if (!selectedMap) return;
    const printWindow = window.open('', '_blank');
    const svgHtml = svgRef.current.outerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>SIMATS Concept Map - ${selectedMap.subject}</title>
          <style>
            body { background: #ffffff; color: #000000; font-family: sans-serif; text-align: center; margin: 2rem; }
            svg { max-width: 100%; border: 1px solid #ccc; background: #fafafa; }
            h2 { margin-bottom: 0.5rem; }
            p { color: #555; margin-bottom: 1.5rem; }
          </style>
        </head>
        <body>
          <h2>SIMATS Engineering College - Subject Concept Map</h2>
          <h3>${selectedMap.subject} (Semester ${selectedMap.semester})</h3>
          <p>${selectedMap.description} | Contributed by ${selectedMap.contributor}</p>
          <div style="display:flex; justify-content:center;">
            ${svgHtml}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Download Map (SVG Export)
  const handleDownload = () => {
    if (!selectedMap) return;
    const svgData = svgRef.current.outerHTML;
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `concept-map-${selectedMap.subject.toLowerCase().replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    triggerToast('Download Started', `Concept Map for ${selectedMap.subject} downloaded successfully.`);
  };

  // Handle peer contribution map upload
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadSubject.trim()) {
      alert('Subject name is required.');
      return;
    }

    // Creating a mock generated SVG structure for custom uploads
    const newMap = {
      id: `map-${selectedBranch}-${Date.now()}`,
      subject: uploadSubject,
      semester: Number(uploadSem),
      description: uploadDesc || 'Peer-contributed subject concept map.',
      nodes: [
        { id: '1', label: uploadSubject, x: 400, y: 80, type: 'core' },
        { id: '2', label: 'Unit 1 & 2 Essentials', x: 250, y: 200, type: 'sub' },
        { id: '3', label: 'Unit 3 & 4 Essentials', x: 550, y: 200, type: 'sub' },
        { id: '4', label: 'Reference Readings', x: 150, y: 320, type: 'detail' },
        { id: '5', label: 'Practical Labs/Models', x: 350, y: 320, type: 'detail' },
        { id: '6', label: 'Exam Focus Questions', x: 500, y: 320, type: 'detail' },
        { id: '7', label: 'Important Formulae', x: 650, y: 320, type: 'detail' }
      ],
      links: [
        { source: '1', target: '2' },
        { source: '1', target: '3' },
        { source: '2', target: '4' },
        { source: '2', target: '5' },
        { source: '3', target: '6' },
        { source: '3', target: '7' }
      ],
      contributor: 'Student Contributor (Verified)',
      downloads: 0
    };

    const updatedBranchMaps = [...currentBranchData.maps, newMap];
    setConceptMaps({
      ...conceptMaps,
      [selectedBranch]: {
        ...currentBranchData,
        maps: updatedBranchMaps
      }
    });

    triggerToast('Upload Moderation', 'Concept Map uploaded! It will be reviewed by department moderators.');
    setShowUploadModal(false);
    setUploadSubject('');
    setUploadDesc('');
    setSelectedSem(uploadSem);
    setSelectedMap(newMap);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Subject Concept Maps</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Semester-wise visual concept directories linking topics, dependencies, and core units.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => setShowUploadModal(true)}>
          <Upload size={18} /> Contribute Map
        </button>
      </div>

      {/* Selectors Panel */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            Select Engineering Branch:
          </label>
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

        <div style={{ width: '120px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            Semester:
          </label>
          <select 
            className="glass-input glass-select" 
            value={selectedSem} 
            onChange={(e) => setSelectedSem(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            Available Concept Maps:
          </label>
          {semesterMaps.length > 0 ? (
            <select 
              className="glass-input glass-select"
              value={selectedMap ? selectedMap.id : ''}
              onChange={(e) => setSelectedMap(semesterMaps.find(m => m.id === e.target.value))}
            >
              {semesterMaps.map((map) => (
                <option key={map.id} value={map.id}>{map.subject}</option>
              ))}
            </select>
          ) : (
            <div style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
              No maps loaded for Sem {selectedSem}
            </div>
          )}
        </div>
      </div>

      {/* Main Concept Map Rendering Sandbox */}
      {selectedMap ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Map Info Bar */}
          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1rem 1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedMap.subject} - Curriculum Map</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                {selectedMap.description} | <span style={{ color: 'var(--accent-primary)' }}>Uploaded by {selectedMap.contributor}</span>
              </p>
            </div>
            
            {/* Interactive Control buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={handleZoomIn} title="Zoom In"><ZoomIn size={18} /></button>
              <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={handleZoomOut} title="Zoom Out"><ZoomOut size={18} /></button>
              <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={handleZoomReset} title="Reset"><RotateCcw size={18} /></button>
              <span style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></span>
              <button className="btn btn-secondary" onClick={handleDownload}><Download size={16} /> Download</button>
              <button className="btn btn-primary" onClick={handlePrint}><Printer size={16} /> Print Map</button>
            </div>
          </div>

          {/* SVG Canvas Board */}
          <div 
            style={{ 
              height: '500px', 
              background: '#070913', 
              border: '1px solid var(--glass-border)', 
              borderRadius: 'var(--radius-md)', 
              position: 'relative', 
              overflow: 'hidden', 
              cursor: isDragging ? 'grabbing' : 'grab' 
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg 
              ref={svgRef}
              width="100%" 
              height="100%" 
              viewBox="0 0 800 450" 
              style={{
                userSelect: 'none',
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
                </marker>
              </defs>

              {/* Render Connection Links */}
              {selectedMap.links.map((link, idx) => {
                const sourceNode = selectedMap.nodes.find(n => n.id === link.source);
                const targetNode = selectedMap.nodes.find(n => n.id === link.target);
                if (!sourceNode || !targetNode) return null;
                return (
                  <line 
                    key={idx}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="#4f46e5"
                    strokeWidth="2.5"
                    strokeDasharray={sourceNode.type === 'core' ? 'none' : '4,4'}
                    markerEnd="url(#arrow)"
                    opacity="0.75"
                  />
                );
              })}

              {/* Render Interactive Nodes */}
              {selectedMap.nodes.map((node) => {
                const isCore = node.type === 'core';
                const isSub = node.type === 'sub';
                
                return (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`} style={{ cursor: 'pointer' }}>
                    {/* Node Circle/Rect Shape */}
                    {isCore ? (
                      <rect 
                        x="-100" 
                        y="-25" 
                        width="200" 
                        height="50" 
                        rx="10" 
                        fill="url(#coreGlow)" 
                        stroke="#6366f1" 
                        strokeWidth="2" 
                      />
                    ) : isSub ? (
                      <rect 
                        x="-80" 
                        y="-20" 
                        width="160" 
                        height="40" 
                        rx="8" 
                        fill="#111428" 
                        stroke="#ec4899" 
                        strokeWidth="1.5" 
                      />
                    ) : (
                      <rect 
                        x="-75" 
                        y="-18" 
                        width="150" 
                        height="36" 
                        rx="6" 
                        fill="#171b36" 
                        stroke="var(--glass-border)" 
                        strokeWidth="1" 
                      />
                    )}

                    {/* Node Text Label */}
                    <text 
                      textAnchor="middle" 
                      dy="5" 
                      fill={isCore ? '#ffffff' : '#f3f4f6'} 
                      fontSize={isCore ? '14' : isSub ? '12' : '11'}
                      fontWeight={isCore ? '700' : '500'}
                    >
                      {node.label}
                    </text>

                    {/* Gradient definition for Core Node */}
                    <defs>
                      <linearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#1e1b4b" />
                      </linearGradient>
                    </defs>
                  </g>
                );
              })}
            </svg>

            {/* Instruction tooltip in board corner */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', pointerEvents: 'none' }}>
              💡 Drag to PAN • Scroll/Buttons to ZOOM
            </div>
          </div>

        </div>
      ) : (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No Concept Map Loaded</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Select another semester or click "Contribute Map" to load peer notes.</p>
        </div>
      )}

      {/* Upload Concept Map Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowUploadModal(false)}>✕</button>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.2rem' }}>Upload Concept Map</h3>
            
            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Subject Name:</label>
                <input 
                  type="text" 
                  placeholder="e.g. Operating Systems / Computer Networks" 
                  className="glass-input" 
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Target Semester:</label>
                  <select 
                    className="glass-input glass-select"
                    value={uploadSem}
                    onChange={(e) => setUploadSem(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Branch / Major:</label>
                  <select className="glass-input glass-select" value={selectedBranch} disabled>
                    <option value={selectedBranch}>{selectedBranch}</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Short Description:</label>
                <textarea 
                  rows="3" 
                  placeholder="Describe your map structure, which textbook syllabus it maps, or list any specific credits..."
                  className="glass-input"
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 500 }}>Upload File (SVG / PNG / PDF):</label>
                <div style={{ border: '2px dashed var(--glass-border)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.01)', cursor: 'pointer' }}>
                  <input 
                    type="file" 
                    id="fileMap" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      setUploadedFile(e.target.files[0]);
                      triggerToast('File Selected', e.target.files[0].name);
                    }}
                  />
                  <label htmlFor="fileMap" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Upload size={32} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{uploadedFile ? uploadedFile.name : 'Select SVG Map or PDF syllabus doc'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max size 10MB</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit Map Contribution
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
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
