const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

test('Student Dashboard renders correctly', () => {
  const html = fs.readFileSync(path.resolve(__dirname, './student_dashboard.html'), 'utf8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Create a snapshot of the HTML structure
  expect(document.body.innerHTML).toMatchSnapshot();
});
