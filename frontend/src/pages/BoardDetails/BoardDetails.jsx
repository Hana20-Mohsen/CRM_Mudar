import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { BoardContext } from "../../context/BoardContext.jsx";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styles from "./BoardDetails.module.css";
import Employees from "../../layout/Employees.jsx";
import Lists from "../../layout/Lists.jsx";
import { ListContext } from "../../context/ListContext.jsx";
import ShareModal from "../../layout/ShareModal.jsx";
import TaskDetailModal from "../../components/TaskDetailModal.jsx";
import { TaskContext } from "../../context/TaskContext.jsx";
import { toast } from "react-toastify";
import { TailSpin } from 'react-loader-spinner'
import AssignTaskModal from "../../layout/AssignTaskModal.jsx";
import AssignedTasksLists from "../../layout/AssignedTasksLists.jsx";
import { useOutletContext } from "react-router-dom";
import socket from "../../socket/socket.js";

export default function BoardDetails() {
  const { id } = useParams();
  const { toggleSidebar } = useOutletContext();
  let [loading, setloading] = useState(true);
  let [assignTaskModalAppear, setAssignTaskModalAppear] = useState(false);
  let [userRole, setUserRole] = useState(null);
  const queryClient = useQueryClient();
  const { getBoardByItsId, addUserToBoard, getUserRole } = useContext(BoardContext);
  const [boardDetails, setBoardDetails] = useState(null);
  const { EditTasks, DeleteTasks, getAllAssignedTasks, getAssignedTasksByEmpId } = useContext(TaskContext);
  const navigate = useNavigate();
  // Modal State
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //   ----------------------------------------
  let { getListsByBoardId, createList } = useContext(ListContext);
  //   --------------------------------------------
  const [isAddingList, setIsAddingList] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["boardDetails", id],
    queryFn: () => getBoardByItsId(id),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });


  const {
    data: listData,
    error: listError,
    isLoading: isListloading,
  } = useQuery({
    queryKey: ["lists", data?._id],
    queryFn: () => getListsByBoardId(data._id),
    enabled: !!data?._id,
  })
  //   socket.on("taskUpdated", (updatedTask) => {
  //   queryClient.setQueryData(["lists", data?._id], (old) => {
  //     return old.map(task =>
  //       task.id === updatedTask.id ? updatedTask : task
  //     );
  //   });
  // });

  const { data: assignedTasksListsData } = useQuery({
    queryKey: ["assignedTasks", data?._id],
    queryFn: () =>
      userRole === "admin"
        ? getAllAssignedTasks(data?._id)
        : getAssignedTasksByEmpId(data?._id),
    enabled: !!userRole && !!data?._id,
  });
 const boardId= data?._id;
 localStorage.setItem("boardId", boardId);
  const addListMutation = useMutation({
    mutationFn: (newList) => createList(newList), // Ensure this matches your API helper
    onSuccess: () => {
      queryClient.invalidateQueries(["lists", data?._id]);
      setIsAddingList(false);
      setListTitle("");
    },
  });
  const handleAddList = () => {
    if (!listTitle.trim()) return;
    addListMutation.mutate({ title: listTitle, boardId: data._id });
  };
  const userId = JSON.parse(localStorage.getItem("user"))._id;

  useEffect(() => {
    console.log(data);
    socket.emit("joinBoard", data?._id);
    console.log(assignedTasksListsData);
    let role = getUserRole();
    if (role) {
      setUserRole(role)
    }


  }, [data, listData, userRole, assignedTasksListsData, userId]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      await EditTasks(taskId, updatedData);
      toast.success("Task updated successfully");
      setIsModalOpen(false);
      // Invalidate lists query to refresh data
      queryClient.invalidateQueries(["lists", data?._id]);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await DeleteTasks(taskId);
      toast.success("Task deleted successfully");
      setIsModalOpen(false);
      queryClient.invalidateQueries(["lists", data?._id]);
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  if (isLoading) return (
    <div className={`${styles.bg_dark} p-0 m-0 h-100 d-flex justify-content-center align-items-center `}>
      <TailSpin
        height="80"
        width="80"
        color="#2f0df0"
        ariaLabel="tail-spin-loading"
        visible={loading}
      />
    </div>
  )

  const handleAssignTaskModal = (value) => {
    setAssignTaskModalAppear(value)
  }
  return (
    <div className={`${styles.bg_gredient}  p-0 h-100 `}>

      <div
        className={`${styles.boardNav} ${styles.bg_dark_transparent} py-2 px-5 text-white d-flex align-items-center justify-content-between `}
      >

        <div className={`${styles.toggle_title_holder} d-flex`}>
          <i class={`${styles.toggle_btn} ${styles.toggle_btn_laptop_screen} fa-solid fa-bars me-3 fs-2 `}
            onClick={toggleSidebar}
          ></i>
          <div className=" ">
            <h5>{data?.title}</h5>
          </div>
        </div>
        <div className={`${styles.second_part_holder} d-flex align-items-center gap-3`} >
          {userRole == 'admin' && (
            <button className={`btn  ${styles.btn_primary} ${styles.handle_btn_mobile_screen} text-white`}
              onClick={() => {
                setAssignTaskModalAppear(true)
              }}
            >Assign Task</button>

          )}
          {userRole == 'admin' && (
            <i className={` fa-solid fa-file-circle-plus assign-icon ${styles.assignIcon} `} title="assign task" onClick={() => {
              setAssignTaskModalAppear(true)
            }} ></i>

          )}
          <div className={`${styles.employees_on_laptop} d-flex align-items-center`}>
            <Employees users={data?.users} owner={data?.owner} />
          </div>
          {userRole === 'admin' || userId === data?.owner?._id ? (
            <i
              className={`${styles.cursor} fa-solid fa-user-plus`}
              onClick={() => setIsShareModalOpen(true)}
            ></i>
          ) : null}

        </div>

      </div>
      <div className={`${styles.back}  `} >
        <i className="fa-solid fa-arrow-left fs-2" style={{ color: "black", fontSize: "30px", textAlign: "center", cursor: "pointer" }} onClick={() => navigate("/boards")}></i>
      </div>
      <div className={` d-flex justify-content-between px-3 my-2 position-relative  `}>
        <div className="ps-4 pt-1">
          <i class={`${styles.toggle_btn} ${styles.toggle_btn_mobile_screen} fa-solid fa-bars me-3 fs-2 d-none text-white`}
            onClick={toggleSidebar}
          ></i>
        </div>
        <div className={`${styles.employees_on_mobile} d-flex align-items-center`}>
          <Employees users={data?.users} owner={data?.owner} />
        </div>
      </div>


      <div className={`${styles.board}`}>
        {/* -----------------------assigned lists starts here ------------- */}
        {assignedTasksListsData?.map((list) => (
          <AssignedTasksLists key={list._id} list={list} onTaskClick={handleTaskClick} />
        ))}
        {/* -----------------------assigned lists ends here ------------- */}
        {listData?.map((list) => (
          <Lists key={list._id} list={list} onTaskClick={handleTaskClick} />
        ))}
        {isAddingList ? (
          <div className={`${styles.add_list_form} ${styles.list}`}> {/* Uses 'list' class for same width */}
            <input
              autoFocus
              className={`${styles.form_control} mb-3 p-1 w-100`} // Add margin-bottom for spacing
              placeholder="Enter list title..."
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
            />
            <div className="d-flex gap-2">
              <button className={`${styles.btn_primary} btn  btn-sm text-white`} onClick={handleAddList}>Add list</button>
              <button className="btn btn-light btn-sm" onClick={() => setIsAddingList(false)}>X</button>
            </div>
          </div>
        ) : (
          <div className={`${styles.add_list}`} onClick={() => setIsAddingList(true)}>
            + Add another list
          </div>
        )}
      </div>
      {/* Share Modal Component */}


      {isShareModalOpen && (
        <div className={` ${styles.bg_dark_transparent} d-flex justify-content-center align-items-center position-absolute top-0 bottom-0 end-0 start-0 h-100`}>
          <ShareModal className=" m-auto"
            users={data?.users}
            board={data}
            onClose={() => setIsShareModalOpen(false)}
            onSubmit={() => {
              setIsShareModalOpen(false);
              queryClient.invalidateQueries(["boardDetails", id]);
            }}
          />
        </div>
      )}


      {/* Task Detail Modal */}
      <TaskDetailModal
        board={data}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
      {
        assignTaskModalAppear && (
          <AssignTaskModal board={data} handleModal={handleAssignTaskModal}>

          </AssignTaskModal>
        )
      }
    </div>
  );
}
