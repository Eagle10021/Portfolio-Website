// === JavaScript Setup & Variables ===
const userName = "Arshdeep";
const age = 19;
const favLang = "JavaScript";

// Log variables and explain
console.log("User's Name:", userName); // Name of the user
console.log("User's Age:", age);       // Age of the user
console.log("Favorite Language:", favLang); // Favorite programming language

// Student object
const student = {
    name: userName,
    major: "Computer Engineering Technology - Computing Science",
    gradYear: 2027,
    hobbies: ["Technology tinkering", "Gaming", "Biking", "Automotive Enthusiasm"]
};
console.log("Student object:", student);

// === DOM Manipulation - Welcome message and current time ===
const welcomeMessageDiv = document.getElementById("welcome-message");
welcomeMessageDiv.textContent = `Welcome to my Interactive Portfolio, ${userName}!`;

// === Conditional Greetings based on time ===
function showCurrentTime() {
    const now = new Date();
    document.getElementById("current-time").textContent = `Current Date & Time: ${now.toLocaleString()}`;
    
    // Time-based greeting displayed under time
    const hour = now.getHours();
    let greeting;
    if (hour < 12) {
        greeting = "Good Morning!";
    } else if (hour < 18) {
        greeting = "Good Afternoon!";
    } else {
        greeting = "Good Evening!";
    }
    document.getElementById("current-greeting").textContent = greeting;
}
setInterval(showCurrentTime, 1000);
showCurrentTime();



// === Change background color of div ===
const colorBox = document.getElementById("color-changer");
const colors = ["cyan", "yellow", "red", "green", "pink"];
let colorIndex = 0;

function changeColor() {
    colorIndex = (colorIndex + 1) % colors.length;
    colorBox.style.backgroundColor = colors[colorIndex];
    console.log(`Changed color to ${colors[colorIndex]}`); // Logs the color change
}

document.getElementById("color-btn").addEventListener("click", changeColor);

// === Greeting Button ===
function greetUser() {
    alert(`Hello, ${userName}! Hope you enjoy exploring my portfolio.`);
}

document.getElementById("greet-btn").addEventListener("click", greetUser);



// --- Skills Array ---
let skills = ["HTML", "CSS", "JavaScript", "Photography", "Electronics"];

function updateSkillsDisplay() {
    const skillsList = document.getElementById("skills-list");
    skillsList.innerHTML = ""; // Clear displayed list
    skills.forEach((skill, idx) => {
        const li = document.createElement("li");
        li.textContent = `${skill}`;
        skillsList.appendChild(li);
    });
    document.getElementById("skills-count").textContent = `Total Skills: ${skills.length}`;
}
// Initial display
updateSkillsDisplay();

// Add Skill Button functionality
document.getElementById("add-skill-btn").addEventListener("click", function () {
    const newSkillInput = document.getElementById("new-skill");
    const newSkill = newSkillInput.value.trim();
    if (newSkill) {
        skills.push(newSkill);
        newSkillInput.value = "";
        updateSkillsDisplay();
    }
});


// === Counting button clicks ===
let clickCount = 0;
const clickCounterBtn = document.getElementById("click-counter-btn");
const clickCountDisplay = document.getElementById("click-count");

clickCounterBtn.addEventListener("click", () => {
    clickCount++;
    clickCountDisplay.textContent = `Clicks: ${clickCount}`;
});



// === Theme Toggle (Light/Dark) ===
const themeToggleBtn = document.getElementById("theme-toggle");
themeToggleBtn.textContent = "Toggle Theme";

function toggleTheme() {
    document.body.classList.toggle("dark-theme");
}
themeToggleBtn.addEventListener("click", toggleTheme);


// === Even or Odd Checker ===
function isEven(num) {
    return num % 2 === 0 ? "Even" : "Odd"; // Return "Even" if divisible by 2, else "Odd"
}
document.getElementById("check-even-odd-btn").addEventListener("click", function () {
    const val = document.getElementById("even-odd-input").value;
    let result = "";
    if (val === "") {
        result = "Please enter a number.";
    } else {
        result = isEven(Number(val));
    }
    document.getElementById("even-odd-result").textContent = result;
    console.log(isEven(Number(val))); // Logs whether the number is even or odd
});

// ===  Age Checker ===
function checkAgeCategory(inputAge) {
    if (inputAge < 18) return "Minor";
    else if (inputAge <= 64) return "Adult";
    else return "Senior";
}

document.getElementById("check-age-btn").addEventListener("click", function () {
    const val = document.getElementById("age-input").value;
    let result = "";
    if (val === "") {
        result = "Please enter your age.";
    } else {
        result = checkAgeCategory(Number(val));
    }
    document.getElementById("age-result").textContent = result;
});
console.log(checkAgeCategory(19)); // Logs "Adult"

// === Letter grade calculator ===
function getLetterGrade(score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
}

document.getElementById("check-grade-btn").addEventListener("click", function () {
    const val = document.getElementById("grade-input").value;
    let result = "";
    if (val === "") {
        result = "Please enter a grade.";
    } else {
        result = `Letter Grade: ${getLetterGrade(Number(val))}`;
    }
    document.getElementById("grade-result").textContent = result;
});
console.log(getLetterGrade(85)); // Logs "B"



// === Password Strength Checker ===
document.getElementById("pw-strength-btn").addEventListener("click", function () {
    const val = document.getElementById("pw-input").value;
    let result = "";
    if (val === "") {
        result = "Please enter a password.";
    } else {
        result = `Strength: ${passwordStrength(val)}`;
    }
    document.getElementById("pw-strength-result").textContent = result;
});
function passwordStrength(pw) {
    let strengthPoints = 0;
    if (pw.length >= 8) strengthPoints++; // +1 for length 8+
    if (/[a-z]/.test(pw)) strengthPoints++; // +1 for lowercase
    if (/[A-Z]/.test(pw)) strengthPoints++; // +1 for uppercase
    if (/\d/.test(pw)) strengthPoints++;    // +1 for numbers
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) strengthPoints++; // +1 for special character

    if (pw.length < 6) return "Very Weak";
    if (strengthPoints <= 2) return "Weak";
    if (strengthPoints === 3) return "Moderate";
    if (strengthPoints === 4) return "Strong";
    if (strengthPoints === 5) return "Very Strong";
}
console.log(passwordStrength("P@ssw0rd!")); // Logs "Very Strong"


// === Simple Todo List ===
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const addTodoBtn = document.getElementById("add-todo-btn");

addTodoBtn.addEventListener("click", function () {
    const todoText = todoInput.value.trim();
    if (todoText !== "") {
        const li = document.createElement("li");
        li.textContent = todoText;
        todoList.appendChild(li);
        todoInput.value = "";
        console.log(todoText); // Logs the added todo
    }
});
