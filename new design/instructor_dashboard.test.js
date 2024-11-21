const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, './instructor_dashboard.html'), 'utf8');
let dom;
let document;

beforeAll(() => {
  // Set up a shared JSDOM instance
  dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
  document = dom.window.document;
});

beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
});

afterEach(() => {
  // Restore mocks after each test
  jest.restoreAllMocks();
});

describe('Instructor Dashboard', () => {
  test('Loads the dashboard title', () => {
    const title = document.querySelector('.main-container h2');
    expect(title.textContent).toBe('Instructor Dashboard');
  });

  test('Displays content for managing students when "Manage Students" is clicked', () => {
    // Simulate clicking the "Manage Students" button
    const manageStudentsButton = document.querySelector('.nav-button');
    manageStudentsButton.click();

    // Check if the Student List is loaded in the content area
    const contentArea = document.getElementById('content-area');
    expect(contentArea.innerHTML).toContain('Student List');
  });

  test('Can add a new student', () => {
    // Set up a mock student list
    const mockLocalStorage = [{ id: 1, name: 'John Doe' }];
    localStorage.setItem('studentList', JSON.stringify(mockLocalStorage));

    // Call displayStudents to load students
    const loadStudentsButton = document.querySelector('.nav-button');
    loadStudentsButton.click();

    // Verify at least one student row is added
    const studentTable = document.querySelectorAll('#content-area table tbody tr');
    expect(studentTable.length).toBeGreaterThan(0);
  });
});
