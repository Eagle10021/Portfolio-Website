// === JavaScript Setup & Variables ===
// --- User Profile Data ---
const userName = "Arshdeep"; // Defines the user's name (used for personalization)
const age = 19; // Defines the user's age
const favLang = "JavaScript"; // Defines the user's favorite programming language

// Log variables and explain
console.log("User's Name:", userName); // Output: Name of the user to the console
console.log("User's Age:", age);       // Output: Age of the user to the console
console.log("Favorite Language:", favLang); // Output: Favorite programming language to the console

// Student object
// An object to hold structured information about the student/portfolio owner.
const student = {
    name: userName,
    // Uses saved user information for the major
    major: "Computer Engineering Technology - Computing Science",
    gradYear: 2027,
    hobbies: ["Technology tinkering", "Gaming", "Biking", "Automotive Enthusiasm"] // A list of the user's hobbies
};
console.log("Student object:", student); // Output: The complete student object to the console

// --- DOM Manipulation - Welcome message and current time ---
// Get the HTML element for the welcome message by its ID
const welcomeMessageDiv = document.getElementById("welcome-message");
// Set the text content, using a template literal for variable interpolation (userName)
welcomeMessageDiv.textContent = `Welcome to my Interactive Portfolio, ${userName}!`;

// --- Conditional Greetings based on time ---
// Function to check the time and display time/greeting
function showCurrentTime() {
    const now = new Date(); // Get the current date and time
    // Display the full current date and time in a user-friendly format
    document.getElementById("current-time").textContent = `Current Date & Time: ${now.toLocaleString()}`;
    
    // Time-based greeting displayed under time
    const hour = now.getHours(); // Get the current hour (0-23)
    let greeting;
    // Conditional logic to set the greeting based on the hour
    if (hour < 12) {
        greeting = "Good Morning!"; // Before 12 PM
    } else if (hour < 18) {
        greeting = "Good Afternoon!"; // 12 PM to 5:59 PM
    } else {
        greeting = "Good Evening!"; // 6 PM onwards
    }
    // Update the greeting text in the HTML
    document.getElementById("current-greeting").textContent = greeting;
}
// Calls the function every 1000 milliseconds (1 second) to keep the time updated
setInterval(showCurrentTime, 1000);
showCurrentTime(); // Initial call to display immediately on load

// --- Change background color of div ---
// Get the HTML element for the color box
const colorBox = document.getElementById("color-changer");
const colors = ["cyan", "yellow", "red", "green", "pink"]; // Array of colors to cycle through
let colorIndex = 0; // Index to track the current color

// Function to change the box's background color
function changeColor() {
    // Cycles the index to the next color in the array using the modulo operator (%)
    colorIndex = (colorIndex + 1) % colors.length; 
    // Apply the new background color style
    colorBox.style.backgroundColor = colors[colorIndex];
    console.log(`Changed color to ${colors[colorIndex]}`); // Logs the color change to console
}
// Attach the changeColor function to the button's click event
document.getElementById("color-btn").addEventListener("click", changeColor);

// --- Greeting Button ---
// Function that displays an alert to the user
function greetUser() {
    alert(`Hello, ${userName}! Hope you enjoy exploring my portfolio.`); // Personalized alert message
}
// Attach the greetUser function to the button's click event
document.getElementById("greet-btn").addEventListener("click", greetUser);

// --- Skills Array and Display ---
let skills = ["HTML", "CSS", "JavaScript", "Photography", "Electronics"]; // The array holding the user's skills
// Function to dynamically update the list displayed in the HTML
function updateSkillsDisplay() {
    const skillsList = document.getElementById("skills-list"); // Get the <ul> or <ol> element
    skillsList.innerHTML = ""; // Clear displayed list before re-rendering
    // Loop through the skills array and create a new <li> element for each skill
    skills.forEach((skill) => {
        const li = document.createElement("li");
        li.textContent = `${skill}`;
        skillsList.appendChild(li); // Add the new list item to the <ul>
    });
    // Display the total number of skills
    document.getElementById("skills-count").textContent = `Total Skills: ${skills.length}`;
}
// Initial display
updateSkillsDisplay(); // Call once on load to show initial skills

// Add Skill Button functionality
document.getElementById("add-skill-btn").addEventListener("click", function () {
    const newSkillInput = document.getElementById("new-skill"); // Get the text input element
    const newSkill = newSkillInput.value.trim(); // Get the value and remove leading/trailing whitespace
    // Check if the input is not empty
    if (newSkill) {
        skills.push(newSkill); // Add the new skill to the array
        newSkillInput.value = ""; // Clear the input field
        updateSkillsDisplay(); // Re-render the skills list
    }
});

// --- Counting button clicks ---
let clickCount = 0; // Initialize a counter variable
const clickCounterBtn = document.getElementById("click-counter-btn"); // Button element
const clickCountDisplay = document.getElementById("click-count"); // Display element

// Event listener for the counter button
clickCounterBtn.addEventListener("click", () => {
    clickCount++; // Increment the counter
    clickCountDisplay.textContent = `Clicks: ${clickCount}`; // Update the display text
});

