let clickCount = 0;
let clickPower = 1;
let hasClicked = false;
let manualClickCount = 0;
let shopItemCost = 30;
let shopItemVisible = false;
let shopItem2Cost = 150;
let shopItem2Visible = false;
let shopItem3Cost = 5000;
let shopItem3Visible = false;
let shopItem1Quantity = 0;
let shopItem2Quantity = 0;
let shopItem3Quantity = 0;
let messagesVisible = false;
let messageCount = 0;
let gameWon = false;

// Buzz functionality variables
let buzzActive = false;
let buzzTimer = null;
let buzzIntensity = 0;
let buzzStartTime = 0;
let buzzCycleActive = false; // Tracks if the buzz cycle is running (including breaks)

// Timer functionality variables
let gameTimer = null;
let gameStartTime = 0;
let gameElapsedTime = 0;

// Message system configuration
const MESSAGES = [
  { threshold: 1500, text: "You're doing great...", shown: false },
  { threshold: 3000, text: "Wow, you're pretty amazing at clicking.", shown: false },
  { threshold: 5200, text: "How high do you plan on going?", shown: false },
  { threshold: 9800, text: "Here, let me give you another shop item.", shown: false },
  { threshold: 20200, text: "You're getting to a pretty high number up there.", shown: false },
  { threshold: 31600, text: "Do you think this game is going anywhere?", shown: false },
  { threshold: 49600, text: "Building up to some grand climax?", shown: false },
  { threshold: 61600, text: "Do you want to guess how many times you've clicked the button?", shown: false },
  { threshold: 70000, text: "You've clicked the button", shown: false, dynamic: true },
  { threshold: 85000, text: "That's a lot of button clicks.", shown: false },
  { threshold: 100000, text: "Surprise! This game is actually unfinished.", shown: false },
  { threshold: 120000, text: "Seriously, nothing more is going to happen.", shown: false },
  { threshold: 150000, text: "Check the code if you don't believe me.", shown: false },
  { threshold: 180000, text: "Okay, this is actually the last message. I'll write more soon.", shown: false }
];

// Debug flag - set to true to enable debug window
const DEBUG_MODE = true;

const counter = document.getElementById('counter');
const clickButton = document.getElementById('clickButton');
const shop = document.getElementById('shop');
const shopItem = document.getElementById('shopItem1');
const buyButton = document.getElementById('buyButton1');
const shopItem2 = document.getElementById('shopItem2');
const buyButton2 = document.getElementById('buyButton2');
const shopItem1Desc = document.getElementById('shopItem1Desc');
const shopItem2Desc = document.getElementById('shopItem2Desc');
const shopItem3 = document.getElementById('shopItem3');
const buyButton3 = document.getElementById('buyButton3');
const shopItem3Desc = document.getElementById('shopItem3Desc');
const messages = document.getElementById('messages');
const messagesContainer = document.getElementById('messagesContainer');
const debugWindow = document.getElementById('debugWindow');
const debugCount = document.getElementById('debugCount');
const debugClickPower = document.getElementById('debugClickPower');
const debugInfo = document.getElementById('debugInfo');
const debugSave = document.getElementById('debugSave');
const debugButton1 = document.getElementById('debugButton1');
const debugButton2 = document.getElementById('debugButton2');
const debugButton3 = document.getElementById('debugButton3');
const debugButton4 = document.getElementById('debugButton4');
const debugButton5 = document.getElementById('debugButton5');
const timerDisplay = document.getElementById('timerDisplay');
const timerReset = document.getElementById('timerReset');
const fireworks = document.getElementById('fireworks');
const winScreen = document.getElementById('winScreen');
const winClickCount = document.getElementById('winClickCount');

// Initialize debug window based on flag
if (DEBUG_MODE) {
  debugWindow.style.display = 'block';
  // Initialize debug display values
  updateDebugDisplay();
}

// Function to update debug display values
function updateDebugDisplay() {
  debugInfo.textContent = `Clicks: ${manualClickCount.toLocaleString()}, CP: ${clickPower.toLocaleString()}`;
}

// Timer functionality
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimer() {
  if (gameStartTime > 0) {
    const currentTime = Date.now();
    gameElapsedTime = Math.floor((currentTime - gameStartTime) / 1000);
    timerDisplay.textContent = formatTime(gameElapsedTime);
  }
}

function startGameTimer() {
  if (gameStartTime === 0) {
    gameStartTime = Date.now();
    gameTimer = setInterval(updateTimer, 1000);
  }
}

function resetGameTimer() {
  // Clear existing timer
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
  
  // Reset values
  gameStartTime = Date.now();
  gameElapsedTime = 0;
  timerDisplay.textContent = '00:00:00';
  
  // Start timer again
  gameTimer = setInterval(updateTimer, 1000);
}

