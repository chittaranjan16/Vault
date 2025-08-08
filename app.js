// Configuration - CUSTOMIZE THESE VALUES
const HASHED_PIN = "$2a$10$N9qo8uLOickgx2ZMRZoMye.Iy.bDOTXgJw9VyxOJTcbxN82kp8.L6"; // bcrypt hash of "123456"
const ENCRYPTED_DRIVE_LINK = "aHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC9ZT1VSX0ZJTEVfSUQvdmlldz91c3A9c2hhcmluZw==";
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes

// Application State
let isAuthenticated = false;
let pin = "";
let isLoading = false;
let attemptCount = 0;
let isLocked = false;
let showError = false;
let errorMessage = "";

// DOM Elements
let pinInput, unlockButton, errorDiv, attemptCounter, appContainer;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  appContainer = document.getElementById('app');
  render();
  checkLockoutStatus();
});

function checkLockoutStatus() {
  const lockoutTime = localStorage.getItem('vaultLockoutTime');
  if (lockoutTime) {
    const lockTime = parseInt(lockoutTime);
    const now = Date.now();
    if (now - lockTime < LOCKOUT_TIME) {
      isLocked = true;
      attemptCount = MAX_ATTEMPTS;
      const remainingTime = Math.ceil((LOCKOUT_TIME - (now - lockTime)) / 1000 / 60);
      showErrorMessage(`Access locked. Try again in ${remainingTime} minutes.`);
    } else {
      localStorage.removeItem('vaultLockoutTime');
