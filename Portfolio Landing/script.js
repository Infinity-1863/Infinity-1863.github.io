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
		threshold: 0.4 // Adjust this to your needs; here 40% of the element needs to be visible to appear
	});

	elements.forEach(element => {
		observer.observe(element);
	});
});

// Project data
const projects = {
	1: {
		title: "My Work 1",
		description: "This is a detailed description of My Work 1. It explains the features, technologies used, and purpose.",
		image: "images/Portfolio.png"
	},
	2: {
		title: "My Work 2",
		description: "Detailed description of My Work 2. It highlights the unique aspects of this project.",
		image: "images/Portfolio.png"
	},
	3: {
		title: "My Work 3",
		description: "Information about My Work 3, including challenges overcome and the final outcome.",
		image: "images/Portfolio.png"
	}
};

// Modal elements
const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalImage = document.getElementById("modal-image");
const closeButton = document.querySelector(".close-button");
const body = document.querySelector("body");

document.querySelectorAll(".view-more").forEach(button => {
    button.addEventListener("click", () => {
        const projectId = button.getAttribute("data-project");
        const project = projects[projectId];

        if (project) {
            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;
            modalImage.src = project.image;

            // Show the modal
            modal.style.display = "flex";
            body.classList.add("no-scroll");
        }
    });
});

closeButton.addEventListener("click", () => {
    modal.style.display = "none";
    body.classList.remove("no-scroll");
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        body.classList.remove("no-scroll");
    }
});