// Function to handle debug save logic
function handleDebugSave() {
  const newCount = parseInt(debugCount.value);
  const newClickPower = parseInt(debugClickPower.value);
  
  if (!isNaN(newCount)) {
    clickCount = newCount;
    counter.textContent = clickCount.toLocaleString();
    debugCount.value = '';
    
    // Trigger all events that would happen with this click count
    // First click - show counter
    if (!hasClicked) {
      hasClicked = true;
      counter.style.display = 'block';
    }

    // Update button text at 15 clicks
    if (clickCount >= 15) {
      clickButton.textContent = 'Keep Clicking';
    }

    // Show shop at 30 clicks
    if (clickCount >= 30 && !shop.style.display) {
      shop.style.display = 'block';
    }

    // Show shop item when it can be afforded for the first time
    if (clickCount >= shopItemCost && !shopItemVisible) {
      shopItemVisible = true;
      shopItem.style.display = 'flex';
    }

    // Show shop item 2 when it can be afforded for the first time
    if (clickCount >= shopItem2Cost && !shopItem2Visible) {
      shopItem2Visible = true;
      shopItem2.style.display = 'flex';
    }
    
    if (clickCount >= 9800 && !shopItem3Visible) {
      shopItem3Visible = true;
      shopItem3.style.display = 'flex';
    }

    // Check for new messages to show
    checkMessages();

    // Check for win condition
    if (clickCount >= 200000 && !gameWon) {
      gameWon = true;
      triggerWinScreen();
    }

    // Update shop item affordability
    updateShopItemAffordability();
  }
  
  if (!isNaN(newClickPower)) {
    clickPower = newClickPower;
    debugClickPower.value = '';
  }
  
  // Update debug display
  updateDebugDisplay();
}

// Debug save functionality
debugSave.addEventListener('click', handleDebugSave);

// Add Enter key functionality to input fields
debugCount.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    handleDebugSave();
  }
});

debugClickPower.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    handleDebugSave();
  }
});

// Timer reset button event listener
timerReset.addEventListener('click', resetGameTimer);

// Function to update debug button visibility
function updateDebugButtonVisibility() {
  const dropdowns = document.querySelectorAll('.debug-dropdown');
  const buttons = [debugButton1, debugButton2, debugButton3, debugButton4, debugButton5];
  
  dropdowns.forEach((dropdown, index) => {
    const value = dropdown.value;
    const button = buttons[index];
    
    if (value === 'hidden') {
      button.style.visibility = 'hidden';
      // For buzz button (index 0), stop the buzz cycle completely
      if (index === 0) {
        stopBuzzCycle();
      }
    } else if (value === 'shown') {
      button.style.visibility = 'visible';
      // For buzz button (index 0), stop the buzz cycle completely and keep it stopped
      if (index === 0) {
        stopBuzzCycle();
      }
    } else if (value === 'shown-active') {
      button.style.visibility = 'visible';
      // For buzz button (index 0), start the buzz cycle (same as clicking buzz)
      if (index === 0) {
        if (!buzzCycleActive) {
          startBuzz();
        }
      }
    }
  });
}

// Add event listeners to all debug dropdowns
document.querySelectorAll('.debug-dropdown').forEach(dropdown => {
  dropdown.addEventListener('change', updateDebugButtonVisibility);
});

// Buzz functionality
function startBuzz() {
  if (buzzActive) return;
  
  buzzActive = true;
  buzzCycleActive = true; // Mark cycle as active
  buzzStartTime = Date.now();
  buzzIntensity = 0;
  
  // Update button text
  debugButton1.textContent = 'de-buzz';
  
  // Start jiggling
  clickButton.classList.add('buzzing');
  
  // Start intensity timer
  buzzTimer = setInterval(updateBuzzIntensity, 100);
}

function stopBuzz() {
  if (!buzzActive) return;
  
  buzzActive = false;
  buzzIntensity = 0;
  
  // Update button text
  debugButton1.textContent = 'buzz';
  
  // Stop jiggling
  clickButton.classList.remove('buzzing');
  
  // Clear timer
  if (buzzTimer) {
    clearInterval(buzzTimer);
    buzzTimer = null;
  }
  
  // Reset CSS custom properties
  clickButton.style.setProperty('--jiggle-x', '2px');
  clickButton.style.setProperty('--jiggle-x-neg', '-2px');
  clickButton.style.setProperty('--jiggle-y', '2px');
  clickButton.style.setProperty('--jiggle-y-neg', '-2px');
}

function stopBuzzCycle() {
  // Stop the entire cycle (both buzzing and any pending timers)
  buzzCycleActive = false;
  stopBuzz();
  
  // Clear any pending reset timer
  if (buzzTimer) {
    clearInterval(buzzTimer);
    buzzTimer = null;
  }
}

