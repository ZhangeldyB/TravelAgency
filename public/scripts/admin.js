document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/admin/users');
  const users = await response.json();
  const userTableBody = document.getElementById('userTableBody');
  userTableBody.innerHTML = '';

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>
        <button class="btn btn-dark" onclick="deleteUser('${user._id}')">Delete</button>
        <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#editUserModal" onclick="editUser('${user._id}')">Edit</button>
      </td>
    `;
    userTableBody.appendChild(row);
  });
});

async function deleteUser(userId) {
  await fetch(`/admin/delete/${userId}`, { method: 'POST' });
  window.location.reload();
}

async function editUser(userId) {
  const response = await fetch(`/admin/edit/${userId}`);
  const user = await response.json();

  const editUserModalContent = document.querySelector('#editUserModal .modal-content');
  editUserModalContent.innerHTML = '';
  const form = document.createElement('form');
  form.innerHTML = `
    <div class="mb-3">
      <label for="editUsername" class="form-label">Username:</label>
      <input type="text" class="form-control" id="editUsername" value="${user.username}" required>
    </div>
    <div class="mb-3">
      <label for="editEmail" class="form-label">Email:</label>
      <input type="email" class="form-control" id="editEmail" value="${user.email}" required>
    </div>
    <button type="button" class="btn btn-dark" onclick="saveChanges('${user._id}')">Save Changes</button>
  `;

  editUserModalContent.appendChild(form);
}

async function saveChanges(userId) {
  const editUsername = document.getElementById('editUsername').value;
  const editEmail = document.getElementById('editEmail').value;

  await fetch(`/admin/edit/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: editUsername,
      email: editEmail,
    }),
  });

  const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
  editUserModal.hide();

  window.location.reload();
}
