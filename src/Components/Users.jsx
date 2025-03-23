import React, { useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { Modal, Button } from 'flowbite-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isAddUserFormOpen, setIsAddUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // State for editing user

  const toggleAddUserForm = () => {
    setIsAddUserFormOpen(!isAddUserFormOpen);
    setEditingUser(null); // Reset editing user when toggling the form
  };

  const handleAddUser = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newUser = {
      id: users.length + 1,
      name: formData.get('name'),
      email: formData.get('email'),
      contact: formData.get('contact'),
      role: formData.get('role'),
    };

    if (editingUser) {
      
      setUsers(users.map((user) => (user.id === editingUser.id ? newUser : user)));
    } else {
      
      setUsers([...users, newUser]);
    }

    setIsAddUserFormOpen(false);
    setEditingUser(null); 
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEditButtonClick = (user) => {
    setEditingUser(user); 
    setIsAddUserFormOpen(true); 
  };

  return (
    <div className="min-h-screen">
      <h4 className="text-green-800 font-bold ml-8 flex items-center gap-2">
        <FaUserAlt className="w-5 h-5" /> / Users
      </h4>

      <div className="max-w-7xl mx-5 my-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <Button onClick={toggleAddUserForm} gradientDuoTone="greenToBlue">
            Add User
          </Button>
        </div>

        <Modal show={isAddUserFormOpen} onClose={toggleAddUserForm} size="md">
          <Modal.Header>
            {editingUser ? 'Edit User' : 'Add New User'}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-600 mb-2">Name:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  defaultValue={editingUser ? editingUser.name : ''}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  defaultValue={editingUser ? editingUser.email : ''}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-600 mb-2">Name:</label>
                <input
                  type="number"
                  name="contact"
                  placeholder="Contact Number"
                  defaultValue={editingUser ? editingUser.contact : ''}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-2">Role:</label>
                <select
                  name="role"
                  defaultValue={editingUser ? editingUser.role : ''}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" color="gray" onClick={toggleAddUserForm}>
                  Cancel
                </Button>
                <Button type="submit" gradientDuoTone="greenToBlue">
                  {editingUser ? 'Update' : 'Save'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
        {/*user table */}
        {users.length > 0 ? (
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="border border-gray-700 p-3 text-left">Name</th>
                    <th className="border border-gray-700 p-3 text-left">Email</th>
                    <th className="border border-gray-700 p-3 text-left">Role</th>
                    <th className="border border-gray-700 p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="border border-gray-200 p-3">{user.name}</td>
                      <td className="border border-gray-200 p-3">{user.email}</td>
                      <td className="border border-gray-200 p-3">{user.role}</td>
                      <td className="border border-gray-200 p-3 space-x-2">
                        <Button
                          onClick={() => handleEditButtonClick(user)}
                          color="warning"
                          size="xs"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          color="failure"
                          size="xs"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center mt-5 text-gray-500">
            No users available. Please add a user.
          </p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;