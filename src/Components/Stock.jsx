import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { Modal, Button, Table, Badge, TextInput, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Stock = () => {
  const [stockItems, setStockItems] = useState([]);
  
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter stock items based on search term
  const filteredItems = stockItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleAddStock = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStock = {
        id: stockItems.length + 1,
        name: formData.name,
        quantity: parseInt(formData.quantity),
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        status: formData.quantity > 50 ? 'In Stock' : (formData.quantity > 0 ? 'Low Stock' : 'Out of Stock')
      };
      
      setStockItems([newStock, ...stockItems]);
      setIsFormOpen(false);
      toast.success(`${newStock.name} added successfully!`);
      
      onStockAdded(newStock);
      
    } catch (error) {
      toast.error('Failed to add stock item');
    } finally {
      setIsLoading(false);
    }
  };

  const onStockAdded = (newStock) => {
    console.log('New stock added:', newStock);

  };

  const handleDeleteStock = async (id) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const itemToDelete = stockItems.find(item => item.id === id);
      setStockItems(stockItems.filter((item) => item.id !== id));
      setConfirmDelete(null);
      toast.info(`${itemToDelete.name} deleted successfully`);
      
    } catch (error) {
      toast.error('Failed to delete stock item');
    } finally {
      setIsLoading(false);
    }
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
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 py-4 px-8 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h4 className="text-white font-bold flex items-center gap-2 text-lg">
            <FaBoxOpen className="w-5 h-5" /> Stock Management
          </h4>
          <Button onClick={setOpenModal} gradientDuoTone="greenToBlue" className="flex items-center gap-2">
            <FaPlus />
            Add Stock
          </Button>
        </div>
      </div>
      
      <div className=" px-4 my-8">
        {/* Search Bar */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
            <TextInput
              type="text"
              placeholder="Search by name, description or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg--gray-50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
  />
          </div>
        </div>

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
                  min="0"
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
                <label className="block font-medium text-gray-700 mb-1">Price (MWK):</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
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
                <Button type="submit" gradientDuoTone="greenToBlue" className="flex items-center gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Adding...
                    </>
                  ) : (
                    'Add Item'
                  )}
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
                <Button color="failure" onClick={() => handleDeleteStock(confirmDelete)} disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : 'Yes, delete'}
                </Button>
                <Button color="gray" onClick={() => setConfirmDelete(null)} disabled={isLoading}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Stock Table */}
        {isLoading && !isFormOpen && !confirmDelete ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="mt-4">
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <Table hoverable className="w-full">
                <Table.Head className="bg-gradient-to-r from-teal-700 to-blue-700 text-white">
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Quantity</Table.HeadCell>
                  <Table.HeadCell>Description</Table.HeadCell>
                  <Table.HeadCell>Price (MWK)</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {filteredItems.map((stock) => (
                    <Table.Row key={stock.id} className="hover:bg-gray-50">
                      <Table.Cell className="font-medium text-gray-900">
                        {stock.name}
                      </Table.Cell>
                      <Table.Cell>{stock.quantity}</Table.Cell>
                      <Table.Cell className="max-w-xs truncate">{stock.description}</Table.Cell>
                      <Table.Cell>{stock.price.toFixed(2)}</Table.Cell>
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
                          disabled={isLoading}
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
              Showing {filteredItems.length} of {stockItems.length} items
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <FaBoxOpen className="mx-auto" />
            </div>
            <p className="text-xl font-medium text-gray-500 mb-4">
              {searchTerm ? 'No matching items found' : 'No stock items available'}
            </p>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try a different search term' : 'Add your first stock item using the button above'}
            </p>
            {!searchTerm && (
              <Button onClick={setOpenModal} gradientDuoTone="tealToBlue">
                <FaPlus className="mr-2" /> Add Your First Item
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;