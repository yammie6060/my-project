import React, { useState } from "react";
import { FaEnvelope, FaTrash } from "react-icons/fa";
import { Modal, Button, Table } from "flowbite-react";

const EmailsPage = () => {
  const [emails, setEmails] = useState([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const toggleComposeEmail = () => {
    setIsComposeOpen(!isComposeOpen);
  };

  const handleSendEmail = (event) => {
    event.preventDefault();
    const newEmail = {
      id: emails.length + 1,
      to: event.target.to.value,
      subject: event.target.subject.value,
      body: event.target.body.value,
      date: new Date().toLocaleString()
    };
    setEmails([...emails, newEmail]);
    setIsComposeOpen(false);
  };

  const handleDeleteEmail = (id) => {
    setEmails(emails.filter(email => email.id !== id));
  };

  return (
    <>
      <h4 className="text-green-800 ml-8 font-bold flex items-center">
        <FaEnvelope size={20} className="mr-2 " /> / Email
      </h4>
      <div className="p-5 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Email Management</h2>
            <Button onClick={toggleComposeEmail} gradientDuoTone="greenToBlue">
              Compose Email
            </Button>
          </div>

          {isComposeOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Modal show={isComposeOpen} onClose={toggleComposeEmail} size="md">
                <Modal.Header>Compose New Email</Modal.Header>
                <Modal.Body>
                  <form onSubmit={handleSendEmail}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                      <input
                        type="email"
                        name="to"
                        placeholder="Enter recipient email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                      <input
                        type="text"
                        name="subject"
                        placeholder="Enter email subject"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                      <textarea
                        name="body"
                        placeholder="Enter your message"
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="submit" gradientDuoTone="greenToBlue">
                        Send
                      </Button>
                      <Button gradientDuoTone="redToYellow" onClick={toggleComposeEmail}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Modal.Body>
              </Modal>
            </div>
          )}

          {emails.length > 0 ? (
            <Table className="w-full mt-4 bg-white shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2">To</th>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-4 py-2">Message</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => (
                  <tr key={email.id} className="border-t">
                    <td className="px-4 py-2">{email.to}</td>
                    <td className="px-4 py-2">{email.subject}</td>
                    <td className="px-4 py-2">{email.body.substring(0, 50)}...</td>
                    <td className="px-4 py-2">{email.date}</td>
                    <td className="px-4 py-2">
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => handleDeleteEmail(email.id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 mt-4">No emails available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default EmailsPage;