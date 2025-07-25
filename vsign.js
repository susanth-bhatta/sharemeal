const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

// Toggle between forms
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Role Selection Functionality
const roleButtons = document.querySelectorAll(".role-btn");
const userRoleInput = document.getElementById("user-role");

roleButtons.forEach(button => {
  button.addEventListener("click", () => {
    roleButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    userRoleInput.value = button.dataset.role;
  });
});

// Initialize data structures when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize users array if not exists
  if (!localStorage.getItem('donationUsers')) {
    localStorage.setItem('donationUsers', JSON.stringify([]));
  }
  
  // Initialize food donations if not exists
  if (!localStorage.getItem('foodDonations')) {
    localStorage.setItem('foodDonations', JSON.stringify([]));
  }
  
  // Initialize food requests if not exists
  if (!localStorage.getItem('foodRequests')) {
    localStorage.setItem('foodRequests', JSON.stringify([]));
  }
});

// Sign Up Functionality
document.querySelector(".sign-up-form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;
  const role = userRoleInput.value;

  // Validation
  if (!username || !email || !password || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  // Check if user exists
  const users = JSON.parse(localStorage.getItem("donationUsers")) || [];
  const userExists = users.some(user => user.email === email || user.username === username);
  
  if (userExists) {
    alert("User already exists with this email/username");
    return;
  }

  // Store new user with role
  const newUser = { 
    username, 
    email, 
    password, 
    role,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem("donationUsers", JSON.stringify(users));
  localStorage.setItem("currentDonationUser", JSON.stringify(newUser));
  
  // Redirect based on role
  if (role === 'ngo') {
    alert("NGO account created successfully!");
    window.location.href = "ngo-dashboard.html";
  } else {
    alert("Account created successfully! Please set your location.");
    window.location.href = "location.html";
  }
});

// Sign In Functionality
document.querySelector(".sign-in-form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("signin-password").value;

  // Validation
  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }

  // Check credentials
  const users = JSON.parse(localStorage.getItem("donationUsers")) || [];
  const user = users.find(user => 
    user.email === email && 
    user.password === password
  );

  if (user) {
    localStorage.setItem("currentDonationUser", JSON.stringify(user));
    
    // Check if user has location set (not required for NGOs)
    if (user.role !== 'ngo') {
      const userLocation = JSON.parse(localStorage.getItem(`userLocation_${user.username}`));
      
      if (!userLocation) {
        alert("Please set your location first");
        window.location.href = "location.html";
        return;
      }
    }
    
    redirectBasedOnRole(user.role);
  } else {
    alert("Invalid credentials");
  }
});

// Single, unified redirect function for all roles
function redirectBasedOnRole(role) {
  if (role === 'donor') {
    window.location.href = 'donor.html';
  } else if (role === 'receiver') {
    window.location.href = 'receiver.html';
  } else if (role === 'ngo') {
    window.location.href = 'ngo-dashboard.html';
  }
}

// Helper function to calculate distance between coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
