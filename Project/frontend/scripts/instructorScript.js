//------------------------------------------------------
//              General control
//------------------------------------------------------

// store data in local storage
document.addEventListener("DOMContentLoaded", storeDataInLocalStorage);

// Display controller 
function loadContent(section) {
    if (section === 'students') {
        displayStudents();
    } else if (section === 'teams') {
        displayTeams();
    } else if (section === 'peerAssessments') {
        displayEvaluations();
    } else if (section === 'search') {
        displaySearchView();
    }
    setActiveButton(section);
}
function displaySearchView() {
    let html = `
        <h3>Search for Team Members</h3>
        <form onsubmit="performSearch(event)" style="display: inline;">
            <input type="text" id="search-query" placeholder="" required>
            <button type="submit">Search</button>
        </form>
        
        
        <table style="margin-top: 20px; width: 100%;">
            <thead>
                <tr>
                    <th>Team</th>
                    <th>Student</th>
                    <th>Student ID</th>
                    <th>Number of Reviews</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody id="search-results">
                <tr><td colspan="5">No results found. Please enter a search query.</td></tr>
            </tbody>
        </table>
    `;

    document.getElementById('content-area').innerHTML = html;
}

// Function to set active button based on the section
function setActiveButton(section) {
    // Remove the 'active' class from all nav buttons
    document.querySelectorAll('.nav-button').forEach(button => button.classList.remove('active'));

    // Add the 'active' class to the clicked button based on the section
    const buttonMap = {
        'students': 'Manage Students',
        'teams': 'Manage Teams',
        'peerAssessments': 'Peer Assessments'
    };

    const activeButton = Array.from(document.querySelectorAll('.nav-button')).find(button => button.innerText === buttonMap[section]);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Function to handle search
function performSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-query').value.toLowerCase();

    // Retrieve teams and evaluations from local storage
    const teams = JSON.parse(localStorage.getItem("savedTeams")) || [];
    const allEvaluations = JSON.parse(localStorage.getItem("evaluation")) || {};

    // Generate results HTML based on search
    let resultsHtml = "";
    teams.forEach(team => {
        team.members.forEach(member => {
            if (member.name.toLowerCase().includes(query) || member.id.toString().includes(query)) {
                const memberReviews = allEvaluations[member.id] || [];
                const reviewCount = memberReviews.length;

                // Add matching student to results HTML
                resultsHtml += `<tr>
                    <td>${team.teamName}</td>
                    <td>${member.name}</td>
                    <td>${member.id}</td>
                    <td>${reviewCount > 0 ? reviewCount : "No reviews yet"}</td>
                    <td>${reviewCount > 0 ? `<button onclick="showStudentReviews(${member.id})">View Details</button>` : ""}</td>
                </tr>`;
            }
        });
    });

    // Update the results table or show "No matches found" if empty
    document.getElementById('search-results').innerHTML = resultsHtml || `<tr><td colspan="5">No matching students found.</td></tr>`;
}

// display video background    
function toggleVideoVisibility() {
    const video = document.getElementById("backgroundVideo");

    // Toggle display and play/pause
    if (video.style.display === "none" || video.style.display === "") {
        video.style.display = "block"; // Show the video
        video.play(); // Play the video
    } else {
        video.style.display = "none"; // Hide the video
        video.pause(); // Pause the video
    }
}

// Ensure the video is hidden initially
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("backgroundVideo");
    video.style.display = "none"; // Hide it initially
});
//------------------------------------------------------
//              Student control
//------------------------------------------------------

