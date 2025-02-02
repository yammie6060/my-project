import React, { useState } from "react";
import { FaUsers, FaTrash, FaEdit } from "react-icons/fa";
import { Modal, Button, Table } from "flowbite-react";

const StaffPage = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [isAddStaffFormOpen, setIsAddStaffFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const toggleAddStaffForm = () => {
    setIsAddStaffFormOpen(!isAddStaffFormOpen);
    setEditingStaff(null); };

  const handleAddStaff = (event) => {
    event.preventDefault();
    const newStaff = {
      id: staffMembers.length + 1,
      name: event.target.name.value,
      position: event.target.position.value,
      department: event.target.department.value,
      contactNumber: event.target.contactNumber.value,
    };
    setStaffMembers([...staffMembers, newStaff]);
    setIsAddStaffFormOpen(false);
  };

  const handleEditStaff = (event) => {
    event.preventDefault();
    const updatedStaff = {
      id: editingStaff.id,
      name: event.target.name.value,
      position: event.target.position.value,
      department: event.target.department.value,
      contactNumber: event.target.contactNumber.value,
    };
    setStaffMembers(staffMembers.map(staff => staff.id === updatedStaff.id ? updatedStaff : staff));
    setIsAddStaffFormOpen(false);
    setEditingStaff(null);
  };

  const handleDeleteStaff = (id) => {
    setStaffMembers(staffMembers.filter((staff) => staff.id !== id));
  };

  const handleEditButtonClick = (staff) => {
    setEditingStaff(staff);
    setIsAddStaffFormOpen(true);
  };

  return (
    <>
      <div className="min-h-screen">
            <h4 className="text-green-800 ml-8 font-bold flex items-center gap-2">
              <FaUsers className="w-5 h-5" /> / Staff
            </h4>
      <div className="p-1 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
            <Button onClick={toggleAddStaffForm} gradientDuoTone="greenToBlue">
              Add Staff
            </Button>
          </div>

          {isAddStaffFormOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Modal show={isAddStaffFormOpen} onClose={toggleAddStaffForm} size="md">
                <Modal.Header>{editingStaff ? "Edit Staff" : "Add Staff"}</Modal.Header>
                <Modal.Body>
                  <form onSubmit={editingStaff ? handleEditStaff : handleAddStaff}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        required
                        defaultValue={editingStaff ? editingStaff.name : ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position:</label>
                      <input
                        type="text"
                        name="position"
                        placeholder="Enter job position"
                        required
                        defaultValue={editingStaff ? editingStaff.position : ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                      <select
                        name="department"
                        required
                        defaultValue={editingStaff ? editingStaff.department : ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select professional</option>
                        <option value="Pharmacist">Pharmacist</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Doctor">Doctor</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number:</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        placeholder="Enter contact number"
                        required
                        defaultValue={editingStaff ? editingStaff.contactNumber : ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" gradientDuoTone="greenToBlue">
                        {editingStaff ? "Save Changes" : "Add"}
                      </Button>
                    </div>
                  </form>
                </Modal.Body>
              </Modal>
            </div>
          )}

          {staffMembers.length > 0 ? (
            <Table className="w-full mt-4 bg-white shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Position</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((staff) => (
                  <tr key={staff.id} className="border-t">
                    <td className="px-4 py-2">{staff.name}</td>
                    <td className="px-4 py-2">{staff.position}</td>
                    <td className="px-4 py-2">{staff.department}</td>
                    <td className="px-4 py-2">{staff.contactNumber}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <Button
                        color="warning"
                        size="xs"
                        onClick={() => handleEditButtonClick(staff)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => handleDeleteStaff(staff.id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 mt-4">No staff members available.</p>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default StaffPage;