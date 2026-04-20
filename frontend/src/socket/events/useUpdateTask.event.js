import { useEffect } from "react";
import socket from "../socket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useUpdateTask = () => {
    const queryClient = useQueryClient();
    const boardId= localStorage.getItem('boardId')
    console.log(`boardId from useUpdateTask: ${boardId}`);
    
    useEffect(()=>{
        
        socket.on("taskUpdated", (taskId) => {
            console.log(`---------------------------- useEffect in socket -----------`);
            console.log("Received on:", taskId);
            // toast.info(`Task has been updated!`);
            queryClient.invalidateQueries(["lists", boardId]);
        })
        return () => {
            socket.off("taskUpdated");
        }
    })
}
export default useUpdateTask;