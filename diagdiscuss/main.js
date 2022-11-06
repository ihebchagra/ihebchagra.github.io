// Register the service worker if available.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceworker.js').then(function(reg) {
        console.log('Successfully registered service worker', reg);
    }).catch(function(err) {
        console.warn('Error whilst registering service worker', err);
    });
}

// Check if the user is connected.
if (navigator.onLine) {
    console.log("You are online")
} else {
    // Show offline message
    console.log("You are offline")
}
