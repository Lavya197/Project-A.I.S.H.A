let cartTotal = 0;
let cartItems = [];
let budget = 0;
let currentStep = 0;
let scanningStarted = false;

const steps = [
    { prompt: "Hi AISHA, I want to do some budget shopping today.", response: "Hello! I'm happy to help you with budget shopping. Could you please tell me your budget for today?" },
    { prompt: "My budget is $100.", response: "Great! I've noted your budget of $100. What items would you like to purchase today?" },
    { prompt: "I need milk, bread, and eggs.", response: "Excellent choices! Based on your budget and shopping list, I recommend the following:\n\n1. Organic Milk - $3.99\n2. Whole Grain Bread - $2.49\n3. Free-Range Eggs - $4.99\n\nThese options are not only within your budget but also on sale today. Would you like to see their locations on the store map?" },
    { prompt: "Yes, please show me the map.", response: "Certainly! I'm displaying the store map now with the quickest route to collect your items. The red dots represent the product locations, and the yellow line shows the most efficient path. Is there anything else you'd like to know?" },
    { prompt: "Any other recommendations to fit my budget?", response: "Absolutely! Since you have some budget left, I'd recommend:\n\n1. Fresh Apples - On sale for $2.99/lb\n2. Whole Grain Pasta - 20% off at $1.79\n\nThese items are nutritious and currently discounted. They're located near your planned route. Would you like me to add them to your map?" },
    { prompt: "Yes, please add them.", response: "I've updated the map with the additional items. Your current expected total is $16.25, well within your $100 budget. As you shop, I'll keep track of scanned items and update your total. Is there anything else you need assistance with?" }
];

document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('aishaVideo');
    
    // Remove the loop attribute
    video.removeAttribute('loop');
    
    // Attempt to play the video
    const playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            console.log("Video playback started successfully");
            
            // Add an event listener for when the video ends
            video.addEventListener('ended', function() {
                console.log("Video playback ended");
                // Optionally, you can hide the video or show a placeholder image here
                // video.style.display = 'none';
                // or
                // video.poster = 'path_to_placeholder_image.jpg';
            });

        }).catch(error => {
            console.log("Video playback was prevented:", error);
            
            const playButton = document.createElement('button');
            playButton.innerHTML = 'Play Video';
            playButton.className = 'video-play-button';
            video.parentNode.insertBefore(playButton, video.nextSibling);

            playButton.addEventListener('click', () => {
                video.play();
                playButton.style.display = 'none';
            });
        });
    }
});

function unmuteAisha() {
    const video = document.getElementById('aishaVideo');
    video.muted = false;
}

function activateVoice() {
    unmuteAisha();
    if (currentStep < steps.length) {
        simulateConversation();
    } else {
        alert("Shopping session completed. You can review your cart, map, and proceed to checkout.");
    }
}

function simulateConversation() {
    const infoPanel = document.getElementById('infoPanel');
    const voiceIndicator = document.getElementById('voiceIndicator');
    
    voiceIndicator.style.display = 'block';
    voiceIndicator.classList.add('listening-animation');
    
    setTimeout(() => {
        voiceIndicator.style.display = 'none';
        voiceIndicator.classList.remove('listening-animation');
        
        const userPrompt = document.createElement('div');
        userPrompt.className = 'prompt';
        userPrompt.innerHTML = '<strong>You:</strong> ';
        infoPanel.appendChild(userPrompt);
        
        typeWriter(steps[currentStep].prompt, userPrompt, () => {
            setTimeout(aishaResponse, 1000);
        });
    }, 2000);
}

function aishaResponse() {
    const infoPanel = document.getElementById('infoPanel');
    const aishaReply = document.createElement('div');
    aishaReply.className = 'prompt';
    aishaReply.innerHTML = '<strong>AISHA:</strong> ';
    infoPanel.appendChild(aishaReply);
    
    typeWriter(steps[currentStep].response, aishaReply, () => {
        if (currentStep === 1) {
            budget = 100;
        } else if (currentStep === 3) {
            togglePanel('mapPanel');
            if (!scanningStarted) {
                simulateScanning();
                scanningStarted = true;
            }
        }
        
        currentStep++;
        infoPanel.scrollTop = infoPanel.scrollHeight;
    });
}

function typeWriter(text, element, callback) {
    let i = 0;
    const write = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(write, 50);
        } else {
            callback();
        }
    };
    write();
}

function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function simulateScanning() {
    const products = [
        {name: 'Organic Milk', price: 3.99, eco: true},
        {name: 'Whole Grain Bread', price: 2.49, eco: true},
        {name: 'Free-Range Eggs', price: 4.99, eco: true},
        {name: 'Fresh Apples', price: 2.99, eco: true},
        {name: 'Whole Grain Pasta', price: 1.79, eco: false}
    ];
    let index = 0;

    const scanInterval = setInterval(() => {
        if (index < products.length) {
            const item = products[index];
            addToCart(item);
            showScannedItem(item);
            index++;
        } else {
            clearInterval(scanInterval);
        }
    }, 10000); // Scan a new item every 10 seconds
}

function addToCart(item) {
    cartItems.push(item);
    cartTotal += item.price;
    updateCartDisplay();
    document.getElementById('cartTotal').textContent = `Total: $${cartTotal.toFixed(2)}`;
}

function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cartItems');
    cartItemsElement.innerHTML = '';
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            ${item.eco ? '<span style="color: #00ff00;">Eco</span>' : ''}
        `;
        cartItemsElement.appendChild(itemElement);
    });
}

function showScannedItem(item) {
    const scannedItems = document.getElementById('scannedItems');
    scannedItems.textContent = `Scanned: ${item.name} - $${item.price.toFixed(2)}`;
    scannedItems.style.opacity = '1';
    setTimeout(() => {
        scannedItems.style.opacity = '0';
    }, 3000);
}

function proceedToCheckout() {
    const checkoutPanel = document.getElementById('checkoutPanel');
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');

    checkoutItems.innerHTML = '';
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)} ${item.eco ? '<span style="color: #00ff00;">Eco</span>' : ''}</span>
        `;
        checkoutItems.appendChild(itemElement);
    });

    checkoutTotal.textContent = `Total: $${cartTotal.toFixed(2)}`;
    togglePanel('checkoutPanel');
}

function completeCheckout() {
    const ecoItems = cartItems.filter(item => item.eco).length;
    const ecoRewards = ecoItems * 10; // 10 points per eco-friendly item
    const checkoutPanel = document.getElementById('checkoutPanel');

    setTimeout(() => {
        checkoutPanel.innerHTML = `
            <h2>Checkout Complete</h2>
            <p>Total amount paid: $${cartTotal.toFixed(2)}</p>
            <p>Payment method: UMC card</p>
            <p>Name: Arav Sharma</p>
            <p>Eco-friendly bonus rewards: ${ecoRewards} points</p>
            <button class="button" onclick="resetShopping()">Start New Shopping Session</button>
        `;
    }, 5000);
}

function resetShopping() {
    cartTotal = 0;
    cartItems = [];
    currentStep = 0;
    scanningStarted = false;
    document.getElementById('cartTotal').textContent = 'Total: $0.00';
    document.getElementById('infoPanel').innerHTML = '';
    document.getElementById('cartItems').innerHTML = '';
    togglePanel('checkoutPanel');
    alert("New shopping session started. Ask AISHA for assistance!");
}