function updateBuzzIntensity() {
  if (!buzzActive) return;
  
  const elapsed = Date.now() - buzzStartTime;
  const progress = Math.min(elapsed / 60000, 1); // 60 seconds max
  
  // Calculate intensity (0 to 1)
  buzzIntensity = progress;
  
  // Calculate jiggle distance (2px to 20px, making it much harder to click)
  const baseJiggle = 2;
  const maxJiggle = 20;
  const jiggleDistance = baseJiggle + (buzzIntensity * (maxJiggle - baseJiggle));
  
  // Apply jiggle distances to the button via CSS custom properties
  clickButton.style.setProperty('--jiggle-x', `${jiggleDistance}px`);
  clickButton.style.setProperty('--jiggle-x-neg', `-${jiggleDistance}px`);
  clickButton.style.setProperty('--jiggle-y', `${jiggleDistance}px`);
  clickButton.style.setProperty('--jiggle-y-neg', `-${jiggleDistance}px`);
}

function resetBuzzTimer() {
  stopBuzz();
  
  // Wait 30 seconds then start buzzing again (only if cycle is still active)
  setTimeout(() => {
    if (buzzCycleActive && buzzActive === false) { // Only start if cycle is active and not currently buzzing
      startBuzz();
    }
  }, 30000);
}

// Buzz button click handler
debugButton1.addEventListener('click', function() {
  if (buzzActive) {
    // Currently buzzing, so reset timer
    resetBuzzTimer();
  } else {
    // Not buzzing, so start buzzing
    startBuzz();
    // Update dropdown to show cycle is active (only if not already set)
    const buzzDropdown = document.querySelectorAll('.debug-dropdown')[0];
    if (buzzDropdown && buzzDropdown.value !== 'shown-active') {
      buzzDropdown.value = 'shown-active';
    }
  }
});

clickButton.addEventListener('click', function() {
  // Track manual clicks
  manualClickCount++;
  
  // First click - show counter and start timer
  if (!hasClicked) {
    hasClicked = true;
    counter.style.display = 'block';
    startGameTimer();
  }

  // Increase click count
  clickCount += clickPower;
  counter.textContent = clickCount.toLocaleString();

  // Update button text at 15 clicks
  if (clickCount >= 15) {
    clickButton.textContent = 'Keep Clicking';
  }

  // Show shop at 30 clicks
  if (clickCount >= 30 && !shop.style.display) {
    shop.style.display = 'block';
  }

  // Show shop item when it can be afforded for the first time
  if (clickCount >= shopItemCost && !shopItemVisible) {
    shopItemVisible = true;
    shopItem.style.display = 'flex';
  }

  // Show shop item 2 when it can be afforded for the first time
  if (clickCount >= shopItem2Cost && !shopItem2Visible) {
    shopItem2Visible = true;
    shopItem2.style.display = 'flex';
  }
  
  if (clickCount >= 9800 && !shopItem3Visible) {
    shopItem3Visible = true;
    shopItem3.style.display = 'flex';
  }

  // Check for new messages to show
  checkMessages();

  // Check for win condition
  if (clickCount >= 200000 && !gameWon) {
    gameWon = true;
    triggerWinScreen();
  }

  // Update shop item affordability
  updateShopItemAffordability();
  
  // Update debug display
  updateDebugDisplay();
});

buyButton.addEventListener('click', function() {
  if (clickCount >= shopItemCost && shopItem1Quantity < 10) {
    // Deduct cost from click count
    clickCount -= shopItemCost;
    counter.textContent = clickCount.toLocaleString();

    // Increase click power
    clickPower += 2;

    // Increase quantity
    shopItem1Quantity++;
    if (shopItem1Quantity >= 10) {
      shopItem1Desc.textContent = `+2 per click (qty: 10 MAX)`;
    } else {
      shopItem1Desc.textContent = `+2 per click (qty: ${shopItem1Quantity})`;
    }

    // Increase cost by 1.1x and round to nearest integer
    shopItemCost = Math.round(shopItemCost * 1.1);
    buyButton.textContent = shopItemCost;

    // Update affordability
    updateShopItemAffordability();
    
    // Update debug display
    updateDebugDisplay();
  }
});

buyButton2.addEventListener('click', function() {
  if (clickCount >= shopItem2Cost && shopItem2Quantity < 10) {
    // Deduct cost from click count
    clickCount -= shopItem2Cost;
    counter.textContent = clickCount.toLocaleString();

    // Increase click power
    clickPower += 4;

    // Increase quantity
    shopItem2Quantity++;
    if (shopItem2Quantity >= 10) {
      shopItem2Desc.textContent = `+4 per click (qty: 10 MAX)`;
    } else {
      shopItem2Desc.textContent = `+4 per click (qty: ${shopItem2Quantity})`;
    }

    // Increase cost by 1.1x and round to nearest integer
    shopItem2Cost = Math.round(shopItem2Cost * 1.1);
    buyButton2.textContent = shopItem2Cost;

    // Update affordability
    updateShopItemAffordability();
    
    // Update debug display
    updateDebugDisplay();
  }
});

