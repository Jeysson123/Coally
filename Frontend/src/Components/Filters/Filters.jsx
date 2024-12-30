import React, { useState } from "react";
import axios from "axios";
import pendingImage from "../../assets/pendingButton.png";
import completeImage from "../../assets/completeButton.png";
import allImage from "../../assets/allButton.png";
import newTaskImage from "../../assets/newTaskButton.png";

const Filters = ({ onFilterChange, onCreateNewTask }) => {
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [token, setToken] = useState("");

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleCreateNewTask = async () => {
    setShowModal(true);
    try {
      if (!token) {
        const tokenResponse = await axios.post("/api/auth/token", {
          username: "testuser",
          password: "password123",
        });
        setToken(tokenResponse.data.token);
      }
    } catch (err) {
      console.error("Error fetching token:", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (title && description) {
      try {
        const response = await axios.post(
          "/api/tasks",
          { title, description },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newTask = response.data;
        onCreateNewTask(newTask);

        setShowModal(false);
        setTitle("");
        setDescription("");
      } catch (error) {
        console.error("Error creating task:", error);
        alert("Failed to create task. Please try again.");
      }
    } else {
      alert("Please fill in both fields.");
    }
  };

  return (
    <div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-coally-dark-blue shadow-lg flex justify-between items-center rounded-t-xl">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2 ${
              filter === "pending"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-600 hover:text-white`}
            onClick={() => handleFilterChange("pending")}
          >
            <img src={pendingImage} alt="Pending" className="w-5 h-5" />
            <span>Pending</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2 ${
              filter === "complete"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-green-600 hover:text-white`}
            onClick={() => handleFilterChange("complete")}
          >
            <img src={completeImage} alt="Complete" className="w-5 h-5" />
            <span>Complete</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2 ${
              filter === "all"
                ? "bg-gray-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-gray-600 hover:text-white`}
            onClick={() => handleFilterChange("all")}
          >
            <img src={allImage} alt="All" className="w-5 h-5" />
            <span>All</span>
          </button>
        </div>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center space-x-2"
          onClick={handleCreateNewTask}
        >
          <img src={newTaskImage} alt="New Task" className="w-5 h-5" />
          <span>New Task</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Create New Task</h2>
            <form onSubmit={handleSubmitTask}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg flex items-center space-x-2"
                >
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center space-x-2"
                >
                  <span>Submit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
