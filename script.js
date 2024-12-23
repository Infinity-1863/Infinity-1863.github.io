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
		const verticalOffset = (viewHeight * verticalCenterFactor) - 100;

		const sunX = Math.sin(radian) * adjustedRadius * distanceFactor * celestialSpeed;
		const sunY = Math.cos(radian) * adjustedRadius * celestialSpeed;
		const moonX = -Math.sin(radian) * adjustedRadius * distanceFactor * celestialSpeed;
		const moonY = -Math.cos(radian) * adjustedRadius * celestialSpeed;

		sun.style.transform = `translate(${sunX}px, ${verticalOffset - sunY + scrollPosition}px)`;
		moon.style.transform = `translate(${moonX}px, ${verticalOffset - moonY + scrollPosition}px)`;

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

		const normalizedSunY = Math.max(0, sunY / (adjustedRadius * celestialSpeed)); // Normalize sunY to a range [0, 1]
		const starsOpacity = 1 - normalizedSunY; // Stars fade out as the sun rises higher

		stars.style.transition = 'opacity 0.5s ease-out'; // Smooth opacity transition
		stars.style.opacity = starsOpacity;
	}

	function moveCloudsOnScroll() {
		const scrollPosition = window.scrollY;

		document.querySelectorAll('.cloud').forEach(cloud => {
			const speed = cloud.dataset.speed;
			const cloudYPosition = (scrollPosition * speed) / 5;
			cloud.style.transform = `translateY(${cloudYPosition}px)`;
		});
	}

	function adjustResolutionBasedMovement() {
		const width = window.innerWidth;

		if (width <= 768) {
			distanceFactor = 0.7;
			verticalCenterFactor = 1.3;
			celestialSpeed = 0.7;
		} else if (width <= 1200) {
			distanceFactor = 0.8;
			verticalCenterFactor = 1.2;
			celestialSpeed = 0.8;
		} else {
			distanceFactor = 1;
			verticalCenterFactor = 1;
			celestialSpeed = 1;
		}
	}

	adjustResolutionBasedMovement();

	// Ensure all movements are smooth and continuous
	window.addEventListener('resize', adjustResolutionBasedMovement);
	window.addEventListener('scroll', () => {
		toggleCelestialBodies();
		moveCloudsOnScroll();
		moveStarsOnScroll();  // Add this line to move stars
	});

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
