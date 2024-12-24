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