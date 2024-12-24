// Function to scroll to top
function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/Hide "Back to Top" button based on scroll position
window.onscroll = function () {
	const backToTopButton = document.querySelector('.back-to-top');
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		backToTopButton.style.display = "block";
	} else {
		backToTopButton.style.display = "none";
	}
};

window.onload = function () {
    const totalShapes = 50; // Number of shapes
    const shapes = [];
    const container = document.getElementById('shapes-container');

    // Helper function to create a random value within a range
    const randomValue = (min, max) => Math.random() * (max - min) + min;

    // Create shapes and set their initial properties
    for (let i = 0; i < totalShapes; i++) {
        const shape = document.createElement('div');
        shape.classList.add('shape');

        // Set random initial position
        const initialX = randomValue(0, window.innerWidth);
        const initialY = randomValue(0, window.innerHeight);
        shape.style.left = `${initialX}px`;
        shape.style.top = `${initialY}px`;

        // Append to container and store properties
        container.appendChild(shape);
        shapes.push({
            element: shape,
            x: initialX,
            y: initialY,
            dx: randomValue(-1, 1), // Random horizontal speed
            dy: randomValue(-1, 1), // Random vertical speed
        });
    }

    // Update positions for all shapes
    function animate() {
        shapes.forEach((shape) => {
            // Update position
            shape.x += shape.dx;
            shape.y += shape.dy;

            // Bounce off edges
            if (shape.x < 0 || shape.x > window.innerWidth) shape.dx *= -1;
            if (shape.y < 0 || shape.y > window.innerHeight) shape.dy *= -1;

            // Apply updated position
            shape.element.style.left = `${shape.x}px`;
            shape.element.style.top = `${shape.y}px`;
        });

        // Continue the animation
        requestAnimationFrame(animate);
    }

    // Start the animation loop
    animate();
};
