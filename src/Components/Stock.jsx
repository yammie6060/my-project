import React, { useState } from "react";
import { FaBoxOpen, FaTrash, FaPlus } from "react-icons/fa";
import { Modal, Button, Table, Badge } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Stock = () => {
  const [stockItems, setStockItems] = useState([
    {
      id: 1,
      name: "Paracetamol",
      quantity: 150,
      description: "Pain reliever",
      price: 5.99,
      category: "Tablets",
      status: "In Stock"
    },
    {
      id: 2,
      name: "Amoxicillin",
      quantity: 75,
      description: "Antibiotic",
      price: 12.50,
      category: "Capsules",
      status: "Low Stock"
    },
    {
      id: 3,
      name: "Insulin",
      quantity: 30,
      description: "Diabetes medication",
      price: 45.00,
      category: "Injections",
      status: "In Stock"
    }
  ]);
  
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    description: '',
    price: '',
    category: '',
    status: 'In Stock'
  });

  const setOpenModal = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) {
      setFormData({
        name: '',
        quantity: '',
        description: '',
        price: '',
        category: '',
        status: 'In Stock'
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddStock = (event) => {
    event.preventDefault();
    const newStock = {
      id: stockItems.length + 1,
      name: formData.name,
      quantity: formData.quantity,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      status: formData.quantity > 50 ? 'In Stock' : 'Low Stock'
    };
    setStockItems([...stockItems, newStock]);
    setIsFormOpen(false);
  };

  const handleDeleteStock = (id) => {
    setStockItems(stockItems.filter((item) => item.id !== id));
    setConfirmDelete(null);
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'In Stock': return 'green';
      case 'Low Stock': return 'yellow';
      case 'Out of Stock': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between bg-gradient-to-r from-teal-600 to-blue-600 py-4 px-8 mb-6">
        <h4 className="text-white font-bold flex items-center gap-2 text-lg">
          <FaBoxOpen className="w-5 h-5" /> Stock Management
        </h4>
        <Button onClick={setOpenModal} gradientDuoTone="greenToBlue" className="flex items-center gap-2">
            <FaPlus />
            Add Stock
          </Button>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 my-8">

        {/* Add Stock Modal */}
        <Modal show={isFormOpen} onClose={setOpenModal} size="md" popup>
          <Modal.Header className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
            Add New Stock Item
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddStock} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Item name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  placeholder="Quantity"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Description:</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Description"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="Price"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Category:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Tablets">Tablets</option>
                  <option value="Capsules">Capsules</option>
                  <option value="Injections">Injections</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" color="gray" onClick={setOpenModal}>
                  Cancel
                </Button>
                <Button type="submit" gradientDuoTone="greenToBlue" className="flex items-center gap-2">
                  Add Item
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
                Are you sure you want to delete this item?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => handleDeleteStock(confirmDelete)}>
                  Yes, delete
                </Button>
                <Button color="gray" onClick={() => setConfirmDelete(null)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Stock Table */}
        {stockItems.length > 0 ? (
          <div className="mt-4">
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <Table hoverable className="w-full">
                <Table.Head className="bg-gradient-to-r from-teal-700 to-blue-700 text-white">
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Quantity</Table.HeadCell>
                  <Table.HeadCell>Description</Table.HeadCell>
                  <Table.HeadCell>Price</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {stockItems.map((stock) => (
                    <Table.Row key={stock.id} className="hover:bg-gray-50">
                      <Table.Cell className="font-medium text-gray-900">
                        {stock.name}
                      </Table.Cell>
                      <Table.Cell>{stock.quantity}</Table.Cell>
                      <Table.Cell>{stock.description}</Table.Cell>
                      <Table.Cell>MWK{stock.price.toFixed(2)}</Table.Cell>
                      <Table.Cell>{stock.category}</Table.Cell>
                      <Table.Cell>
                        <Badge color={getStatusBadgeColor(stock.status)}>
                          {stock.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => setConfirmDelete(stock.id)}
                        >
                          <FaTrash className="mr-1" /> Delete
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <div className="mt-4 text-sm text-gray-500 text-right">
              Showing {stockItems.length} items
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <FaBoxOpen className="mx-auto" />
            </div>
            <p className="text-xl font-medium text-gray-500 mb-4">
              No stock items available
            </p>
            <p className="text-gray-500 mb-6">
              Add your first stock item by clicking the "Add Stock" button above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;