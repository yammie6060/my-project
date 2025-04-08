import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaSearch, FaFilter, FaSort, FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Badge, Tooltip, Spinner } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isAddUserFormOpen, setIsAddUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [filterRole, setFilterRole] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    role: '',
    status: 'Active'
  });

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Add some sample users for demonstration
      if (users.length === 0) {
        setUsers([
         ]);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleAddUserForm = () => {
    setIsAddUserFormOpen(!isAddUserFormOpen);
    if (!isAddUserFormOpen) {
      // Clear form when opening
      if (editingUser) {
        setFormData({
          name: editingUser.name,
          email: editingUser.email,
          contact: editingUser.contact,
          role: editingUser.role,
          status: editingUser.status || 'Active'
        });
      } else {
        setFormData({
          name: '',
          email: '',
          contact: '',
          role: '',
          status: 'Active'
        });
      }
    } else {
      setEditingUser(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddUser = (event) => {
    event.preventDefault();
    const newUser = {
      id: editingUser ? editingUser.id : users.length + 1,
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      role: formData.role,
      status: formData.status,
      avatar: getInitials(formData.name)
    };

    if (editingUser) {
      setUsers(users.map((user) => (user.id === editingUser.id ? newUser : user)));
    } else {
      setUsers([...users, newUser]);
    }

    setIsAddUserFormOpen(false);
    setEditingUser(null);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    setConfirmDelete(null);
  };

  const handleEditButtonClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      contact: user.contact,
      role: user.role,
      status: user.status || 'Active'
    });
    setIsAddUserFormOpen(true);
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterRole ? user.role === filterRole : true;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Admin': return 'blue';
      case 'Manager': return 'indigo';
      case 'Staff': return 'emerald';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-teal-600 to-blue-600 py-4 px-8 mb-6">
        <h4 className="text-white font-bold flex items-center gap-2 text-lg">
          <FaUserAlt className="w-5 h-5" />User Management
        </h4>
      </div>

      <div className="max-w-7xl mx-auto px-4 my-8">
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 pl-10 p-2.5 rounded-lg w-full"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 p-2.5 rounded-lg"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <Button 
                color="light" 
                size="sm"
                onClick={toggleAddUserForm}
              ><FaUserPlus />
              Add User
              </Button>
            </div>
          </div>
        </div>

        {/* User Form Modal */}
        <Modal show={isAddUserFormOpen} onClose={toggleAddUserForm} size="md" popup>
          <Modal.Header className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
            {editingUser ? 'Edit User' : 'Add New User'}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Name:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Email:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Contact:</label>
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Role:</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Status:</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" color="gray" onClick={toggleAddUserForm}>
                  Cancel
                </Button>
                <Button type="submit" gradientDuoTone="tealToBlue">
                  {editingUser ? 'Update User' : 'Save User'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {/* Confirm Delete Modal */}
        <Modal show={confirmDelete !== null} size="sm" popup onClose={() => setConfirmDelete(null)}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                Are you sure you want to delete this user?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => handleDeleteUser(confirmDelete)}>
                  Yes, delete
                </Button>
                <Button color="gray" onClick={() => setConfirmDelete(null)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* User table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="mt-4">
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                    <th className="border-b border-gray-300 p-4 text-left">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => requestSort('name')}>
                        User
                        <FaSort className="text-gray-400" />
                      </div>
                    </th>
                    <th className="border-b border-gray-300 p-4 text-left">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => requestSort('email')}>
                        Contact Info
                        <FaSort className="text-gray-400" />
                      </div>
                    </th>
                    <th className="border-b border-gray-300 p-4 text-left">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => requestSort('role')}>
                        Role
                        <FaSort className="text-gray-400" />
                      </div>
                    </th>
                    <th className="border-b border-gray-300 p-4 text-left">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => requestSort('status')}>
                        Status
                        <FaSort className="text-gray-400" />
                      </div>
                    </th>
                    <th className="border-b border-gray-300 p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 border-b border-gray-200 transition-colors duration-200">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{user.email}</div>
                          <div className="text-gray-500">{user.contact}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge color={getRoleBadgeColor(user.role)} className="px-3 py-1.5">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge color={user.status === 'Active' ? 'emerald' : 'gray'} className="px-3 py-1.5">
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Tooltip content="Edit User">
                            <Button
                              onClick={() => handleEditButtonClick(user)}
                              color="blue"
                              size="xs"
                              className="px-3"
                            >
                              <FaEdit />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete User">
                            <Button
                              onClick={() => setConfirmDelete(user.id)}
                              color="red"
                              size="xs"
                              className="px-3"
                            >
                              <FaTrash />
                            </Button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-500 text-right">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <FaUserAlt className="mx-auto" />
            </div>
            <p className="text-xl font-medium text-gray-500 mb-4">
              No users available
            </p>
            <p className="text-gray-500 mb-6">
              Add your first user by clicking the "Add User" button above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;