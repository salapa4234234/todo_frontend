import axios from "../config/axios";

export const fetchAllTodos = async () => {
  return await axios.get("/todos");
};
