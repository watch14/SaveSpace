import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const getTodos = async () => {
      try {
        const data = await getDocs(collection(db, "todoList"));
        const filteredData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(filteredData);
        setTodos(filteredData);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    getTodos();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <p>{todo.title}</p>
            <p>{todo.description}</p>
            <p>{todo.done ? "✅" : "❌"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
