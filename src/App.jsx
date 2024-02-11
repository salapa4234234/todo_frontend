import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import axios from "./config/axios";

import "./app.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editTask, setEditTask] = useState("");
  console.log("edit", editTask);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task === "") {
      alert("You can't submit data without data");
      return;
    }

    try {
      await axios.post("/api/todos", {
        task,
        completed: false,
      });

      // Reload data after successful submission
      getAllTodos();
      setTask(""); // Clear the input field
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      getAllTodos();
    } catch {
      console.log("errro");
    }
  };
  const handleChecked = async (data) => {
    try {
      await axios.patch(`/api/todos/${data?.id}`, {
        completed: !data?.completed,
        is_editing: data?.is_editing,
        task: data?.task,
      });
      getAllTodos();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (data) => {
    const response = await axios.get(`/api/todos/${data?.id}`);
    setEditTask(response?.data[0]?.task);
    if (response.data[0].task) {
      try {
        await axios.patch(`/api/todos/${data?.id}`, {
          task: data?.task,
          completed: data?.completed,
          is_editing: true,
        });
        getAllTodos();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmits = async (data) => {
    await axios.patch(`/api/todos/${data?.id}`, {
      task: editTask,
      is_editing: false,
    });
    getAllTodos();
  };

  const getAllTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
      console.log("todos", response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <div className="container">
      <h1>Todo App</h1>
      <div className="todo_form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(e) => setTask(e.target.value)}
            value={task}
          />
          <button type="submit">Add</button>
        </form>
        <div className="todo_list">
          <ul>
            {todos?.map((data) => (
              <li key={data.id}>
                <input
                  type="checkbox"
                  checked={data?.completed}
                  onChange={() => handleChecked(data)}
                />
                {data?.is_editing ? (
                  <>
                    <input
                      type="text"
                      className="editing"
                      onChange={(e) => setEditTask(e.target.value)}
                      value={editTask}
                    />
                    <div
                      className="edit-save"
                      onClick={() => handleSubmits(data)}>
                      <FaRegSave />
                    </div>
                  </>
                ) : (
                  <span className={`${data?.completed ? "strike" : ""}`}>
                    {data?.task}
                  </span>
                )}

                <button onClick={() => handleDelete(data.id)}>
                  <MdDelete />
                </button>
                {/* <button onClick={() => handleEdit(data)}>
                  <MdEdit />
                </button> */}
                {!data?.is_editing && (
                  <button onClick={() => handleEdit(data)}>
                    <MdEdit />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
