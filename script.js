document.addEventListener('DOMContentLoaded', function () {
	const sun = document.querySelector('#sun');
	const moon = document.querySelector('#moon');
	const body = document.body;
	const stars = document.createElement('div');
	stars.classList.add('stars');
	body.appendChild(stars);

	let distanceFactor = 3;

	// Speed for celestial bodies, can be changed dynamically
	let celestialSpeed = 0.3; // Slower movement speed

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

	function updateTextColor(sunAtTop) {
		const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, button');

		textElements.forEach(element => {
			element.style.color = sunAtTop ? 'gold' : 'gray';
		});
	}

	let rotationAngle = 0; // To track the rotation angle over time

	function toggleCelestialBodies() {
		const viewHeight = Math.max(window.innerHeight, 500);
		const degree = rotationAngle;
		const radian = (Math.PI / 180) * degree;

		const adjustedRadius = Math.max(viewHeight / 1.2, 200);
		const verticalOffset = viewHeight - 100;

		const sunX = Math.sin(radian) * adjustedRadius * distanceFactor * celestialSpeed;
		const sunY = Math.cos(radian) * adjustedRadius * distanceFactor * celestialSpeed;
		const moonX = -Math.sin(radian) * adjustedRadius * distanceFactor * celestialSpeed;
		const moonY = -Math.cos(radian) * adjustedRadius * distanceFactor * celestialSpeed;

		sun.style.transition = 'transform 0.1s ease-out';
		moon.style.transition = 'transform 0.1s ease-out';

		sun.style.transform = `translate(${sunX}px, ${verticalOffset - sunY}px)`;
		moon.style.transform = `translate(${moonX}px, ${verticalOffset - moonY}px)`;

		if (sunY > 0) {
			// Daytime
			sun.style.display = 'block';
			moon.style.display = 'none';
			body.classList.add('day-gradient');
			body.classList.remove('night-gradient');

			updateTextColor(true);
			document.querySelectorAll('.stars').forEach(star => {
				star.style.transition = 'opacity 1s ease-out';
				star.style.opacity = 0;
			});
		} else {
			// Nighttime
			sun.style.display = 'none';
			moon.style.display = 'block';
			stars.classList.add('night-gradient');
			body.classList.remove('day-gradient');

			updateTextColor(false);
			document.querySelectorAll('.stars').forEach(star => {
				star.style.transition = 'opacity 1s ease-out';
				star.style.opacity = 1;
			});
		}

		rotationAngle += 1 * celestialSpeed;
		if (rotationAngle >= 360) rotationAngle = 0;

		requestAnimationFrame(toggleCelestialBodies);
	}

	function applyParallaxEffect() {
		const stars = document.querySelector('.stars');

		window.addEventListener('scroll', () => {
			const scrollPosition = window.scrollY;

			// Adjust background positions based on scroll
			if (stars) {
				stars.style.backgroundPositionY = `${scrollPosition * 0.5}px`; // Slower movement
			}
		});
	}

	function scrollToProjects() {
		const projectsSection = document.getElementById('projects');
		projectsSection.scrollIntoView({ behavior: 'smooth' });
	}

	const scrollToProject = document.getElementById('scrollToProjects');
	if (scrollToProject) {
		scrollToProject.addEventListener('click', scrollToProjects);
	}

	function scrollToServices() {
		const servicesSection = document.getElementById('services');
		servicesSection.scrollIntoView({ behavior: 'smooth' });
	}

	const scrollToService = document.getElementById('scrollToServices');
	if (scrollToService) {
		scrollToService.addEventListener('click', scrollToServices);
	}
	// Start the animation
	applyParallaxEffect();
	toggleCelestialBodies();
});

document.addEventListener("DOMContentLoaded", function () {
	const searchInput = document.getElementById("projectSearch");
	const projects = document.querySelectorAll(".project");

	// Function to filter projects based on search input
	function filterProjects() {
		const searchQuery = searchInput.value.toLowerCase(); // Get the lowercase search query

		projects.forEach(project => {
			const projectTitle = project.getAttribute("data-title").toLowerCase(); // Get the project title

			// If the search query matches part of the project title, show the project; otherwise, hide it
			if (projectTitle.includes(searchQuery)) {
				project.style.display = "block";  // Show the project
			} else {
				project.style.display = "none";  // Hide the project
			}
		});
	}

	// Add event listener to the search input to trigger filtering when typing
	searchInput.addEventListener("input", filterProjects);
});

document.addEventListener("DOMContentLoaded", () => {
	const elements = document.querySelectorAll('.animate-from-bottom');

	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				observer.unobserve(entry.target); // Stop observing once the element is visible
			}
		});
	}, {
		threshold: 0.4 // Adjust this to your needs; here 50% of the element needs to be visible
	});

	elements.forEach(element => {
		observer.observe(element);
	});
});
