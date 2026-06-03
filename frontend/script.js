const requestForm = document.getElementById('requestForm');
const requestList = document.getElementById('requestList');

requestForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const requestData = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value
    };

    await fetch('/requests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    requestForm.reset();
    loadRequests();
});

async function loadRequests() {
    const response = await fetch('/requests');
    const requests = await response.json();

    requestList.innerHTML = '';

    if (requests.length === 0) {
        requestList.innerHTML = '<p>No requests have been submitted yet.</p>';
        return;
    }

    requests.forEach(request => {
        const requestCard = document.createElement('div');
        requestCard.className = 'request-card';

        requestCard.innerHTML = `
            <h3>${request.title}</h3>
            <p><strong>Category:</strong> ${request.category}</p>
            <p><strong>Description:</strong> ${request.description}</p>
            <p><strong>Status:</strong> ${request.status}</p>
            <p><strong>Created:</strong> ${request.createdAt}</p>

            <select onchange="updateStatus(${request.id}, this.value)">
                <option value="New" ${request.status === 'New' ? 'selected' : ''}>New</option>
                <option value="In Progress" ${request.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Completed" ${request.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
        `;

        requestList.appendChild(requestCard);
    });
}

async function updateStatus(id, status) {
    await fetch(`/requests/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });

    loadRequests();
}

loadRequests();