// --- Theme Toggle (Light/Dark) ---
const themeToggleBtn = document.getElementById("theme-toggle"); // Button element
themeToggleBtn.textContent = "Toggle Theme"; // Set the button's text

// Function to switch between light and dark themes
function toggleTheme() {
    // Toggles the 'dark-theme' CSS class on the body element
    document.body.classList.toggle("dark-theme"); 
}
themeToggleBtn.addEventListener("click", toggleTheme); // Attach the function to the click event

// --- Even or Odd Checker ---
// Function that determines if a number is Even or Odd using the modulo operator
function isEven(num) {
    return num % 2 === 0 ? "Even" : "Odd"; // Return "Even" if remainder is 0, else "Odd"
}
// Event listener for the Even/Odd check button
document.getElementById("check-even-odd-btn").addEventListener("click", function () {
    const val = document.getElementById("even-odd-input").value; // Get the user input value
    let result = "";
    // Handle empty input
    if (val === "") {
        result = "Please enter a number.";
    } else {
        // Convert input to a number and call the isEven function
        result = isEven(Number(val));
    }
    document.getElementById("even-odd-result").textContent = result; // Display the result
    console.log(isEven(Number(val))); // Logs whether the number is even or odd
});

// --- Age Checker ---
// Function to categorize age groups
function checkAgeCategory(inputAge) {
    if (inputAge < 18) return "Minor"; // Less than 18
    else if (inputAge <= 64) return "Adult"; // 18 up to 64
    else return "Senior"; // 65 and over
}

// Event listener for the Age Check button
document.getElementById("check-age-btn").addEventListener("click", function () {
    const val = document.getElementById("age-input").value; // Get the user input value
    let result = "";
    // Handle empty input
    if (val === "") {
        result = "Please enter your age.";
    } else {
        // Convert input to a number and call the checkAgeCategory function
        result = checkAgeCategory(Number(val));
    }
    document.getElementById("age-result").textContent = result; // Display the result
});
console.log(checkAgeCategory(19)); // Logs "Adult" (using user's age as an example)

// --- Letter grade calculator ---
// Function to convert a numerical score to a letter grade
function getLetterGrade(score) {
    // Chained if statements check against thresholds from highest to lowest
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F"; // Any score below 60
}

// Event listener for the Grade Check button
document.getElementById("check-grade-btn").addEventListener("click", function () {
    const val = document.getElementById("grade-input").value; // Get the user input value
    let result = "";
    // Handle empty input
    if (val === "") {
        result = "Please enter a grade.";
    } else {
        // Convert input to a number, get the grade, and format the output
        result = `Letter Grade: ${getLetterGrade(Number(val))}`;
    }
    document.getElementById("grade-result").textContent = result; // Display the result
});
console.log(getLetterGrade(85)); // Logs "B" as an example

// --- Password Strength Checker ---
// Event listener for the Password Strength Check button
document.getElementById("pw-strength-btn").addEventListener("click", function () {
    const val = document.getElementById("pw-input").value; // Get the user input password
    let result = "";
    // Handle empty input
    if (val === "") {
        result = "Please enter a password.";
    } else {
        // Call the strength function and format the output
        result = `Strength: ${passwordStrength(val)}`;
    }
    document.getElementById("pw-strength-result").textContent = result; // Display the strength result
});

// Function to assess password strength based on criteria
function passwordStrength(pw) {
    let strengthPoints = 0; // Counter for criteria met
    // Checks using regular expressions (regex)
    if (pw.length >= 8) strengthPoints++;   // +1 for length 8+
    if (/[a-z]/.test(pw)) strengthPoints++; // +1 for at least one lowercase letter
    if (/[A-Z]/.test(pw)) strengthPoints++; // +1 for at least one uppercase letter
    if (/\d/.test(pw)) strengthPoints++;    // +1 for at least one number
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) strengthPoints++; // +1 for at least one special character

    // Return strength level based on total points
    if (pw.length < 6) return "Very Weak"; // Special case for very short passwords
    if (strengthPoints <= 2) return "Weak";
    if (strengthPoints === 3) return "Moderate";
    if (strengthPoints === 4) return "Strong";
    if (strengthPoints === 5) return "Very Strong";
}
console.log(passwordStrength("P@ssw0rd!")); // Logs "Very Strong" as an example

// --- Simple Todo List ---
const todoInput = document.getElementById("todo-input"); // Input field element
const todoList = document.getElementById("todo-list"); // <ul> or <ol> list element
const addTodoBtn = document.getElementById("add-todo-btn"); // Button element

// Event listener for the Add Todo button
addTodoBtn.addEventListener("click", function () {
    const todoText = todoInput.value.trim(); // Get the input value and trim it
    // Only proceed if the input is not empty
    if (todoText !== "") {
        const li = document.createElement("li"); // Create a new list item (<li>)
        li.textContent = todoText; // Set the text of the list item
        todoList.appendChild(li); // Add the new item to the list
        todoInput.value = ""; // Clear the input field for the next entry
        console.log(todoText); // Logs the added todo
    }
});