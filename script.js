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

	let distanceFactor = 1;
	let verticalCenterFactor = 1;

	// Speed for celestial bodies, can be changed dynamically
	let celestialSpeed = 0.5; // Slower movement speed

	// Generate clouds
	function generateClouds() {
		const cloudData = [
			{ top: '20vh', left: '10vw', speed: 5, height: '15vh', width: '30vw' },
			{ top: '30vh', left: '50vw', speed: 4.5, height: '8vh', width: '35vw' },
			{ top: '50vh', left: '70vw', speed: 5.5, height: '10vh', width: '40vw' },
			{ top: '70vh', left: '30vw', speed: 4, height: '12vh', width: '25vw' }
		];

		cloudData.forEach(data => {
			const cloud = document.createElement('div');
			cloud.classList.add('cloud');
			cloud.style.height = data.height;
			cloud.style.top = data.top;
			cloud.style.left = data.left;
			cloud.style.width = data.width;
			cloud.dataset.speed = data.speed;
			clouds.appendChild(cloud);
		});
	}

	const footer = document.querySelector('footer');

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
		const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li');

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

		const footerTop = footer.getBoundingClientRect().top + window.scrollY;

		if (window.scrollY + window.innerHeight >= footerTop) {
			sun.style.display = 'none';
			moon.style.display = 'block';
			body.style.backgroundColor = 'black';
			stars.style.opacity = 1;
		} else {
			const normalizedSunY = Math.max(0, sunY / adjustedRadius);
			const starsOpacity = 1 - normalizedSunY;
			stars.style.opacity = starsOpacity;
		}

		if (sunY > 0) {
			sun.style.display = 'block';
			moon.style.display = 'none';
			body.style.backgroundColor = 'rgb(0, 155, 207)';
			updateTextColor(true);
		} else {
			sun.style.display = 'none';
			moon.style.display = 'block';
			updateTextColor(false);
		}

		// Smoothly update stars and other transitions
		const normalizedSunY = Math.max(0, sunY / (adjustedRadius * celestialSpeed));
		const starsOpacity = 1 - normalizedSunY;
		stars.style.transition = 'opacity 0.5s ease-out';
		stars.style.opacity = starsOpacity;

		// Control cloud opacity based on sun position
		const cloudOpacity = Math.min(1, Math.max(0, sunY / adjustedRadius));
		document.querySelectorAll('.cloud').forEach(cloud => {
			cloud.style.transition = 'opacity 0.5s ease-out';
			cloud.style.opacity = cloudOpacity;
		});

		// Increment rotation angle to keep the celestial bodies moving clockwise
		rotationAngle += 0.2 * celestialSpeed; // Slow down the rotation increment to make the movement smooth
		if (rotationAngle >= 360) {
			rotationAngle = 0; // Reset angle to prevent overflow
		}

		// Continue the animation
		requestAnimationFrame(toggleCelestialBodies);
	}

	// Start the animation
	toggleCelestialBodies();

	function moveCelestialsVerticallyWithScroll() {
		const scrollPosition = window.scrollY; // Get the current scroll position
		const viewHeight = Math.max(window.innerHeight, 500);

		// Limit the vertical scroll range to prevent infinite movement
		const verticalOffset = Math.min(scrollPosition, viewHeight * 2);

		// Apply the vertical movement to the celestial bodies (sun and moon)
		sun.style.transition = 'transform 0.1s ease-out';
		moon.style.transition = 'transform 0.1s ease-out';

		sun.style.transform = `translateY(${verticalOffset}px)`;
		moon.style.transform = `translateY(${verticalOffset}px)`;
	}

	// Listen for scroll events to trigger the vertical movement
	window.addEventListener('scroll', () => {
		moveCelestialsVerticallyWithScroll();
		toggleCelestialBodies(); // Call to continue the circular motion even during scroll
	});

	function moveCloudsOnScroll() {
		const scrollPosition = window.scrollY;

		document.querySelectorAll('.cloud').forEach(cloud => {
			const speed = cloud.dataset.speed;

			// Scale movement speed for mobile devices
			const scaleFactor = window.innerWidth <= 768 ? 0.8 : 1; // Reduce speed on smaller screens
			const cloudYPosition = (scrollPosition * speed * scaleFactor) / 5;

			cloud.style.transform = `translateY(${cloudYPosition}px)`;
		});
	}

	// Event listeners for mobile optimization
	function initScrollListeners() {
		// Detect touch devices for smooth scroll
		if ('ontouchstart' in document.documentElement) {
			document.addEventListener('touchmove', () => {
				moveCloudsOnScroll();
			});
		} else {
			window.addEventListener('scroll', () => {
				moveCloudsOnScroll();
			});
		}
	}

	// Initialize listeners on page load
	initScrollListeners();

	function adjustResolutionBasedMovement() {
		const width = window.innerWidth;
		const height = window.innerHeight;

		// For mobile devices, scale down the distances and speeds
		if (width <= 768) {
			distanceFactor = 1;  // Reduce the scaling factor on mobile
			celestialSpeed = 1;  // Slow down the movement on smaller screens
		} else if (width <= 1200) {
			distanceFactor = 1;  // Slightly reduce the scaling factor on medium screens
			celestialSpeed = 1;  // Adjust speed for larger screens
		} else {
			distanceFactor = 1;  // Default scaling factor
			celestialSpeed = 1;  // Default speed for desktop
		}
	}

	// Adjust resolution-based movement settings on resize
	window.addEventListener('resize', adjustResolutionBasedMovement);
	adjustResolutionBasedMovement();
});
