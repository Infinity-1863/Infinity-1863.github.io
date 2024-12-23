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
	let celestialSpeed = 1; // Default speed

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

	function toggleCelestialBodies() {
		const scrollPosition = window.scrollY;
		const viewHeight = Math.max(window.innerHeight, 500);
		const degree = (scrollPosition / viewHeight) * 360;
		const radian = (Math.PI / 180) * degree;

		const adjustedRadius = Math.max(viewHeight / 1.2, 200);
		const verticalOffset = viewHeight - 100 + scrollPosition; // Align at the bottom and move with scrolling

		const sunX = Math.sin(radian) * adjustedRadius * distanceFactor * celestialSpeed;
		const sunY = Math.cos(radian) * adjustedRadius * distanceFactor * celestialSpeed;
		const moonX = -Math.sin(radian) * adjustedRadius * distanceFactor * celestialSpeed;
		const moonY = -Math.cos(radian) * adjustedRadius * distanceFactor * celestialSpeed;

		// Keep the celestial bodies moving in a circular path, with only vertical offset
		sun.style.transform = `translate(${sunX}px, ${verticalOffset - sunY}px)`;
		moon.style.transform = `translate(${moonX}px, ${verticalOffset - moonY}px)`;

		const footerTop = footer.getBoundingClientRect().top + window.scrollY;

		if (scrollPosition + window.innerHeight >= footerTop) {
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
	}

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
				toggleCelestialBodies();
				moveCloudsOnScroll();
			});
		} else {
			window.addEventListener('scroll', () => {
				toggleCelestialBodies();
				moveCloudsOnScroll();
				moveStarsOnScroll();
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
			distanceFactor = 0.5;  // Reduce the scaling factor on mobile
			celestialSpeed = 0.5;  // Slow down the movement on smaller screens
		} else if (width <= 1200) {
			distanceFactor = 0.75;  // Slightly reduce the scaling factor on medium screens
			celestialSpeed = 0.75;  // Slightly reduce the speed
		} else {
			distanceFactor = 1;  // Full scaling factor for large screens
			celestialSpeed = 1;  // Normal speed
		}

		// Adjust radius and movement based on both width and height for consistency
		const radius = Math.max(height / 1.2, 500); // Use max height or a fixed value for consistency
		return radius;
	}

	adjustResolutionBasedMovement();
	toggleCelestialBodies();

	// Ensure all movements are smooth and continuous
	window.addEventListener('resize', adjustResolutionBasedMovement);
	// Function to move stars with the scroll
	function moveStarsOnScroll() {
		const scrollPosition = window.scrollY;

		// Select the container that holds the stars (the .stars div)
		const starsContainer = document.querySelector('.stars');

		// Ensure the stars container is positioned fixed to always stay in one place
		starsContainer.style.position = 'fixed';

		// Adjust the speed factor to control the vertical movement
		starsContainer.style.transform = `translateY(${scrollPosition * 0}px)`; // Adjust speed as needed
	}
});
