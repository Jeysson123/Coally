import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setError } from "../../Actions/TaskAction";
import completedImage from "../../assets/completed.png";
import pendingImage from "../../assets/pending.png";
import editIcon from "../../assets/editicon.png";
import deleteIcon from "../../assets/deleteicon.png";

const Task = ({ task, onStatusChange }) => {
  const dispatch = useDispatch();
  const { id, title, description, createdAt, completed: initialStatus } = task;
  const [status, setStatus] = useState(initialStatus);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedStatus, setUpdatedStatus] = useState(initialStatus);
  const [error, setError] = useState(null);

  const fetchToken = async () => {
    try {
      const response = await axios.post("/api/auth/token", {
        username: "testuser",
        password: "password123",
      });
      return response.data.token;
    } catch (err) {
      setError(err.message || "Failed to fetch token");
      return null;
    }
  };

  const handleStatusChange = async () => {
    const token = await fetchToken();
    if (!token) return;

    try {
      const newStatus = !status;
      await axios.put(
        `/api/tasks/${id}`,
        { ...task, completed: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatus(newStatus);
      //onStatusChange(id, newStatus);
    } catch (err) {
      dispatch(setError(err.message || "Failed to update status"));
    }
  };

  const handleDelete = async () => {
    const token = await fetchToken();
    if (!token) return;

    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Task deleted", id);
    } catch (err) {
      dispatch(setError(err.message || "Failed to delete task"));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = await fetchToken();
    if (!token) return;

    try {
      await axios.put(
        `/api/tasks/${id}`,
        {
          title: updatedTitle,
          description: updatedDescription,
          completed: updatedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsEditing(false);
      setStatus(updatedStatus);
    } catch (err) {
      dispatch(setError(err.message || "Failed to update task"));
    }
  };

  return (
    <div className="relative flex-none w-64 h-80 bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className={`h-24 ${status ? 'bg-green-200' : 'bg-yellow-200'}`}>
        <img
          src={status ? completedImage : pendingImage}
          alt={status ? "Completed" : "Pending"}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <label htmlFor={`toggle-${id}`} className="inline-flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                id={`toggle-${id}`}
                checked={status}
                onChange={handleStatusChange}
                className="hidden"
              />
              <div className="toggle-path bg-gray-300 w-12 h-6 rounded-full"></div>
              <div className={`toggle-dot absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all ${status ? 'translate-x-6 bg-green-500' : ''}`}></div>
            </div>
            <span className={`ml-2 text-sm ${status ? "text-green-500" : "text-yellow-500"}`}>{status ? "Completed" : "Pending"}</span>
          </label>
        </div>
        <p className="text-gray-500 text-sm">{description}</p>
        <p className="text-gray-500 text-sm">Created: {new Date(createdAt).toLocaleDateString()}</p>
      </div>

      <div className="flex justify-around p-4 bg-gray-100">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
          onClick={() => setIsEditing(true)}
        >
          <img src={editIcon} alt="Edit" className="w-5 h-5 mr-2" />
          Edit
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
          onClick={handleDelete}
        >
          <img src={deleteIcon} alt="Delete" className="w-5 h-5 mr-2" />
          Delete
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleUpdate} className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Edit Task</h3>

              <div className="mb-4">
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  title="Title" // Tooltip for the Title field
                />
              </div>

              <div className="mb-4">
                <textarea
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  title="Description" // Tooltip for the Description field
                ></textarea>
              </div>

              <div className="mb-4">
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value === "true")}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  title="Status" // Tooltip for the Status field
                >
                  <option value="false">Pending</option>
                  <option value="true">Completed</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full sm:w-auto"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Task;
