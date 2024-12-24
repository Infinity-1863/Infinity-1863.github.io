// Smooth Scroll to Projects Section
function scrollDown() {
	const aboutSection = document.getElementById('about');
	aboutSection.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener("DOMContentLoaded", () => {
	const elements = document.querySelectorAll('.animate-from-bottom');

	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.4 // Adjust this to your needs; here 40% of the element needs to be visible
	});

	elements.forEach(element => {
		observer.observe(element);
	});
});
