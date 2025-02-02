import React, { useState } from "react";
import { FaBoxOpen, FaTrash } from "react-icons/fa";
import { Modal, Button, Table, Label, TextInput } from "flowbite-react";

const Stock = () => {
  const [stockItems, setStockItems] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const setOpenModal = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleAddStock = (event) => {
    event.preventDefault();
    const newStock = {
      id: stockItems.length + 1,
      name: event.target.name.value,
      quantity: event.target.quantity.value,
      description: event.target.description.value,
      price: event.target.price.value,
      category: event.target.category.value,
    };
    setStockItems([...stockItems, newStock]);
    setIsFormOpen(false);
  };

  const handleDeleteStock = (id) => {
    setStockItems(stockItems.filter((item) => item.id !== id));
  };

  return (
    <>
      <h4 className="text-green-800 font-bold ml-8 flex items-center">
        <FaBoxOpen size={20} className="mr-2" /> / stock
      </h4>
      <div className="p-5 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Stock Management</h2>
            <Button onClick={setOpenModal} gradientDuoTone="greenToBlue">
              Add Stock
            </Button>
          </div>

          <Modal show={isFormOpen} onClose={setOpenModal} size="md">
            <Modal.Header>Add Stock</Modal.Header>
            <Modal.Body>
              <form onSubmit={handleAddStock}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price:</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
                  <select
                    name="category"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Injections">Injections</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" gradientDuoTone="greenToBlue">
                    Add
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>

          {stockItems.length > 0 && (
            <Table className="w-full mt-4 bg-gray-800 shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stockItems.map((stock) => (
                  <tr key={stock.id} className="border-t">
                    <td className="px-4 py-2">{stock.name}</td>
                    <td className="px-4 py-2">{stock.quantity}</td>
                    <td className="px-4 py-2">{stock.description}</td>
                    <td className="px-4 py-2">{stock.price}</td>
                    <td className="px-4 py-2">{stock.category}</td>
                    <td className="px-4 py-2">
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => handleDeleteStock(stock.id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
};

export default Stock;