import React, { useState, useEffect } from "react";
import { 
  FaEnvelope, FaTrash, FaSearch, FaPaperPlane, 
  FaStar, FaRegStar, FaTags, FaExclamationCircle, 
  FaSort, FaFilter, FaPencilAlt
} from "react-icons/fa";
import { Modal, Button, Table, Badge, Spinner, Tooltip } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const EmailsPage = () => {
  const [emails, setEmails] = useState([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isViewEmailOpen, setIsViewEmailOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    body: '',
  });

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Add sample emails for demonstration
      if (emails.length === 0) {
        setEmails([]);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleComposeEmail = () => {
    setIsComposeOpen(!isComposeOpen);
    if (!isComposeOpen) {
      setFormData({
        to: '',
        subject: '',
        body: '',
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

  const handleSendEmail = (event) => {
    event.preventDefault();
    const newEmail = {
      id: emails.length + 1,
      to: formData.to,
      subject: formData.subject,
      body: formData.body,
      date: new Date().toLocaleString(),
      starred: false,
      read: true
    };
    setEmails([newEmail, ...emails]);
    setIsComposeOpen(false);
  };

  const handleDeleteEmail = (id) => {
    setEmails(emails.filter(email => email.id !== id));
    setConfirmDelete(null);
  };

  const toggleStar = (id) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };

  const viewEmail = (email) => {
    setCurrentEmail(email);
    // Mark as read when viewed
    if (!email.read) {
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      ));
    }
    setIsViewEmailOpen(true);
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort emails
  const filteredEmails = emails
    .filter(email => {
      const matchesSearch = 
        email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.body.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.direction === 'ascending' 
          ? dateA - dateB 
          : dateB - dateA;
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="min-h-screen">
      <div className="flex justify-between bg-gradient-to-r from-teal-600 to-blue-600 py-4 px-8 mb-6">
        <h4 className="text-white font-bold flex items-center gap-2 text-lg">
          <FaEnvelope className="w-5 h-5" /> Email Management
        </h4>
          <Button onClick={toggleComposeEmail} gradientDuoTone="greenToBlue" className="flex items-center gap-2">
          <FaPaperPlane />
          Compose Email          
          </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 my-6">

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
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
          </div>
        </div>

        {/* Compose Email Modal */}
        <Modal show={isComposeOpen} onClose={toggleComposeEmail} size="lg" popup>
          <Modal.Header className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
            Compose New Email
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">To:</label>
                <input
                  type="email"
                  name="to"
                  placeholder="Enter recipient email"
                  value={formData.to}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Subject:</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter email subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Message:</label>
                <textarea
                  name="body"
                  placeholder="Enter your message"
                  value={formData.body}
                  onChange={handleFormChange}
                  required
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                
                <Button type="submit" gradientDuoTone="greenToBlue">
                  <FaPaperPlane />
                  Send Email
                </Button>
                <Button color="gray" onClick={toggleComposeEmail} className="flex items-center gap-2">
                  Cancel
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {/* View Email Modal */}
        <Modal show={isViewEmailOpen} onClose={() => setIsViewEmailOpen(false)} size="lg">
          <Modal.Header className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
            View Email
          </Modal.Header>
          <Modal.Body>
            {currentEmail && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{currentEmail.subject}</h3>
                    <div className="text-gray-600 mb-1">To: {currentEmail.to}</div>
                    <div className="text-gray-500 text-sm">{currentEmail.date}</div>
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 my-4">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-800">{currentEmail.body}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button color="gray" onClick={() => setIsViewEmailOpen(false)}>
                    Close
                  </Button>
                  <Button gradientDuoTone="tealToBlue" onClick={toggleComposeEmail}>
                    <FaEnvelope className="mr-2" /> Reply
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
        
        {/* Confirm Delete Modal */}
        <Modal show={confirmDelete !== null} size="sm" popup onClose={() => setConfirmDelete(null)}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                Are you sure you want to delete this email?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => handleDeleteEmail(confirmDelete)}>
                  Yes, delete
                </Button>
                <Button color="gray" onClick={() => setConfirmDelete(null)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Email table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : filteredEmails.length > 0 ? (
          <div className="mt-4">
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-teal-700 to-blue-700 text-white">
                    <th className="border-b border-gray-300 p-4 text-left w-10"></th>
                    <th className="border-b border-gray-300 p-4 text-left">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => requestSort('to')}>
                        To
                        <FaSort className="text-gray-400" />
                      </div>
                    </th>
                    <th className="border-b border-gray-300 p-4 text-left">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => requestSort('subject')}>
                        Subject
                        <FaSort className="text-gray-400" />
                      </div>
                    </th>
                    <th className="border-b border-gray-300 p-4 text-left">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => requestSort('date')}>
                        Date
                        <FaSort className="text-gray-400" />
                      </div>
                    </th>
                    <th className="border-b border-gray-300 p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmails.map((email) => (
                    <tr 
                      key={email.id} 
                      className={`hover:bg-gray-50 border-b border-gray-200 transition-colors duration-200 ${!email.read ? 'font-semibold bg-blue-50' : ''}`}
                    >
                      <td className="p-4">
                        <button 
                          onClick={() => toggleStar(email.id)} 
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                          {email.starred ? (
                            <FaStar className="text-yellow-500" />
                          ) : (
                            <FaRegStar />
                          )}
                        </button>
                      </td>
                      <td className="p-4" onClick={() => viewEmail(email)}>
                        <div className="cursor-pointer">{email.to}</div>
                      </td>
                      <td className="p-4" onClick={() => viewEmail(email)}>
                        <div className="cursor-pointer flex items-center">
                          {!email.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          )}
                          {email.subject}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {email.date}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Tooltip content="View Email">
                            <Button
                              onClick={() => viewEmail(email)}
                              color="blue"
                              size="xs"
                              className="px-3"
                            >
                              <FaEnvelope />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete Email">
                            <Button
                              onClick={() => setConfirmDelete(email.id)}
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
              Showing {filteredEmails.length} of {emails.length} emails
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <FaEnvelope className="mx-auto" />
            </div>
            <p className="text-xl font-medium text-gray-500 mb-4">
              No emails available
            </p>
            <p className="text-gray-500 mb-6">
              Send your first email by clicking the "Compose Email" button above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailsPage;