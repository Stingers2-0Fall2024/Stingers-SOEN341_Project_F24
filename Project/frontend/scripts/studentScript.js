

        //------------------------------------------------------
        //              General control
        //------------------------------------------------------

        // Display controller
        function loadContent(section) {
            const contentArea = document.getElementById("content-area");

            if (section === 'yourTeam') {
                displayStudentTeam(contentArea);
            } else if (section === 'peerAssessment') {
                displayPeerAssessmentForm(contentArea);
            } else if (section === 'Feedback') {
                displayFeedbackDashboard(contentArea);
            } else if (section === 'teacherInstructions') {
                displayTeacherInstructions(contentArea);
            } else if (section === 'availability') {
                showAvailabilityView(contentArea); // New section for Availability
            } else {
                console.error("Unknown section:", section);
            }
            setActiveButton(section);
        }



        // Function to set active button based on the section
        // Function to toggle active state for navigation and availability buttons
        function setActiveButton(buttonClass, clickedButton) {
            // Remove 'active' class from all buttons of the specified class
            document.querySelectorAll(buttonClass).forEach(button => button.classList.remove('active'));

            // Add 'active' class to the clicked button
            clickedButton.classList.add('active');
        }

        // Event listeners for navigation buttons
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', function () {
                setActiveButton('.nav-button', this); // Apply active state to clicked navigation button
            });
        });

        // Event listeners for availability buttons
        document.querySelectorAll('.submit-button').forEach(button => {
            button.addEventListener('click', function () {
                setActiveButton('.submit-button', this); // Apply active state to clicked availability button
            });
        });


        // Get current user
        function getCurrentUser() {
            return JSON.parse(localStorage.getItem('currentUser')) || {};
        }

        // Display video background
        let isVideoVisible = false;
        function toggleVideoVisibility() {
            const video = document.getElementById("backgroundVideo");
            if (isVideoVisible) {
                video.style.display = "none";
                video.pause();
            } else {
                video.style.display = "block";
                video.play();
            }
            isVideoVisible = !isVideoVisible;
        }

        // Get student name
        function getStudentName(studentId) {
            const students = JSON.parse(localStorage.getItem('studentList') || '[]');
            const student = students.find(s => s.id === studentId);
            return student ? student.name : '';
        }

        //------------------------------------------------------
        //              Your Team control
        //------------------------------------------------------

        // Fetch the logged-in student's data 
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

        // display the student's team
        function displayStudentTeam(container) {
            // Retrieve teams from localStorage
            const teams = JSON.parse(localStorage.getItem('savedTeams')) || [];

            // Find the team that includes the current student by ID, ensuring IDs are numbers
            const studentTeam = teams.find(team =>
                team.members.some(member => Number(member.id) === Number(currentUser.id))
            );

            // Display team if found
            if (studentTeam) {
                let html = `<h3>Your Team: ${studentTeam.teamName}</h3><ul>`;
                studentTeam.members.forEach(member => {
                    html += `<li>${member.name} (ID: ${member.id})</li>`;
                });
                html += `</ul>`;
                container.innerHTML = html;
            } else {
                container.innerHTML = "<h3>Your Team</h3><p>You are not currently assigned to a team.</p>";
            }
        }

        // Get team members
        function findUserTeam(currentUser) {
            const teams = JSON.parse(localStorage.getItem('savedTeams')) || [];
            return teams.find(team =>
                team.members.some(member => Number(member.id) === Number(currentUser.id))
            );
        }

        // Helper to generate options for team members
        function generateTeamMemberOptions(studentTeam, currentUser) {
            if (!studentTeam) {
                return `<option>No team members found</option>`;
            }

            return studentTeam.members
                .filter(member => member.id !== currentUser.id)
                .map(member => `<option style="color: #00FF00; background-color: #1e1e1e;" value="${member.id}">${member.name}</option>`)
                .join('');
        }

        // Load the student’s team
        document.addEventListener("DOMContentLoaded", () => {
            const contentArea = document.getElementById("content-area");
            displayStudentTeam(contentArea);
        });

        //------------------------------------------------------
        //              Peer Assessment control
        //------------------------------------------------------

        // Display Peer Assessment
        function displayPeerAssessmentForm(contentArea) {
            const currentUser = getCurrentUser();
            const studentTeam = findUserTeam(currentUser);
            const teamMemberOptions = generateTeamMemberOptions(studentTeam, currentUser);

            contentArea.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 100%;">
            <h3>Peer Assessment</h3>
            <label for="team-member" style="margin-bottom: 15px; color: #E0E0E0;">Select Team Member:</label>
            <select id="team-member" onchange="loadSavedEvaluation()" style="margin-bottom: 20px; width: 100%; padding: 12px; background-color: #121212; color: #00FF00; border: 1px solid #333333; border-radius: 8px; font-size: 20px; cursor: pointer;">
                ${teamMemberOptions}
            </select>
            <div id="rating-sliders"></div>
            <div id="feedback-comments"></div>
            <div style="flex-grow: 1;"></div> <!-- Spacer to push Submit button to the bottom -->
            <button onclick="saveEvaluation()" style="padding: 8px; background-color: #00FF00; color: #121212; border: none; border-radius: 8px; cursor: pointer; font-size: 20px; margin-top: 20px;">Submit</button>
        </div>
    `;

            // Initialize the form with saved evaluation data for the selected team member
            loadSavedEvaluation();
        }

        function loadSavedEvaluation() {
            const selectedMemberId = document.getElementById("team-member").value;
            const currentUser = getCurrentUser();
            const evaluations = JSON.parse(localStorage.getItem("evaluation")) || {};
            const savedEvaluations = evaluations[selectedMemberId] || [];

            // Find the current user's existing review for the selected team member
            const savedEvaluation = savedEvaluations.find(
                review => review.reviewerId === currentUser.id
            ) || {};

            // Populate the form fields with saved data if it exists
            document.getElementById("rating-sliders").innerHTML = generateRatingSliders(savedEvaluation);
            document.getElementById("feedback-comments").innerHTML = generateFeedbackTextarea(savedEvaluation);
        }

        // Helper to generate rating sliders with saved values if available
        function generateRatingSliders(savedEvaluation) {
            const dimensions = ["Cooperation", "Conceptual Contribution", "Practical Contribution", "Work Ethic"];
            return `
        <div class="ratings-container" style="flex-grow: 1;">
            ${dimensions.map(dimension => `
                <div class="rating-row">
                    <label class="rating-label">${dimension}:</label>
                    <div class="slider-container">
                        <input type="range" min="1" max="5" value="${savedEvaluation[dimension] || 1}" 
                               id="${dimension}-slider" 
                               oninput="this.nextElementSibling.textContent = this.value">
                        <span class="rating-value">${savedEvaluation[dimension] || 1}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
        }


        // Display ratings
        function generateRatingSliders(savedEvaluation) {
            const dimensions = ["Cooperation", "Conceptual Contribution", "Practical Contribution", "Work Ethic"];
            return `
        <div class="ratings-container" style="flex-grow: 1;">
            ${dimensions.map(dimension => `
                <div class="rating-row">
                    <label class="rating-label">${dimension}:</label>
                    <div class="slider-container">
                        <input type="range" min="1" max="5" value="${savedEvaluation[dimension] || 1}" 
                               id="${dimension}-slider" 
                               oninput="this.nextElementSibling.textContent = this.value">
                        <span class="rating-value">${savedEvaluation[dimension] || 1}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
        }

        // Display textarea
        function generateFeedbackTextarea(savedEvaluation) {
            return `
        <div class="rating-row" style="margin-top: 20px;">
            <label class="rating-label">Feedback Comments:</label>
            <div class="slider-container" style="width: 100%;">
                <textarea id="feedback-comments-textarea" rows="4" style="width: 100%; resize: none; background-color: #1e1e1e; border: 1px solid #444444; color: #E0E0E0; border-radius: 8px; padding: 10px;" placeholder="Provide detailed feedback for your peer...">${savedEvaluation.comments || ''}</textarea>
            </div>
        </div>
    `;
        }

        // Save evaluation
        function saveEvaluation() {
            const currentUser = getCurrentUser();
            const selectedMemberId = document.getElementById("team-member").value;

            // Ensure a student can’t submit a review for themselves
            if (Number(selectedMemberId) === Number(currentUser.id)) {
                alert("You cannot submit a peer review for yourself.");
                return;
            }

            // Create the evaluation data object
            const evaluation = {
                "Cooperation": document.getElementById("Cooperation-slider").value,
                "Conceptual Contribution": document.getElementById("Conceptual Contribution-slider").value,
                "Practical Contribution": document.getElementById("Practical Contribution-slider").value,
                "Work Ethic": document.getElementById("Work Ethic-slider").value,
                "comments": document.getElementById("feedback-comments-textarea").value,
                "reviewerId": currentUser.id
            };

            // Retrieve all evaluations for the selected member
            let evaluations = JSON.parse(localStorage.getItem("evaluation")) || {};

            // Initialize the reviewed student's data if it doesn't exist
            if (!evaluations[selectedMemberId]) {
                evaluations[selectedMemberId] = [];
            }

            // Update or add the evaluation from the current user
            const existingIndex = evaluations[selectedMemberId].findIndex(
                review => review.reviewerId === currentUser.id
            );

            if (existingIndex !== -1) {
                evaluations[selectedMemberId][existingIndex] = evaluation; // Update existing review
            } else {
                evaluations[selectedMemberId].push(evaluation); // Add new review
            }

            localStorage.setItem("evaluation", JSON.stringify(evaluations));
            alert("Evaluation submitted successfully!");
        }

        //------------------------------------------------------
        //              Peer Review control
        //------------------------------------------------------

        // Function to display the Feedback Dashboard, including received peer reviews
        function displayFeedbackDashboard(contentArea) {
            contentArea.innerHTML = `
        <h3>Feedback Dashboard</h3>
        <div id="peer-reviews-container">
            <!-- Aggregated peer reviews will be loaded here -->
        </div>
    `;

            // Load reviews only for the current user
            displayPeerReviewsForCurrentUser();
        }

        // Function to display peer reviews for the current user
        function displayPeerReviews() {
            const currentUser = getCurrentUser();
            const peerReviewsContainer = document.getElementById("peer-reviews-container");

            // Retrieve all evaluations from local storage
            const allEvaluations = JSON.parse(localStorage.getItem("evaluation")) || {};

            // Retrieve only evaluations for the current user
            const currentUserReviews = allEvaluations[currentUser.id] || [];

            if (currentUserReviews.length > 0) {
                // Generate HTML for each peer review
                const reviewsHtml = currentUserReviews.map((evaluation, index) => {
                    return `
                <div class="review" style="margin-bottom: 20px; padding: 15px; border: 1px solid #444444; border-radius: 8px; background-color: #1e1e1e;">
                    <h4>Review #${index + 1}</h4>
                    ${generateReviewHtml(evaluation)}
                </div>
            `;
                }).join('');

                peerReviewsContainer.innerHTML = reviewsHtml;
            } else {
                peerReviewsContainer.innerHTML = "<p>No peer reviews available yet.</p>";
            }
        }

        // Function to generate HTML for individual review content
        function generateReviewHtml(evaluation) {
            const dimensions = ["Cooperation", "Conceptual Contribution", "Practical Contribution", "Work Ethic"];
            const ratingsHtml = dimensions.map(dimension => `
        <p><strong>${dimension}:</strong> ${evaluation[dimension]}</p>
    `).join('');

            return `
        ${ratingsHtml}
        <p><strong>Feedback Comments:</strong> ${evaluation.comments || "No comments provided."}</p>
    `;
        }

        function displayPeerReviewsForCurrentUser() {
            const currentUser = getCurrentUser();
            console.log("Current User:", currentUser); // Debug: Check current user data

            const peerReviewsContainer = document.getElementById("peer-reviews-container");

            // Retrieve all evaluations from local storage
            const allEvaluations = JSON.parse(localStorage.getItem("evaluation")) || {};
            console.log("All Evaluations:", allEvaluations); // Debug: Check all evaluations data in local storage

            // Get only the evaluations for the current user
            const userReviews = allEvaluations[currentUser.id] || [];
            console.log("Current User Reviews:", userReviews); // Debug: Check if current user's reviews are retrieved

            if (userReviews.length > 0) {
                // Calculate and display aggregated scores and comments for the current user
                const aggregatedData = calculateAggregatedFeedback(userReviews);
                console.log("Aggregated Data:", aggregatedData); // Debug: Check aggregated feedback

                peerReviewsContainer.innerHTML = generateAggregatedReviewHtml(aggregatedData);
            } else {
                peerReviewsContainer.innerHTML = "<p>No peer reviews available yet.</p>";
            }
        }

        function calculateAggregatedFeedback(reviews) {
            const dimensions = ["Cooperation", "Conceptual Contribution", "Practical Contribution", "Work Ethic"];
            const aggregatedScores = {};
            const comments = [];

            // Initialize scores for each dimension
            dimensions.forEach(dimension => {
                aggregatedScores[dimension] = 0;
            });

            // Sum up scores for each dimension and collect comments anonymously
            reviews.forEach(review => {
                dimensions.forEach(dimension => {
                    aggregatedScores[dimension] += Number(review[dimension]);
                });
                if (review.comments) {
                    comments.push(review.comments);
                }
            });

            // Calculate average score for each dimension
            const numReviews = reviews.length;
            dimensions.forEach(dimension => {
                aggregatedScores[dimension] = (aggregatedScores[dimension] / numReviews).toFixed(1); // rounded to one decimal place
            });

            return {
                scores: aggregatedScores,
                comments: comments
            };
        }

        function generateAggregatedReviewHtml(aggregatedData) {
            const dimensionsHtml = Object.entries(aggregatedData.scores).map(([dimension, score]) => `
        <p><strong>${dimension}:</strong> ${score} / 5</p>
    `).join('');

            const commentsHtml = aggregatedData.comments.length > 0
                ? aggregatedData.comments.map(comment => `<p>"${comment}"</p>`).join('')
                : "<p>No comments provided.</p>";

            return `
        <h4>Your Peer Review Summary</h4>
        ${dimensionsHtml}
        <h4>Comments:</h4>
        ${commentsHtml}
    `;
        }


        //------------------------------------------------------
        //              Instructions control
        //------------------------------------------------------

        // Display instructions
        function displayTeacherInstructions(contentArea) {
            contentArea.innerHTML = `
        <h3>Instructions</h3>
        <p>Rate your teammates on a 5-point scale for each dimension:</p>
        <p>Please focus on teamwork and ensure clear communication among members. Complete your project by the deadline and address all feedback during the development phase.</p>
        <div class="assessment-dimensions">
            <h3>Assessment Dimensions:</h3>
            <ul>
                <li><span class="dimension-title">Cooperation:</span> Actively participating in meetings; Communicating within the group; Assisting teammates when needed; Volunteering for tasks.</li>
                <li><span class="dimension-title">Conceptual Contribution:</span> Researching and gathering information; Quality of individual contribution; Suggesting ideas; Tying ideas together; Identifying effective approaches.</li>
                <li><span class="dimension-title">Practical Contribution:</span> Writing of the report(s); Reviewing others' report(s) or section(s); Providing constructive feedback on the report(s) or the presentation; Contributing to the organization of the work; Preparing presentations if needed.</li>
                <li><span class="dimension-title">Work Ethic:</span> Displaying a positive attitude; Respecting teammates; Respecting commitments; Meeting deadlines; Respecting team members' ideas.</li>
            </ul>
        </div>
    `;
        }


        //------------------------------------------------------
        //              Availability
        //------------------------------------------------------

        function showAvailabilityView(contentArea) {
            contentArea.innerHTML = `
        <h3>Availability</h3>
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <button class="submit-button" onclick="displayYourAvailability()">Your Availability</button>
            <button class="submit-button" onclick="displayTeamAvailability()">Team Availability</button>
            <button class="submit-button" onclick="saveAvailability()">Submit</button>
        </div>
        <div id="availabilityTableContainer">
            <!-- Availability table will be generated here -->
        </div>
    `;
            displayYourAvailability(); // Load "Your Availability" by default
        }
        function displayYourAvailability() {
            // Display the current user's availability
            generateAvailabilityTable(getCurrentUser().id); // Pass current user's ID
        }

        function displayTeamAvailability() {
            const currentUser = getCurrentUser();
            const team = findUserTeam(currentUser);

            if (!team) {
                document.getElementById("availabilityTableContainer").innerHTML = "<p>You are not assigned to a team.</p>";
                return;
            }

            // Exclude the current user from the team members list
            const teamMembers = team.members.filter(member => member.id !== currentUser.id);

            // Generate availability table for the team, passing the filtered team members
            generateAvailabilityTableForTeam(teamMembers);
        }

        function loadTeamMemberAvailability() {
            const selectedMemberId = document.getElementById("team-member-selector").value;
            generateAvailabilityTable(selectedMemberId); // Pass selected team member's ID
        }



        function generateAvailabilityTable(userId) {
            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const times = [
                "00:00-02:00", "02:00-04:00", "04:00-06:00", "06:00-08:00",
                "08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00",
                "16:00-18:00", "18:00-20:00", "20:00-22:00", "22:00-24:00"
            ];

            let tableHtml = '<table class="availability-table"><thead><tr><th>Time / Day</th>';
            days.forEach(day => tableHtml += `<th>${day}</th>`);
            tableHtml += '</tr></thead><tbody>';

            times.forEach(time => {
                tableHtml += `<tr><td>${time}</td>`;
                days.forEach(day => {
                    tableHtml += `<td class="unset" data-day="${day}" data-time="${time}" onclick="toggleAvailability(this, '${day}', '${time}', ${userId})"></td>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</tbody></table>';

            document.getElementById("availabilityTableContainer").innerHTML = tableHtml;
            loadAvailability(userId);
        }

        function generateAvailabilityTableForTeam(members) {
            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            const times = [
                "00:00-02:00", "02:00-04:00", "04:00-06:00", "06:00-08:00",
                "08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00",
                "16:00-18:00", "18:00-20:00", "20:00-22:00", "22:00-24:00"
            ];

            let tableHtml = '<table class="availability-table"><thead><tr><th>Time / Day</th>';
            days.forEach(day => tableHtml += `<th>${day}</th>`);
            tableHtml += '</tr></thead><tbody>';

            times.forEach(time => {
                tableHtml += `<tr><td>${time}</td>`;
                days.forEach(day => {
                    // Gather names of members who are available at this day and time
                    const availableMembers = members
                        .map(member => {
                            const availability = JSON.parse(localStorage.getItem(`availability_${member.id}`)) || {};
                            return availability[day]?.[time] === "Available" ? member.name : null;
                        })
                        .filter(name => name); // Filter out null values

                    // Display available members' names in the cell, or leave empty if none
                    tableHtml += `<td class="unset">${availableMembers.join(", ") || ""}</td>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</tbody></table>';

            document.getElementById("availabilityTableContainer").innerHTML = tableHtml;
        }

        function toggleAvailability(cell, day, time) {
            if (cell.classList.contains("unset")) {
                cell.classList.remove("unset");
                cell.classList.add("available");
                cell.textContent = "Available";
            } else if (cell.classList.contains("available")) {
                cell.classList.remove("available");
                cell.classList.add("unset");
                cell.textContent = "";
            }
            saveAvailabilityCell(day, time, cell.textContent);
        }

        function loadAvailability(userId) {
            const availability = JSON.parse(localStorage.getItem(`availability_${userId}`)) || {};
            document.querySelectorAll(`#${userId === getCurrentUser().id ? "availabilityTableContainer" : "teamAvailabilityTableContainer"} .availability-table td[data-day][data-time]`).forEach(cell => {
                const day = cell.getAttribute('data-day');
                const time = cell.getAttribute('data-time');
                const status = availability[day]?.[time] || "Unset";
                if (status === "Available") {
                    cell.classList.add("available");
                    cell.textContent = "Available";
                } else {
                    cell.classList.add("unset");
                    cell.textContent = "";
                }
            });
        }

        function saveAvailability() {
            const currentUser = getCurrentUser();
            const availability = JSON.parse(localStorage.getItem(`availability_${currentUser.id}`)) || {};

            document.querySelectorAll('.availability-table td.available').forEach(cell => {
                const day = cell.getAttribute('data-day');
                const time = cell.getAttribute('data-time');
                if (!availability[day]) {
                    availability[day] = {};
                }
                availability[day][time] = "Available";
            });

            localStorage.setItem(`availability_${currentUser.id}`, JSON.stringify(availability));
            alert("Availability saved successfully!");
        }
  
