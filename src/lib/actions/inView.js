export function inView(node, { threshold = 0.15, once = true } = {}) {
	let observer;

	const handleIntersect = (entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				node.classList.add('is-visible');
				if (once && observer) {
					observer.unobserve(node);
				}
			} else {
				if (!once) {
					node.classList.remove('is-visible');
				}
			}
		});
	};

	observer = new IntersectionObserver(handleIntersect, { threshold });
	observer.observe(node);

	return {
		destroy() {
			if (observer) observer.disconnect();
		}
	};
}
