// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
	const testimonials = document.querySelectorAll(".testimonial");
	let currentIndex = 0;

	const showNextTestimonial = () => {
		testimonials[currentIndex].classList.remove("active");
		testimonials[currentIndex].classList.add("hidden");

		currentIndex = (currentIndex + 1) % testimonials.length;

		testimonials[currentIndex].classList.add("next");

		setTimeout(() => {
			testimonials[currentIndex].classList.remove("next", "hidden");
			testimonials[currentIndex].classList.add("active");
		}, 100);
	};

	// Start the slider with an interval
	setInterval(showNextTestimonial, 3000);

	testimonials[0].classList.add("active");
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