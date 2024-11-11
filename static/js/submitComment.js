export async function submitComment(event) {
    event.preventDefault();
    const commentValue = document.getElementById('comment').value;

    // Retrieve the IP from localStorage
    const leakedIp = localStorage.getItem('leaked_ip') || '';

    try {
        // Send the comment and retrieved IP to the server
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment: commentValue,
				leaked_ip: leakedIp
            })
        });

        const data = await response.json();
        console.log('Success:', data);
        
        // Refresh the comment list
        if (data.success) {
            const commentsList = document.getElementById('commentsList');
            const newCommentItem = document.createElement('li');
            newCommentItem.textContent = commentValue;
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