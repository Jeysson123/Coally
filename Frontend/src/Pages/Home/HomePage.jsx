import React from "react";
import { useSelector } from "react-redux";
import Landing from "../../Components/Landing/Landing";

const HomePage = () => {
    
  const tasks = useSelector(state => state.tasksData.tasks);

  return (
    <div>
      <Landing tasks={tasks} />
    </div>
  );
};

export default HomePage;