// display student
function displayStudents() {
    // Retrieve the current list of students from localStorage or initialize an empty array if not available
    const students = JSON.parse(localStorage.getItem('studentList')) || [];

    // Build HTML for displaying the student list with a "Select All" checkbox
    let html = `
        <h3>Student List</h3>
        <table>
            <thead>
                <tr>
                    <th><input type="checkbox" id="select-all" onclick="toggleSelectAll()"> Select All</th>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Iterate over each student to display their information
    students.forEach(student => {
        html += `<tr>
            <td><input type="checkbox" class="student-checkbox" value="${student.id}"></td>
            <td>${student.id}</td>
            <td>${student.name}</td>
        </tr>`;
    });



    // Add buttons for creating teams and adding a CSV
    html += '<button class="action-button" onclick="createTeam()">Create Team</button>';
    html += '<button class="action-button" onclick="addCSV()">CSV</button>';
    html += '<button class="action-button" onclick="showAddStudentForm()">Add</button>';
    html += '<button class="action-button" onclick="deleteStudent()">Delete</button>';

    // Add a div for the add-student form (this will be filled by showAddStudentForm)
    html += '<div id="add-student-form"></div>';
    html += "</tbody></table>";
    // Update the content area with the constructed HTML
    document.getElementById('content-area').innerHTML = html;
}

// Function to toggle "Select All" checkboxes
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('select-all');
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// add student
function addStudent() {
    // Prompt user for student details
    const id = prompt("Enter Student ID:");
    const name = prompt("Enter Student Name:");

    // Check if both id and name are provided
    if (!id || !name) {
        alert("Both ID and Name are required!");
        return;
    }

    // Retrieve the current student list
    const students = JSON.parse(localStorage.getItem('studentList')) || [];

    // Check for duplicate ID
    if (students.some(student => student.id === parseInt(id, 10))) {
        alert("A student with this ID already exists!");
        return;
    }

    // Add new student to the list
    students.push({ id: parseInt(id, 10), name: name.trim() });

    // Save the updated list back to localStorage
    localStorage.setItem('studentList', JSON.stringify(students));

    // Refresh the display
    displayStudents();
}

// delete student
function deleteStudent() {
    // Retrieve the current student list
    let students = JSON.parse(localStorage.getItem('studentList')) || [];

    // Get selected checkboxes
    const selectedCheckboxes = document.querySelectorAll('.student-checkbox:checked');

    // If no students are selected, show a message and exit
    if (selectedCheckboxes.length === 0) {
        alert("Please select at least one student to delete.");
        return;
    }

    // Collect IDs of selected students
    const selectedIds = Array.from(selectedCheckboxes).map(checkbox => parseInt(checkbox.value, 10));

    // Filter out students who are not selected
    students = students.filter(student => !selectedIds.includes(student.id));

    // Save the updated list back to localStorage
    localStorage.setItem('studentList', JSON.stringify(students));

    // Refresh the display
    displayStudents();
}

// add student form
function showAddStudentForm() {
    // Build HTML form for adding a new student
    const formHtml = `
        <h4>Add New Student</h4>
        <input type="text" id="new-student-id" placeholder="Student ID" required>
        <input type="text" id="new-student-name" placeholder="Student Name" required>
        <button onclick="submitStudentForm()">Submit</button>
    `;

    // Insert the form HTML into the 'add-student-form' div
    document.getElementById('add-student-form').innerHTML = formHtml;
}

// submit student form
function submitStudentForm() {
    // Retrieve values from the input fields
    const id = document.getElementById('new-student-id').value.trim();
    const name = document.getElementById('new-student-name').value.trim();

    // Check if both fields are provided
    if (!id || !name) {
        alert("Both ID and Name are required!");
        return;
    }

    // Retrieve the current student list from localStorage
    const students = JSON.parse(localStorage.getItem('studentList')) || [];

    // Check for duplicate ID
    if (students.some(student => student.id === parseInt(id, 10))) {
        alert("A student with this ID already exists!");
        return;
    }

    // Add new student to the list
    students.push({ id: parseInt(id, 10), name });

    // Save the updated list back to localStorage
    localStorage.setItem('studentList', JSON.stringify(students));

    // Clear the form
    document.getElementById('add-student-form').innerHTML = "";

    // Refresh the student list display
    displayStudents();
}

// add CSV file
function addCSV() {
    // Create a file input element dynamically
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.onchange = event => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const csvData = e.target.result;
            parseCSV(csvData);
        };

        if (file) {
            reader.readAsText(file);
        }
    };

    // Trigger the file selection dialog
    fileInput.click();
}


// Parse CSV file
function parseCSV(data) {
    const rows = data.split('\n').map(row => row.split(','));

    // Retrieve or initialize the current list of students from localStorage
    const students = JSON.parse(localStorage.getItem('studentList')) || [];

    // Iterate over each row, skipping header and empty rows
    rows.forEach(([id, name], index) => {
        // Skip header or empty rows
        if (index === 0 && id === "id" && name === "name") return;
        if (!id || !name) return;

        // Parse ID as an integer
        const student = { id: parseInt(id.trim(), 10), name: name.trim() };

        // Add only if the student ID is unique
        if (!students.some(s => s.id === student.id)) {
            students.push(student);
        }
    });

    // Save the updated student list back to localStorage
    localStorage.setItem('studentList', JSON.stringify(students));
    displayStudents();  // Refresh the student list display
    console.log("CSV parsing completed. Students added:", students); // Log for debugging
}

//------------------------------------------------------
//              Team control
//------------------------------------------------------

// Display team
function displayTeams() {
    // Retrieve teams from localStorage or initialize as an empty array if not present
    const teams = JSON.parse(localStorage.getItem('savedTeams')) || [];

    let html = "<h3>Teams:</h3>";

    // Check if any teams exist, otherwise display a message
    if (teams.length === 0) {
        html += "<p>No teams created yet.</p>";
    } else {
        html += '<button class="action-button" onclick="deleteSelectedTeams()">Delete Team</button><br/><br/>';


        // Loop through each team and display its name and members
        teams.forEach((team, index) => {
            if (team.teamName && team.members) {
                html += `<div>
                            <input type="checkbox" class="team-checkbox" value="${index}">
                            <strong>${team.teamName}</strong>
                            <ul>`;

                // Display each member's name and ID in the list
                team.members.forEach(member => {
                    html += `<li>${member.name} (ID: ${member.id})</li>`;
                });

                html += "</ul></div>";
            }
        });
    }

    // Update the DOM with the constructed HTML
    document.getElementById('content-area').innerHTML = html;
}

// create team
function createTeam() {
    const students = JSON.parse(localStorage.getItem('studentList')) || [];
    const selectedStudents = [];

    // Collect selected students
    document.querySelectorAll('.student-checkbox:checked').forEach(checkbox => {
        const studentId = parseInt(checkbox.value, 10); // Ensure ID is a number
        const student = students.find(s => s.id === studentId);
        if (student) selectedStudents.push(student);
    });

    // Check if any students are selected
    if (selectedStudents.length === 0) {
        alert("Please select at least one student to create a team.");
        return; // Exit function if no students are selected
    }

    // Get the current teams and determine the next team name
    const teams = JSON.parse(localStorage.getItem('savedTeams')) || [];
    const nextTeamNumber = teams.length + 1;
    const teamName = `Team ${nextTeamNumber}`;

    // Add the new team with selected members
    teams.push({ teamName: teamName, members: selectedStudents });
    localStorage.setItem('savedTeams', JSON.stringify(teams));

    // Remove selected students from the student list
    const remainingStudents = students.filter(student => !selectedStudents.some(s => s.id === student.id));
    localStorage.setItem('studentList', JSON.stringify(remainingStudents));

    // Refresh the student list to reflect changes
    displayStudents();
    //displayTeams(); // If you'd like to refresh the team display as well
}

// Delete team
function deleteSelectedTeams() {


    const teams = JSON.parse(localStorage.getItem('savedTeams')) || [];
    const students = JSON.parse(localStorage.getItem('studentList')) || [];
    const selectedTeams = [];

    document.querySelectorAll('.team-checkbox:checked').forEach(checkbox => {
        selectedTeams.push(parseInt(checkbox.value));
    });



    const remainingTeams = teams.filter((team, index) => {
        if (selectedTeams.includes(index)) {
            team.members.forEach(member => {
                if (!students.some(student => student.id === member.id)) {
                    students.push(member);
                }
            });
            return false;
        }
        return true;
    });

    localStorage.setItem('savedTeams', JSON.stringify(remainingTeams));
    localStorage.setItem('studentList', JSON.stringify(students));

    displayStudents();
    displayTeams();
}

//------------------------------------------------------
//              Peer Review control
//------------------------------------------------------

// display evaluations
function displayEvaluations() {
    // Retrieve teams and evaluations from local storage
    const allEvaluations = JSON.parse(localStorage.getItem("evaluation")) || {};
    const teams = JSON.parse(localStorage.getItem("savedTeams")) || [];

    // Add the search form and hidden back button at the top of the HTML content
    let html = `
        <h3>Peer Review Status for Team Members</h3>
        <button id="back-button" onclick="displayEvaluations()" style="display: none;">Back</button>
        
        <table>
            <thead>
                <tr>
                    <th>Team</th>
                    <th>Student</th>
                    <th>Student ID</th>
                    <th>Number of Reviews</th>
                    <th>Cooperation</th>
                    <th>Conceptual Contribution</th>
                    <th>Practical Contribution</th>
                    <th>Work Ethic</th>
                    <th>Average</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody id="evaluation-rows">
    `;

    // Populate the table with all students initially
    teams.forEach(team => {
        team.members.forEach(member => {
            const memberReviews = allEvaluations[member.id] || [];
            const reviewCount = memberReviews.length;

            // Calculate the average for each criterion if reviews are available
            let cooperationAvg = 0, conceptualAvg = 0, practicalAvg = 0, workEthicAvg = 0, overallAvg = 0;

            if (reviewCount > 0) {
                memberReviews.forEach(review => {
                    cooperationAvg += Number(review["Cooperation"]) || 0;
                    conceptualAvg += Number(review["Conceptual Contribution"]) || 0;
                    practicalAvg += Number(review["Practical Contribution"]) || 0;
                    workEthicAvg += Number(review["Work Ethic"]) || 0;
                });
                cooperationAvg /= reviewCount;
                conceptualAvg /= reviewCount;
                practicalAvg /= reviewCount;
                workEthicAvg /= reviewCount;
                overallAvg = (cooperationAvg + conceptualAvg + practicalAvg + workEthicAvg) / 4;
            }

            html += `<tr class="evaluation-row">
                <td>${team.teamName}</td>
                <td>${member.name}</td>
                <td>${member.id}</td>
                <td>${reviewCount > 0 ? reviewCount : "No reviews yet"}</td>
                <td>${reviewCount > 0 ? cooperationAvg.toFixed(1) : "N/A"}</td>
                <td>${reviewCount > 0 ? conceptualAvg.toFixed(1) : "N/A"}</td>
                <td>${reviewCount > 0 ? practicalAvg.toFixed(1) : "N/A"}</td>
                <td>${reviewCount > 0 ? workEthicAvg.toFixed(1) : "N/A"}</td>
                <td>${reviewCount > 0 ? overallAvg.toFixed(1) : "N/A"}</td>
                <td>${reviewCount > 0 ? `<button onclick="showStudentReviews(${member.id})">View Details</button>` : ""}</td>
            </tr>`;
        });
    });

    html += "</tbody></table>";
    document.getElementById('content-area').innerHTML = html;

    // Hide the back button when loading the full list
    document.getElementById('back-button').style.display = "none";
}


// Function to display detailed reviews for a specific student
function showStudentReviews(studentId) {
    const allEvaluations = JSON.parse(localStorage.getItem("evaluation")) || {};
    const students = JSON.parse(localStorage.getItem("studentList")) || [];
    const student = students.find(s => s.id == studentId);
    const studentReviews = allEvaluations[studentId] || [];

    let html = `<h3>Reviews for ${student ? student.name : "Unknown Student"}</h3><button onclick="displayEvaluations()">Back</button><br/><br/>`;

    if (studentReviews.length > 0) {
        let comments = [];

        html += "<table><thead><tr><th>Reviewer</th><th>Cooperation</th><th>Conceptual Contribution</th><th>Practical Contribution</th><th>Work Ethic</th><th>Average</th></tr></thead><tbody>";

        studentReviews.forEach(review => {
            const reviewer = students.find(s => s.id == review.reviewerId);

            // Calculate the average score for this individual review
            const cooperation = Number(review.Cooperation) || 0;
            const conceptual = Number(review["Conceptual Contribution"]) || 0;
            const practical = Number(review["Practical Contribution"]) || 0;
            const workEthic = Number(review["Work Ethic"]) || 0;
            const individualAvg = ((cooperation + conceptual + practical + workEthic) / 4).toFixed(1);

            html += `<tr>
                <td>${reviewer ? reviewer.name : "Anonymous"}</td>
                <td>${cooperation || "N/A"}</td>
                <td>${conceptual || "N/A"}</td>
                <td>${practical || "N/A"}</td>
                <td>${workEthic || "N/A"}</td>
                <td>${individualAvg}</td>
            </tr>`;

            // Collect comments if available
            if (review.comments) comments.push(review.comments);
        });

        html += "</tbody></table>";

        // Display all comments below the table
        html += "<h4>Feedback Comments:</h4>";
        if (comments.length > 0) {
            html += "<ul>";
            comments.forEach(comment => {
                html += `<li>"${comment}"</li>`;
            });
            html += "</ul>";
        } else {
            html += "<p>No comments provided.</p>";
        }

    } else {
        html += "<p>No reviews available for this student.</p>";
    }

    document.getElementById('content-area').innerHTML = html;
}