buyButton3.addEventListener('click', function() {
  if (clickCount >= shopItem3Cost && shopItem3Quantity < 10) {
    // Deduct cost from click count
    clickCount -= shopItem3Cost;
    counter.textContent = clickCount.toLocaleString();

    // Increase click power
    clickPower += 10;

    // Increase quantity
    shopItem3Quantity++;
    if (shopItem3Quantity >= 10) {
      shopItem3Desc.textContent = `+10 per click (qty: 10 MAX)`;
    } else {
      shopItem3Desc.textContent = `+10 per click (qty: ${shopItem3Quantity})`;
    }

    // Increase cost by 1.1x and round to nearest integer
    shopItem3Cost = Math.round(shopItem3Cost * 1.1);
    buyButton3.textContent = shopItem3Cost;

    // Update affordability
    updateShopItemAffordability();
    
    // Update debug display
    updateDebugDisplay();
  }
});

function updateShopItemAffordability() {
  if (shopItemVisible) {
    if (clickCount >= shopItemCost && shopItem1Quantity < 10) {
      shopItem.className = 'shop-item affordable';
    } else {
      shopItem.className = 'shop-item unaffordable';
    }
  }
  
  if (shopItem2Visible) {
    if (clickCount >= shopItem2Cost && shopItem2Quantity < 10) {
      shopItem2.className = 'shop-item affordable';
    } else {
      shopItem2.className = 'shop-item unaffordable';
    }
  }
  
  if (shopItem3Visible) {
    if (clickCount >= shopItem3Cost && shopItem3Quantity < 10) {
      shopItem3.className = 'shop-item affordable';
    } else {
      shopItem3.className = 'shop-item unaffordable';
    }
  }
}

function checkMessages() {
  // Show messages window if any message threshold is reached
  const hasReachedAnyThreshold = MESSAGES.some(msg => clickCount >= msg.threshold);
  if (hasReachedAnyThreshold && !messagesVisible) {
    messagesVisible = true;
    messages.style.display = 'block';
  }
  
  // Check each message and show if threshold reached and not shown yet
  MESSAGES.forEach(message => {
    if (clickCount >= message.threshold && !message.shown) {
      message.shown = true;
      let messageText = message.text;
      
      // Handle dynamic messages that need real-time values
      if (message.dynamic && message.threshold === 70000) {
        messageText = `You've clicked the button ${manualClickCount.toLocaleString()} times`;
      }
      
      typeMessage(messageText);
    }
  });
}

function typeMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  
  // Insert new message at the top (after the header)
  messagesContainer.insertBefore(messageDiv, messagesContainer.firstChild);
  messageCount++;
  
  // Remove oldest message if we have more than 10
  if (messageCount > 10) {
    const lastMessage = messagesContainer.lastChild;
    if (lastMessage && lastMessage.className === 'message') {
      messagesContainer.removeChild(lastMessage);
      messageCount--;
    }
  }
  
  // Force a layout update and then scroll to top to show new message
  setTimeout(() => {
    messagesContainer.scrollTop = 0;
  }, 0);
  
  let index = 0;
  const fullText = `> ${text}`;
  
  function typeChar() {
    if (index < fullText.length) {
      messageDiv.textContent += fullText.charAt(index);
      index++;
      setTimeout(typeChar, 50); // 50ms delay between characters
    }
  }
  
  typeChar();
}

function triggerWinScreen() {
  // Hide all game elements
  document.body.style.overflow = 'hidden';
  
  // Update the click count display
  winClickCount.textContent = `You've clicked the button ${manualClickCount.toLocaleString()} times`;
  
  // Start fireworks animation
  startFireworks();
  
  // Show win screen after a short delay
  setTimeout(() => {
    winScreen.style.display = 'flex';
  }, 500);
}

function startFireworks() {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a8e6cf', '#ffd3a5'];
  
  function createFirework() {
    const firework = document.createElement('div');
    firework.className = 'firework';
    
    // Random position
    firework.style.left = Math.random() * 100 + '%';
    firework.style.top = Math.random() * 100 + '%';
    
    // Random color
    firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    fireworks.appendChild(firework);
    
    // Remove after animation
    setTimeout(() => {
      if (firework.parentNode) {
        firework.parentNode.removeChild(firework);
      }
    }, 1000);
  }
  
  // Create fireworks continuously for 10 seconds
  const fireworkInterval = setInterval(createFirework, 100);
  
  setTimeout(() => {
    clearInterval(fireworkInterval);
  }, 10000);
}
