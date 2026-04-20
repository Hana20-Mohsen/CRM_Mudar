import React, { useState, useContext , useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import Modal from "../common/Modal";
import TaskForm from "../forms/TaskForm";
import TaskDetailModal from "../components/TaskDetailModal";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import styles from './styles.module.css'
import { useQuery, useQueryClient } from "@tanstack/react-query";
function TasksPage() {
  const { toggleSidebar } = useOutletContext();
  const queryClient = useQueryClient();
  const emptyTask = {
    title: '',
    status: 'Pending',
    priority: 'Medium',
    description: '',
    dueDate: ''
  };
  const { AddTask, EditTasks, DeleteTasks, getTasks, setTasks } = useContext(TaskContext);

  const { data: tasks, error, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
    useEffect(() => {
      console.log(tasks);
    }, []);
  // State for Modal and Search
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // Used for deciding if we are creating new or editing
  const [formData, setFormData] = useState(emptyTask);

  // State for Detail View Modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter logic
  const filteredTasks = tasks?.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    try {
      if (editing) {
        await EditTasks(editing._id, formData);
        toast.success("Task updated successfully ✅");
      } else {
        await AddTask(formData);
        toast.success("Task added successfully 🎉");
      }

      setOpen(false);
      setEditing(null);
    } catch (error) {
      toast.error("Something went wrong. Try again ❌");
    }
  };

  const openEditModal = (task) => {
    setEditing(task);
    setFormData(task);
    setOpen(true);
  };

  const openAddModal = () => {
    setEditing(null);
    setFormData(emptyTask);
    setOpen(true);
  };

  // Handler for row click to open detail modal
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleUpdateTask = async (id, updatedData) => {
    try {
      await EditTasks(id, updatedData);
      toast.success("Task updated successfully ✅");
      setIsDetailModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      toast.error("Failed to update task ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeleteTasks(id);
      toast.success("Task deleted successfully 🗑️");
      setIsDetailModalOpen(false); // Close detail modal if open
    } catch (error) {
      toast.error("Failed to delete task ❌");
    }
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 ">
      <i class={`${styles.toggle_btn} fa-solid fa-bars me-3 fs-2 mb-3`}
        onClick={toggleSidebar}
      ></i>
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 mb-1 fw-bold text-dark">Task Manager</h1>
          <p className="text-muted mb-0">Manage your CRM activities and deadlines</p>
        </div>

        <div className="d-flex gap-2">


          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>
        {/* <button className="btn btn-primary shadow-sm px-4" onClick={openAddModal}>
          New Task</button> */}
      </div>

      {/* Main Table Card */}
      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <style>
              {`
                .task-row {
                  transition: background-color 0.2s;
                }
                .task-row:hover {
                  background-color: #f8f9fa;
                }
                .task-row .view-icon {
                  opacity: 0;
                  transition: opacity 0.2s;
                }
                .task-row:hover .view-icon {
                  opacity: 1;
                }
              `}
            </style>
            <thead className="bg-white border-bottom">
              <tr>
                <th className="ps-4 py-3 text-uppercase small fw-bold text-muted">Task Details</th>
                <th className="py-3 text-uppercase small fw-bold text-muted">Status</th>
                {/* <th className=" py-3 text-uppercase small fw-bold text-muted">TO</th> */}
                <th className="py-3 text-uppercase small fw-bold text-muted text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks?.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr
                    key={task._id}
                    onClick={() => handleTaskClick(task)}
                    style={{ cursor: 'pointer' }}
                    className="task-row"
                  >
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="view-icon text-primary">
                          <i className="fa fa-eye"></i> {/* Simple icon placeholder or use generic */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">{task.title}</div>
                          <div className="text-muted small">{task.description?.substring(0, 40)}...</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${task.status === 'Completed' ? 'bg-success-subtle text-success border border-success' :
                        task.status === 'In Progress' ? 'bg-primary-subtle text-primary border border-primary' :
                          'bg-warning-subtle text-dark border border-warning'
                        }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      {/* Prevent row click from triggering when clicking specific buttons if needed, but here we want row click mainly */}
                      <button
                        className="btn btn-sm btn-light border me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-5">
                    <div className="text-muted">No tasks found matching your search.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legacy Modal for Creating New Task */}
      <Modal
        isOpen={open}
        title={editing ? "Update Task" : "Create New Task"}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
        <TaskForm formData={formData} setFormData={setFormData} />
      </Modal>

      {/* New Trello-like Detail Modal */}
      <TaskDetailModal

        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default TasksPage;