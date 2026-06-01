import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState([]);

  const API_URL = "http://127.0.0.1:5000/tasks";

  const getTasks = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = async () => {
    if (task === "" || date === "") {
      alert("Please enter task name and due date");
      return;
    }

    const newTask = {
      task_name: task,
      due_date: date,
      status: "Pending",
    };

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    setTask("");
    setDate("");
    getTasks();
  };

  const changeStatus = async (item) => {
    const newStatus = item.status === "Pending" ? "Completed" : "Pending";

    await fetch(`${API_URL}/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    getTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    getTasks();
  };

  if (!loggedIn) {
    return (
      <div className="container">
        <div className="card">
          <h1>Smart Task Reminder</h1>

          <input type="email" placeholder="Enter Email" />
          <input type="password" placeholder="Enter Password" />

          <button onClick={() => setLoggedIn(true)}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Task Dashboard</h1>

        <input
          type="text"
          placeholder="Enter Task Name"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={addTask}>Add Task</button>

        <h2>My Tasks</h2>

        {tasks.map((item) => (
          <div key={item.id} className="task-item">
            <div>
              <strong>{item.task_name}</strong>
              <br />
              Due: {item.due_date}
              <br />
              Status: {item.status}
            </div>

            <div>
              <button
                onClick={() => changeStatus(item)}
                style={{
                  backgroundColor:
                    item.status === "Completed" ? "green" : "orange",
                  color: "white",
                  marginRight: "10px",
                }}
              >
                {item.status}
              </button>

              <button
                onClick={() => deleteTask(item.id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;