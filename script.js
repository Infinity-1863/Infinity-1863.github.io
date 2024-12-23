document.addEventListener('DOMContentLoaded', function () {
	const sun = document.querySelector('#sun');
	const moon = document.querySelector('#moon');
	const body = document.body;
	const stars = document.createElement('div');
	const radius = Math.max(window.innerHeight / 1.2, 500); // Adjust radius for small screens
	stars.classList.add('stars');
	body.appendChild(stars);

	const clouds = document.createElement('div');
	clouds.classList.add('clouds');
	clouds.style.zIndex = '-10'; // Set clouds to be under other elements
	body.appendChild(clouds);

	let distanceFactor = 2;
	let verticalCenterFactor = 1;

	// Speed for celestial bodies, can be changed dynamically
	let celestialSpeed = 0.4; // Slower movement speed

	// Generate clouds
	function generateClouds() {
		const cloudData = [
			{ top: '20vh', left: '10vw', height: '15vh', width: '30vw' },
			{ top: '30vh', left: '50vw', height: '8vh', width: '35vw' },
			{ top: '50vh', left: '60vw', height: '10vh', width: '40vw' },
			{ top: '70vh', left: '30vw', height: '12vh', width: '25vw' }
		];

		cloudData.forEach(data => {
			const cloud = document.createElement('div');
			cloud.classList.add('cloud');
			cloud.style.height = data.height;
			cloud.style.top = data.top;
			cloud.style.left = data.left;
			cloud.style.width = data.width;
			clouds.appendChild(cloud);
		});
	}

	// Function to generate stars
	function generateStars() {
		const starsCount = 100;

		for (let i = 0; i < starsCount; i++) {
			const star = document.createElement('div');
			star.classList.add('star');
			star.style.top = `${Math.random() * 100}vh`;
			star.style.left = `${Math.random() * 100}vw`;
			stars.appendChild(star);
		}
	}

	generateStars();
	generateClouds();

	function updateTextColor(sunAtTop) {
		const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, button');

		textElements.forEach(element => {
			element.style.color = sunAtTop ? 'gold' : 'gray';
		});
	}

	let rotationAngle = 0; // To track the rotation angle over time

	function toggleCelestialBodies() {
		const viewHeight = Math.max(window.innerHeight, 500);
		const degree = rotationAngle; // Use the rotationAngle instead of scrollPosition
		const radian = (Math.PI / 180) * degree;

		const adjustedRadius = Math.max(viewHeight / 1.2, 200);
		const verticalOffset = viewHeight - 100; // Keep it fixed or adjust as needed

		// Smooth celestial body positions
		const sunX = Math.sin(radian) * adjustedRadius * distanceFactor * celestialSpeed;
		const sunY = Math.cos(radian) * adjustedRadius * distanceFactor * celestialSpeed;
		const moonX = -Math.sin(radian) * adjustedRadius * distanceFactor * celestialSpeed;
		const moonY = -Math.cos(radian) * adjustedRadius * distanceFactor * celestialSpeed;

		// Apply smooth translation
		sun.style.transition = 'transform 0.1s ease-out';
		moon.style.transition = 'transform 0.1s ease-out';

		sun.style.transform = `translate(${sunX}px, ${verticalOffset - sunY}px)`;
		moon.style.transform = `translate(${moonX}px, ${verticalOffset - moonY}px)`;

		// Check if the sun is above the horizon (i.e., sunY > 0)
		if (sunY > 0) {
			// Sun is visible
			sun.style.display = 'block';
			moon.style.display = 'none';
			body.style.backgroundColor = 'rgb(0, 155, 207)'; // Blue sky during the day
			updateTextColor(true);

			// Make clouds visible when the sun is up
			document.querySelectorAll('.cloud').forEach(cloud => {
				cloud.style.transition = 'opacity 1s ease-out'; // Slow cloud transition
				cloud.style.opacity = 1; // Clouds are fully visible during the day
			});

			// Make stars disappear smoothly during the day
			document.querySelectorAll('.stars').forEach(star => {
				star.style.transition = 'opacity 1s ease-out'; // Smooth transition
				star.style.opacity = 0; // Stars are hidden during the day
			});
		} else {
			// Moon is visible (night)
			sun.style.display = 'none';
			moon.style.display = 'block';
			body.style.backgroundColor = 'black'; // Black sky during the night
			updateTextColor(false);

			// Make clouds invisible when the moon is up
			document.querySelectorAll('.cloud').forEach(cloud => {
				cloud.style.transition = 'opacity 1s ease-out'; // Slow cloud transition
				cloud.style.opacity = 0; // Clouds are hidden during the night
			});

			// Make stars appear smoothly at night
			document.querySelectorAll('.stars').forEach(star => {
				star.style.transition = 'opacity 1s ease-out'; // Smooth transition
				star.style.opacity = 1; // Stars are visible during the night
			});
		}

		// Increment rotation angle to keep the celestial bodies moving clockwise
		rotationAngle += 1 * celestialSpeed; // Slow down the rotation increment to make the movement smooth
		if (rotationAngle >= 360) {
			rotationAngle = 0; // Reset angle to prevent overflow
		}

		// Continue the animation
		requestAnimationFrame(toggleCelestialBodies);
	}

	function applyParallaxEffect() {
		const stars = document.querySelector('.stars');
		const clouds = document.querySelector('.clouds');

		window.addEventListener('scroll', () => {
			const scrollPosition = window.scrollY;

			// Adjust background positions based on scroll
			if (stars) {
				stars.style.backgroundPositionY = `${scrollPosition * 0.5}px`; // Slower movement
			}
			if (clouds) {
				clouds.style.backgroundPositionY = `${scrollPosition * 0.8}px`; // Faster movement
			}
		});
	}

	function scrollToProjects() {
		const projectsSection = document.getElementById('projects');
		projectsSection.scrollIntoView({ behavior: 'smooth' });
	}

	// Add event listener to the button
	const scrollButton = document.getElementById('scrollToProjects');
	if (scrollButton) {
		scrollButton.addEventListener('click', scrollToProjects);
	}

	// Start the animation
	applyParallaxEffect();
	toggleCelestialBodies();
});
