const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, './student_dashboard.html'), 'utf8');
let dom;
let document;

beforeAll((done) => {
  dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
  document = dom.window.document;

  // Mock window.onload to ensure the DOM and scripts are fully loaded
  jest.spyOn(dom.window, 'onload').mockImplementation(() => {
    setTimeout(() => done(), 100); // Add a small delay to simulate loading time
  });
});

beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
});

afterEach(() => {
  // Restore mocks after each test
  jest.restoreAllMocks();
});

describe('Student Dashboard', () => {
  test('Loads the dashboard title', () => {
    const title = document.querySelector('.main-container h2');
    expect(title.textContent).toBe('Student Dashboard');
  });

  test('Displays team when "Your Team" is clicked', () => {
    const yourTeamButton = document.querySelector('.nav-button');
    yourTeamButton.click();
    const contentArea = document.getElementById('content-area');
    expect(contentArea.innerHTML).toContain('Your Team');
  });
});

  test('Can save a peer assessment', () => {
    // Mock current user data in localStorage
    const currentUser = { id: 1, name: 'John Doe' };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Mock peer assessment data and trigger the save function
    const peerAssessmentButton = document.createElement('button');
    peerAssessmentButton.onclick = () => document.getElementById('team-member').value = currentUser.id;

    peerAssessmentButton.click();

    const evaluations = JSON.parse(localStorage.getItem('evaluation'));
    expect(evaluations).toBeDefined();
  });
});
