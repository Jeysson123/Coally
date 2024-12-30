import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setTasks, setError, setFilter, setCurrentPage } from "../../Actions/TaskAction";
import Task from "../Task/Task";
import Filters from "../Filters/Filters";

const Landing = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasksData.tasks);
  const filter = useSelector((state) => state.tasksData.filter);
  const currentPage = useSelector((state) => state.tasksData.currentPage);
  const error = useSelector((state) => state.tasksData.error);
  const cardsToShow = 3;

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const tokenResponse = await axios.post("/api/auth/token", {
        username: "testuser",
        password: "password123",
      });
      const token = tokenResponse.data.token;

      const tasksResponse = await axios.get("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { status: filter }, // Fetch tasks based on the current filter
      });
      dispatch(setTasks(tasksResponse.data));
    } catch (err) {
      dispatch(setError(err.message || "Failed to fetch tasks"));
    }
  };

  useEffect(() => {
    if (!filter) {
      dispatch(setFilter("all")); // Ensure the default filter is set
    }
    fetchTasks(); // Fetch tasks when the filter changes
    const intervalId = setInterval(fetchTasks, 3000); // Poll every 3 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [filter]);

  // Get tasks for the current page
  const getCurrentPageTasks = () => {
    const filteredTasks =
      filter === "all"
        ? tasks
        : tasks.filter((task) =>
            filter === "completed" ? task.completed : !task.completed
          );
    const start = currentPage * cardsToShow;
    const end = start + cardsToShow;
    return filteredTasks.slice(start, end);
  };

  // Pagination handlers
  const scrollLeft = () => {
    if (currentPage > 0) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const scrollRight = () => {
    if ((currentPage + 1) * cardsToShow < tasks.length) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-coally-dark-blue text-white text-center py-4">
        <h1 className="text-3xl font-bold">Task Manager (Coally)</h1>
      </div>

      <div className="flex-grow flex flex-col items-center p-8 relative">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-5xl overflow-hidden">
          <div className="flex justify-center gap-4">
            {getCurrentPageTasks().length > 0 ? (
              getCurrentPageTasks().map((task) => (
                <div
                  key={task.id}
                  className="transform transition-all hover:scale-110"
                  style={{ width: "300px", height: "auto", flexShrink: 0 }}
                >
                  <Task task={task} />
                </div>
              ))
            ) : (
              <p>{error ? error : "Loading tasks..."}</p>
            )}
          </div>
        </div>

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

      <Filters
        onFilterChange={(newFilter) => dispatch(setFilter(newFilter))}
        filter={filter}
      />
    </div>
  );
};

export default Landing;
