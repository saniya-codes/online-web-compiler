function infiniteLoop() {
    while (true) {
        // Infinite loop doing nothing
    }
}

try {
    infiniteLoop();
} catch (error) {
    console.error("Error caught: ", error);
}
