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
const debugSave = document.getElementById('debugSave');
const fireworks = document.getElementById('fireworks');
const winScreen = document.getElementById('winScreen');
const winClickCount = document.getElementById('winClickCount');

// Initialize debug window based on flag
if (DEBUG_MODE) {
  debugWindow.style.display = 'block';
}

// Debug save functionality
debugSave.addEventListener('click', function() {
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
});

clickButton.addEventListener('click', function() {
  // Track manual clicks
  manualClickCount++;
  
  // First click - show counter
  if (!hasClicked) {
    hasClicked = true;
    counter.style.display = 'block';
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
