import { useEffect } from "react";
import socket from "../socket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useUpdateTask = () => {
    const queryClient = useQueryClient();
    const boardId= localStorage.getItem('boardId')
    useEffect(()=>{
        socket.on("taskUpdated", (taskId) => {
            toast.info(`Task ${taskId} has been updated!`);
            console.log("Received on:", socket.id, taskId);
            queryClient.refetchQueries(["lists", boardId]);
        })
        return () => {
            socket.off("taskUpdated");
        }
    })
}
export default useUpdateTask;