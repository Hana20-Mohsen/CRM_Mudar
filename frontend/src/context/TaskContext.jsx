import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export const TaskContext = createContext();

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { user } = useContext(AuthContext);

  function getAuthHeader() {
    const user = JSON.parse(localStorage.getItem("user"));

    const token = localStorage.getItem("token");

    if (!token) return {};

    const role = user?.role;
    const authType = role === "admin" ? "admin" : "Bearer";

    return {
      Authorization: `${authType} ${token}`,
    };
  }

  function getAuthData() {
    const token = localStorage.getItem("token");

    if (!token || !user) return null;
    const role = user.role || "user";
    const auth = role === "admin" ? "admin" : "Bearer";
    return { token, auth };
  }

  // Redirect user to login if not logged in
  useEffect(() => {
    if (!user) {
      // navigate("/login");
      // console.log("not a user")
    } else {
      getTasks();
    }
  }, [user]);

  async function getTasks() {
    const authData = getAuthData();
    if (!authData) return;

    try {
      console.log(authData.auth, authData.token)
      const res = await api.get("/api/v1/task/done", {
        headers: {
          Authorization: `${authData.auth} ${authData.token}`,
        },
      });
      setTasks(res.data.tasks || []);
      return res.data.tasks || [];
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }

  async function EditTasks(taskId, updatedData) {
    const authData = getAuthData();
    if (!authData) return;

    const isFormData = updatedData instanceof FormData;
    const headers = {
      Authorization: `${authData.auth} ${authData.token}`,
    };

    if (isFormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    try {
      await api.put(`/api/v1/task/edit/${taskId}`, updatedData, {
        headers: headers,
      });
      getTasks();
    } catch (err) {
      console.error("Error editing task:", err);
    }
  }

  async function DeleteTasks(taskId) {
    const authData = getAuthData();
    if (!authData) return;

    try {
      await api.delete(`/api/v1/task/delete/${taskId}`, {
        headers: {
          Authorization: `${authData.auth} ${authData.token}`,
        },
      });
      getTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }

  async function AddTask(data) {
    const authData = getAuthData();
    if (!authData) return;

    try {
      console.log(data)
      const res = await api.post(`/api/v1/task/add`, data, {
        headers: {
          Authorization: `${authData.auth} ${authData.token}`,
        },
      });

      if (res.data.task) setTasks(prev => [...prev, res.data.task]);
      getTasks()
    } catch (err) {
      console.error("Error adding task:", err);
    }
  }


  async function AssignTask(data) {
    const authData = getAuthData();
    if (!authData) return;

    try {
      let { Authorization } = getAuthHeader();
      const response = await api.post(`/api/v1/task/create-by-admin`, data, {
        headers: {
          Authorization,
          "Content-Type": "multipart/form-data"
        }
      });
      console.log(`response : `, response);

      console.log(response?.data);
      return response?.data

    } catch (err) {
      console.log(err);
      const message =
        err?.response?.data?.message || "Something went wrong";

      toast.error(message);
    }
  }

  async function getAllAssignedTasks(boardId) {
    try {
      const response = await api.get(`/api/v1/assignedTasks/all/${boardId}`, {
        headers: getAuthHeader()
      });
      console.log(response?.data?.assignedTasks);
      return response?.data?.assignedTasks

    } catch (err) {
      console.error("Error fetching tasks:", err);
    }

  }
  async function getAssignedTasksByEmpId(boardId) {
    try {
      const response = await api.get(`/api/v1/assignedTasks/byEmpId/${boardId}`, {
        headers: getAuthHeader()
      });
      console.log(response?.data?.assignedTasks);
      return response?.data?.assignedTasks

    } catch (err) {
      console.error("Error fetching tasks:", err);
    }

  }
  // update listId after movement 


const updateTaskList = async (taskId, listId,changedListId) => {

  try {

    const response = await api.patch(
      `/api/v1/task/moveTask/${taskId}`,
      { listId ,changedListId},
      {
        headers: getAuthHeader()
      }
    );

    console.log(response?.data?.updatedTask);

    return response?.data?.updatedTask;

  } catch (err) {

    console.error("Error updating task:", err);
    throw err;

  }

};

  const reorderTasks = async (sourceListId, destinationListId, sourceTasks, destinationTasks, taskId) => {
    try {
      const response = await api.put(
        `/api/v1/list/reorder`,
        { sourceListId, destinationListId, sourceTasks, destinationTasks, taskId },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (err) {
      console.error("Error reordering tasks:", err);
      throw err;
    }
  };
  return (
    <TaskContext.Provider
      value={{
        tasks, setTasks, getTasks, EditTasks, DeleteTasks, AddTask,
        AssignTask,
        getAllAssignedTasks,
        getAssignedTasksByEmpId,
        updateTaskList,
        reorderTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;
