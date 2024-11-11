export async function submitComment(event) {
    event.preventDefault(); // Prevent the default form submission
    const commentValue = document.getElementById('comment').value;

    // Send the comment to the server
    try {
        const response = await fetch('/submit-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment: commentValue,
            }),
        });

        const data = await response.json();
        console.log('Success:', data);
        
        // Refresh the comment list
        if (data.success) {
            const commentsList = document.getElementById('commentsList');
            const newCommentItem = document.createElement('li');
            newCommentItem.textContent = commentValue; // Display the new comment
            commentsList.appendChild(newCommentItem);
            document.getElementById('comment').value = ''; // Clear input
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Attach submitComment to the form
const form = document.getElementById('commentForm');
if (form) {
    form.addEventListener('submit', submitComment);
}