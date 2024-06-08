let currentRating = "";

document.querySelectorAll('.star').forEach((star, index) => {
    star.addEventListener('click', function() {
        const rating = this.getAttribute('data-value');

        if (currentRating && currentRating !== rating) {
            // If a different star is clicked, reset all stars to light gray
            document.querySelectorAll('.star').forEach(star => {
                star.textContent = '[]';
            });
        }

        // Color the clicked star and all preceding stars gold
        this.textContent = '[✓]';
        let prevSibling = this.previousElementSibling;
        while(prevSibling) {
            prevSibling.textContent = '[✓]';
            prevSibling = prevSibling.previousElementSibling;
        }

        // Update the current rating
        currentRating = rating;
    });
});