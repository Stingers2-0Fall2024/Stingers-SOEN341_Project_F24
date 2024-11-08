const users = [
    { email: "john.doe@concordia.ca", password: "john123", role: "student", id: 1, name: "John Doe" },
    { email: "jane.smith@concordia.ca", password: "jane123", role: "student", id: 2, name: "Jane Smith" },
    { email: "sam.wilson@concordia.ca", password: "sam123", role: "student", id: 3, name: "Sam Wilson" },
    { email: "linda.johnson@concordia.ca", password: "linda123", role: "student", id: 4, name: "Linda Johnson" },
    { email: "paul.adams@concordia.ca", password: "paul123", role: "student", id: 5, name: "Paul Adams" },
    { email: "emily.brown@concordia.ca", password: "emily123", role: "student", id: 6, name: "Emily Brown" },
    { email: "michael.green@concordia.ca", password: "michael123", role: "student", id: 7, name: "Michael Green" },
    { email: "susan.white@concordia.ca", password: "susan123", role: "student", id: 8, name: "Susan White" },
    { email: "robert.black@concordia.ca", password: "robert123", role: "student", id: 9, name: "Robert Black" },
    { email: "lisa.gray@concordia.ca", password: "lisa123", role: "student", id: 10, name: "Lisa Gray" },
    { email: "instructor@concordia.ca", password: "instructor123", role: "instructor", id: 11, name: "Instructor" }
];



function validateLogin() {
    const enteredEmail = document.getElementById("email").value;
    const enteredPassword = document.getElementById("password").value;

    const user = users.find(u => u.email === enteredEmail && u.password === enteredPassword);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        saveEmail(enteredEmail);

        if (user.role === "student") {
            window.location.href = "student_dashboard.html";
        } else if (user.role === "instructor") {
            window.location.href = "instructor_dashboard.html";
        }
    } else {
        document.getElementById("loginResult").textContent = "Invalid credentials. Please try again.";
    }
}

// Track the visibility state of the video
let isVideoVisible = false;

function toggleVideoVisibility() {
    const video = document.getElementById("backgroundVideo");

    // Toggle the video’s visibility
    if (isVideoVisible) {
        video.style.display = "none"; // Hide the video
        video.pause(); // Pause video when hidden
    } else {
        video.style.display = "block"; // Show the video
        video.play(); // Start playback when visible
    }

    isVideoVisible = !isVideoVisible; // Update visibility state
    //video.playbackRate = 0.5;
}


function saveEmail(email) {
    let emails = JSON.parse(localStorage.getItem('savedEmails')) || [];
    if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem('savedEmails', JSON.stringify(emails));
    }
}

function loadEmailSuggestions() {
    const emailDatalist = document.getElementById("email-list");
    const savedEmails = JSON.parse(localStorage.getItem('savedEmails')) || [];

    emailDatalist.innerHTML = "";  // Clear existing options

    savedEmails.forEach(email => {
        const option = document.createElement("option");
        option.value = email;
        emailDatalist.appendChild(option);
    });
}


document.addEventListener("DOMContentLoaded", loadEmailSuggestions);