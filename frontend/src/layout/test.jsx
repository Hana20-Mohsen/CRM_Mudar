import { useContext , useEffect , useState } from "react"
import { ListContext } from "../context/ListContext.jsx";
import { useQueryClient ,useMutation } from "@tanstack/react-query";
import TaskCard from "./TaskCard.jsx";
import styles from './style.module.css'
import { TaskContext } from "../context/TaskContext.jsx";

export default function Lists({list , onTaskClick}){

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [menuOptions, setMenuOptions] = useState(false);
  const [isDeleteList, setDeletedList] = useState(false);
  const [isUpdateList, setUpdateList] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);

  const queryClient = useQueryClient();

  const { AddTask , updateTaskList, reorderTasks } = useContext(TaskContext);
  const { deleteList , updateList} = useContext(ListContext);

  /* ===================== PROGRESS CALCULATION ===================== */
  const totalTasks = list.tasks.length;

  const completedTasks = list.tasks.filter(
    (task) => task.status === "done"
  ).length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const getProgressColor = () => {
    if (progress === 100) return "#28a745";
    if (progress > 50) return "#ffc107";
    return "#dc3545";
  };

  /* ===================== ADD TASK ===================== */
  const addTaskMutation = useMutation({
    mutationFn: (newTask) => AddTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["lists", list.boardId]);
      setIsAddingTask(false);
      setTaskTitle("");
    },
  });

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;

    let user = JSON.parse(localStorage.getItem("user"));
    let userId = user?._id;

    addTaskMutation.mutate({
      title: taskTitle,
      listId: list._id,
      description: "New task",
      deadline: new Date(),
      userId,
    });
  };

  /* ===================== DELETE LIST ===================== */
  const deleteListMutation = useMutation({
    mutationFn: () => deleteList(list._id),
    onSuccess: async () => {
      setDeletedList(false);
      await queryClient.invalidateQueries({queryKey: ["lists", list.boardId]});
      queryClient.refetchQueries({ queryKey: ["lists", list.boardId] });
    },
  });

  /* ===================== UPDATE LIST ===================== */
  const updateListMutation = useMutation({
    mutationFn: (data) => updateList(list._id , data),
    onSuccess: async () => {
      setUpdateList(false);
      await queryClient.invalidateQueries({queryKey: ["lists", list.boardId]});
      queryClient.refetchQueries({ queryKey: ["lists", list.boardId] });
    },
  });

  /* ===================== MOVE TASK ===================== */
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, listId, changedListId }) =>
      updateTaskList(taskId, listId, changedListId),
    onSuccess: () => {
      queryClient.invalidateQueries(["lists", list.boardId]);
    },
  });

  const moveTask = (taskId, newListId, oldListId) => {
    updateTaskMutation.mutate({
      taskId,
      listId: newListId,
      changedListId: oldListId
    });
  };

  /* ===================== REORDER ===================== */
  const reorderTaskMutation = useMutation({
    mutationFn: ({ sourceListId, destinationListId, sourceTasks, destinationTasks, taskId }) =>
      reorderTasks(sourceListId, destinationListId, sourceTasks, destinationTasks, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", list.boardId] });
    },
  });

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();

    const taskId = e.dataTransfer.getData("taskId");
    const sourceListId = e.dataTransfer.getData("currentListId");
    const sourceIndex = Number(e.dataTransfer.getData("sourceIndex"));

    if (!taskId || !sourceListId) return;

    // SAME LIST
    if (sourceListId === list._id) {
      if (sourceIndex === dropIndex) return;

      const updatedTasks = [...list.tasks];
      const [draggedTask] = updatedTasks.splice(sourceIndex, 1);
      updatedTasks.splice(dropIndex, 0, draggedTask);

      const newTaskIds = updatedTasks.map((t) => typeof t === 'object' ? t._id : t);

      reorderTaskMutation.mutate({
        sourceListId: list._id,
        destinationListId: list._id,
        sourceTasks: newTaskIds,
        destinationTasks: newTaskIds,
        taskId
      });
      return;
    }

    // DIFFERENT LIST
    const allLists = queryClient.getQueryData(["lists", list.boardId]);
    if (!allLists) return;

    const sourceList = allLists.find(l => l._id === sourceListId);
    if (!sourceList) return;

    const sourceTasks = [...sourceList.tasks];
    const destinationTasks = [...list.tasks];

    const [draggedTask] = sourceTasks.splice(sourceIndex, 1);
    destinationTasks.splice(dropIndex, 0, draggedTask);

    const newSourceTaskIds = sourceTasks.map(t => typeof t === 'object' ? t._id : t);
    const newDestinationTaskIds = destinationTasks.map(t => typeof t === 'object' ? t._id : t);

    queryClient.setQueryData(["lists", list.boardId], (old) => {
      return old.map(l => {
        if (l._id === sourceListId) return { ...l, tasks: sourceTasks };
        if (l._id === list._id) return { ...l, tasks: destinationTasks };
        return l;
      });
    });

    reorderTaskMutation.mutate({
      sourceListId,
      destinationListId: list._id,
      sourceTasks: newSourceTaskIds,
      destinationTasks: newDestinationTaskIds,
      taskId
    });
  };

  /* ===================== UI ===================== */
  return (
    <div className={`${styles.list} position-relative`}>

      {/* HEADER */}
      <div className={`${styles.list_header}`}>
        <span>{list.title}</span>
        <span className="small text-muted">
          {completedTasks}/{totalTasks}
        </span>
        <span className={`${styles.cursor}`} onClick={()=>setMenuOptions(!menuOptions)}>•••</span>
      </div>

      {/* PROGRESS BAR */}
      <div className="px-2 mb-2">
        <div className="d-flex justify-content-between small mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div style={{
          height: "6px",
          background: "#e0e0e0",
          borderRadius: "6px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: getProgressColor(),
            transition: "width 0.3s ease"
          }} />
        </div>
      </div>

      {/* TASKS */}
      <div
        className={`${styles.tasks} flex-grow-1`}
        style={{ minHeight: "50px" }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
        onDrop={(e) => handleDrop(e, list.tasks.length)}
      >
        {list.tasks.map((task, index) => (
          task.status !== 'done' && (
            <div
              key={task._id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.stopPropagation();
                handleDrop(e, index);
              }}
            >
              <TaskCard
                task={task}
                index={index}
                onClick={onTaskClick}
              />
            </div>
          )
        ))}
      </div>

      {/* ADD TASK */}
      {isAddingTask ? (
        <div className="mt-2">
          <textarea
            autoFocus
            className="form-control mb-2"
            placeholder="Enter a title for this card..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <div className="d-flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={handleAddTask}>
              Add card
            </button>
            <button className="btn-close ms-2 mt-1" onClick={() => setIsAddingTask(false)}></button>
          </div>
        </div>
      ) : (
        <button className={`${styles.add_card}`} onClick={() => setIsAddingTask(true)}>
          + Add a card
        </button>
      )}

    </div>
  );
}