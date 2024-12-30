import React, { useEffect, useState } from "react";
import axios from "axios";
import Task from "../Task/Task";
import Filters from "../Filters/Filters";

const Landing = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); 
  const [filter, setFilter] = useState("all");
  const cardsToShow = 3;

  const fetchTasks = async () => {
    try {
      const tokenResponse = await axios.post("/api/auth/token", {
        username: "testuser",
        password: "password123",
      });
      const token = tokenResponse.data.token;

      // Fetch tasks with the token and current filter
      const tasksResponse = await axios.get("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { status: filter },
      });
      setTasks(tasksResponse.data);
    } catch (err) {
      setError(err.message || "Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
    
    const intervalId = setInterval(fetchTasks, 3000); // Poll every 3 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [filter]);

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: newStatus } : task
      )
    );
  };

  const getCurrentPageTasks = () => {
    const start = currentPage * cardsToShow;
    const end = start + cardsToShow;
    return tasks.slice(start, end); // Get tasks for the current page
  };

  const scrollLeft = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1); // Move to the previous set of tasks
    }
  };

  const scrollRight = () => {
    if ((currentPage + 1) * cardsToShow < tasks.length) {
      setCurrentPage(prevPage => prevPage + 1); // Move to the next set of tasks
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-coally-dark-blue text-white text-center py-4">
        <h1 className="text-3xl font-bold">Task Manager (Coally)</h1>
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-col items-center p-8 relative">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-5xl overflow-hidden">
          {/* Card container */}
          <div className="flex justify-center gap-4"> {/* Center cards horizontally */}
            {getCurrentPageTasks().length > 0 ? (
              getCurrentPageTasks().map((task) => (
                <div
                  key={task.id}
                  className="transform transition-all hover:scale-110"
                  style={{
                    width: "300px",
                    height: "auto",
                    flexShrink: 0,  // Prevent the cards from shrinking
                  }}
                >
                  <Task task={task} onStatusChange={handleStatusChange} />
                </div>
              ))
            ) : (
              <p>{error ? error : "Loading tasks..."}</p>
            )}
          </div>
        </div>

        {/* Scroll buttons */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <button
            onClick={scrollLeft}
            className="bg-coally-orange text-white p-4 rounded-full shadow-lg"
          >
            &#60;
          </button>
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <button
            onClick={scrollRight}
            className="bg-coally-orange text-white p-4 rounded-full shadow-lg"
          >
            &#62;
          </button>
        </div>
      </div>

      {/* Fixed bottom filter bar */}
      <Filters onFilterChange={setFilter} onCreateNewTask={() => {}} />
    </div>
  );
};

export default Landing;
