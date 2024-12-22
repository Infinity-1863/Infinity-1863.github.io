document.addEventListener('DOMContentLoaded', function () {
	const sun = document.querySelector('#sun');
	const moon = document.querySelector('#moon');
	const header = document.querySelector('header');
	const body = document.body;
	const stars = document.createElement('div');
	stars.classList.add('stars');
	body.appendChild(stars);

	const clouds = document.createElement('div');
	clouds.classList.add('clouds');
	clouds.style.zIndex = '-10'; // Set clouds to be under other elements
	body.appendChild(clouds);

	const radius = window.innerHeight / 1;
	let distanceFactor = 1;
	let verticalCenterFactor = 1;

	// Speed for celestial bodies, can be changed dynamically
	let celestialSpeed = 0.5; // Default speed

	// Manually create 4 clouds at different positions
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
			cloud.style.height = data.height; // Fixed height
			cloud.style.top = data.top;
			cloud.style.left = data.left;
			cloud.style.width = data.width; // Fixed width
			cloud.dataset.speed = data.speed; // Assign unique speed to each cloud
			clouds.appendChild(cloud);
		});
	}

	// Function to hide content below `.prevent-scrolling`
	const preventScrollingSection = document.querySelector('footer');

	function handlePreventScrolling() {
		const preventSectionBottom = preventScrollingSection.getBoundingClientRect().bottom;
		const windowHeight = window.innerHeight;
		const scrollPosition = window.scrollY;

		// If the user scrolls past the .prevent-scrolling section, prevent further scrolling
		if (scrollPosition + windowHeight > preventSectionBottom) {
			document.body.style.overflow = 'hidden';  // Disable scrolling
		} else {
			document.body.style.overflow = '';  // Re-enable scrolling
		}
	}
	handlePreventScrolling();

	const footer = document.querySelector('footer');

	// Function to generate stars above the footer
	function generateStars() {
		const footerTop = footer.getBoundingClientRect().top + window.scrollY;
		const starsCount = 100;

		for (let i = 0; i < starsCount; i++) {
			const star = document.createElement('div');
			star.classList.add('star');

			let starTop;
			do {
				// Generate stars above the footer
				starTop = Math.random() * window.innerHeight;
			} while (starTop + window.scrollY > footerTop);

			star.style.top = `${(starTop / window.innerHeight) * 100}vh`;
			star.style.left = `${Math.random() * 100}vw`;
			stars.appendChild(star);
		}
	}

	generateStars();
	generateClouds();

	function updateTextColor(sunAtTop) {
		const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li');

		textElements.forEach(element => {
			if (sunAtTop) {
				element.style.color = 'gold';
			} else {
				element.style.color = 'gray';
			}
		});
	}

	function toggleCelestialBodies() {
		const scrollPosition = window.scrollY;
		const viewHeight = window.innerHeight;
		const degree = (scrollPosition / viewHeight) * 360;
		const radian = (Math.PI / 180) * degree;

		const sunX = Math.sin(radian) * radius * distanceFactor * celestialSpeed; // Scale with celestialSpeed
		const sunY = Math.cos(radian) * radius * celestialSpeed; // Scale with celestialSpeed
		const moonX = -Math.sin(radian) * radius * distanceFactor * celestialSpeed; // Scale with celestialSpeed
		const moonY = -Math.cos(radian) * radius * celestialSpeed; // Scale with celestialSpeed

		const verticalOffset = (viewHeight * verticalCenterFactor) - 100;

		sun.style.transform = `translate(${sunX}px, calc(${verticalOffset}px + ${-sunY}px + ${scrollPosition}px))`;
		moon.style.transform = `translate(${moonX}px, calc(${verticalOffset}px + ${-moonY}px + ${scrollPosition}px))`;

		const sunAtTop = sunY > 0;
		if (sunAtTop) {
			sun.style.display = 'block';
			moon.style.display = 'none';
			header.style.backgroundColor = 'linear-gradient(to bottom, #87ceeb, #00bfff)';
			body.style.backgroundColor = '#87ceeb';
			stars.style.display = 'none';
			clouds.style.display = 'block';
			updateTextColor(true);
		} else {
			sun.style.display = 'none';
			moon.style.display = 'block';
			header.style.backgroundColor = 'linear-gradient(to bottom, #2c3e50, #34495e)';
			body.style.backgroundColor = 'black';
			stars.style.display = 'block';
			clouds.style.display = 'none';
			updateTextColor(false);
		}

		const footerTop = footer.getBoundingClientRect().top + window.scrollY;
		const starsHeight = stars.getBoundingClientRect().height;
		const stopStarsAt = footerTop - starsHeight; // Stars will stop moving here

		// Only move the stars if the scroll position is above the stop point
		if (scrollPosition < stopStarsAt) {
			stars.style.transform = `translateY(${scrollPosition * 1.1}px)`;
		} else {
			stars.style.transform = `translateY(${stopStarsAt * 1.1}px)`; // Keep stars at the stop point
		}
	}

	function moveCloudsOnScroll() {
		const scrollPosition = window.scrollY;

		document.querySelectorAll('.cloud').forEach(cloud => {
			const speed = cloud.dataset.speed;
			// Here, the Y position will be affected by scroll and cloud speed.
			const cloudYPosition = (scrollPosition * speed) / 5;
			cloud.style.transform = `translateY(${cloudYPosition}px)`;
		});
	}

	// Adjust the stars' movement based on scroll position
	let starSpeed = 1;  // Adjustable speed factor for stars

	function moveStarsOnScroll() {
		const scrollPosition = window.scrollY;
		const footerTop = footer.getBoundingClientRect().top + scrollPosition;

		// Stop stars from moving once the scroll position reaches near the footer
		if (scrollPosition + window.innerHeight >= footerTop) {
			stars.style.transform = 'translateY(0)';  // Stop stars' movement
		} else {
			stars.style.transform = `translateY(${scrollPosition * starSpeed}px)`;  // Adjust movement speed
		}
	}

	// Event listener for scrolling to trigger both the celestial bodies and cloud movement
	window.addEventListener('scroll', toggleCelestialBodies);
	window.addEventListener('scroll', moveCloudsOnScroll);
	window.addEventListener('scroll', handlePreventScrolling);
	window.addEventListener('scroll', moveStarsOnScroll);

	// Initial call to set up the view
	toggleCelestialBodies();

	celestialSpeed = 0.5;  // Double the speed for example
});
