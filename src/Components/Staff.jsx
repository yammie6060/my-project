import React, { useState, useEffect } from 'react';
import { FaUserMd, FaSearch, FaFilter, FaSort, FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Badge, Tooltip, Spinner } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [isAddStaffFormOpen, setIsAddStaffFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [filterDepartment, setFilterDepartment] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    department: '',
    position: '',
    status: 'Active'
  });

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Add some sample staff for demonstration
      if (staff.length === 0) {
        setStaff([]);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleAddStaffForm = () => {
    setIsAddStaffFormOpen(!isAddStaffFormOpen);
    if (!isAddStaffFormOpen) {
      // Clear form when opening
      if (editingStaff) {
        setFormData({
          name: editingStaff.name,
          email: editingStaff.email,
          contact: editingStaff.contact,
          department: editingStaff.department,
          position: editingStaff.position,
          status: editingStaff.status || 'Active'
        });
      } else {
        setFormData({
          name: '',
          email: '',
          contact: '',
          department: '',
          position: '',
          status: 'Active'
        });
      }
    } else {
      setEditingStaff(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddStaff = (event) => {
    event.preventDefault();
    const newStaff = {
      id: editingStaff ? editingStaff.id : staff.length + 1,
      name: formData.name,
      email: formData.email,
      contact: formData.contact,
      department: formData.department,
      position: formData.position,
      status: formData.status,
      avatar: getInitials(formData.name)
    };

    if (editingStaff) {
      setStaff(staff.map((member) => (member.id === editingStaff.id ? newStaff : member)));
    } else {
      setStaff([...staff, newStaff]);
    }

    setIsAddStaffFormOpen(false);
    setEditingStaff(null);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const handleDeleteStaff = (id) => {
    setStaff(staff.filter((member) => member.id !== id));
    setConfirmDelete(null);
  };

  const handleEditButtonClick = (member) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      email: member.email,
      contact: member.contact,
      department: member.department,
      position: member.position,
      status: member.status || 'Active'
    });
    setIsAddStaffFormOpen(true);
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort staff
  const filteredStaff = staff
    .filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterDepartment ? member.department === filterDepartment : true;
      
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

  const getDepartmentBadgeColor = (department) => {
    switch(department) {
      case 'Cardiology': return 'failure';
      case 'Emergency': return 'warning';
      case 'Neurology': return 'info';
      case 'Pediatrics': return 'success';
      default: return 'indigo';
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-gradient-to-r from-green-800 to-blue-600 py-4 px-8 mb-6">
        <h4 className="text-white font-bold flex items-center gap-2 text-lg">
          <FaUserMd className="w-5 h-5" /> Staff Management
        </h4>
        <Button onClick={toggleAddStaffForm} gradientDuoTone="greenToBlue" className="flex items-center gap-2">
            <FaUserPlus />
            Add Staff
          </Button>
      </div>

      <div className=" px-4 my-8">
        {/* Search and filter controls */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 pl-10 p-2.5 rounded-lg w-full"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 p-2.5 rounded-lg"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="">All Departments</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>

              <Button 
                color="light" 
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterDepartment('');
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Staff Form Modal */}
        <Modal show={isAddStaffFormOpen} onClose={toggleAddStaffForm} size="md" popup>
          <Modal.Header className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Full Name:</label>
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
                  <label className="block font-medium text-gray-700 mb-1">Department:</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Position:</label>
                  <input
                    type="text"
                    name="position"
                    placeholder="Job Position"
                    value={formData.position}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors duration-300"
                  />
                </div>
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
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" color="gray" onClick={toggleAddStaffForm}>
                  Cancel
                </Button>
                <Button type="submit" gradientDuoTone="greenToBlue">
                  {editingStaff ? 'Update Staff' : 'Save Staff'}
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
                Are you sure you want to delete this staff member?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => handleDeleteStaff(confirmDelete)}>
                  Yes, delete
                </Button>
                <Button color="gray" onClick={() => setConfirmDelete(null)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Staff table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : filteredStaff.length > 0 ? (
          <div className="mt-4">
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-700">
                    <th className="border-b border-gray-300 p-4 text-left">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => requestSort('name')}>
                        Staff
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
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => requestSort('department')}>
                        Department
                        <FaSort className="text-gray-400" />
                      </div>
                    </th>
                    <th className="border-b border-gray-300 p-4 text-left">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => requestSort('position')}>
                        Position
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
                  {filteredStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 border-b border-gray-200 transition-colors duration-200">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-bold">
                            {member.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-500">{member.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-lm text-gray-500">
                          <div>{member.email}</div>
                          <div className="text-gray-500">{member.contact}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge color={getDepartmentBadgeColor(member.department)} className="px-3 py-1.5">
                          {member.department}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-500">{member.position}</div>
                      </td>
                      <td className="p-4">
                        <Badge color={member.status === 'Active' ? 'success' : member.status === 'On Leave' ? 'warning' : 'gray'} className="px-3 py-1.5">
                          {member.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Tooltip content="Edit Staff">
                            <Button
                              onClick={() => handleEditButtonClick(member)}
                              color="warning"
                              size="xs"
                              className="px-3"
                            >
                              <FaEdit />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete Staff">
                            <Button
                              onClick={() => setConfirmDelete(member.id)}
                              color="failure"
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
              Showing {filteredStaff.length} of {staff.length} staff members
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <FaUserMd className="mx-auto" />
            </div>
            <p className="text-xl font-medium text-gray-500 mb-4">
              No staff members available
            </p>
            <p className="text-gray-500 mb-6">
              Add your first staff member by clicking the "Add Staff" button above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffPage;