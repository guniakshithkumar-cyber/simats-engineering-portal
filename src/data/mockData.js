// Mock Data for SIMATS Engineering Student Portal

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics Engineering',
  'Bio-Technology'
];

export const BRANCHES = [
  { id: 'CSE', name: 'Computer Science & Engineering' },
  { id: 'ECE', name: 'Electronics & Communication Engineering' },
  { id: 'MECH', name: 'Mechanical Engineering' },
  { id: 'CIVIL', name: 'Civil Engineering' },
  { id: 'EEE', name: 'Electrical & Electronics Engineering' },
  { id: 'BIOTECH', name: 'Bio-Technology' }
];

// Start completely empty as students will upload all content
export const initialFacultyData = [];

export const initialEventsData = [];

// Empty concept maps dictionary mapped by branch
export const initialConceptMaps = {
  CSE: { semesters: [1, 2, 3, 4, 5, 6, 7, 8], maps: [] },
  ECE: { semesters: [1, 2, 3, 4, 5, 6, 7, 8], maps: [] },
  MECH: { semesters: [1, 2, 3, 4, 5, 6, 7, 8], maps: [] },
  CIVIL: { semesters: [1, 2, 3, 4, 5, 6, 7, 8], maps: [] },
  EEE: { semesters: [1, 2, 3, 4, 5, 6, 7, 8], maps: [] },
  BIOTECH: { semesters: [1, 2, 3, 4, 5, 6, 7, 8], maps: [] }
};

export const initialQuestionBanks = [];

export const initialClubsData = [];

export const initialUgcSubmissions = [];

// Helper functions for State Management inside the app, persisting to localStorage
export const getStoredData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`simats_portal_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage`, e);
    return fallback;
  }
};

export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(`simats_portal_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage`, e);
  }
};
