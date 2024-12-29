document.addEventListener("scroll", () => {
	const floatingElements = document.querySelectorAll(".floating-elements div");
	floatingElements.forEach((el, index) => {
		const currentTransform = window.getComputedStyle(el).transform;
		const matrix = currentTransform !== "none" ? currentTransform.match(/matrix.*\((.+)\)/)[1].split(", ") : null;
		const rotation = matrix ? Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI) : 0; // Get current rotation in degrees
		el.style.transform = `translateY(${window.scrollY * (0.2 + index * 0.05)}px) rotate(${rotation}deg)`;
	});
});

document.getElementById('contact-form').addEventListener('submit', function (event) {
	event.preventDefault();  // Prevent the form from submitting the traditional way

	// Get form data
	const name = document.getElementById('name').value.trim();
	const email = document.getElementById('email').value.trim();
	const message = document.getElementById('message').value.trim();

	// Simple form validation
	if (name === "" || email === "" || message === "") {
		alert("All fields are required.");
		return;
	}

	// Send data (mocking a successful submission here)
	setTimeout(() => {
		// You can replace this with an actual API request using fetch or XMLHttpRequest
		console.log('Form submitted successfully!');
		console.log(`Name: ${name}`);
		console.log(`Email: ${email}`);
		console.log(`Message: ${message}`);

		// Show confirmation message and reset the form
		document.getElementById('confirmation-message').style.display = 'block';
		document.getElementById('contact-form').reset(); // Clear form after submission
	}, 1000);
});