import { useEffect } from "react";
import socket from "../socket.js";
import { useQueryClient } from "@tanstack/react-query";

const useCheckIn =()=>{
    const queryClient = useQueryClient();
    useEffect(()=>{
        socket.on("checkedIn" , (userId)=>{
            console.log("Socket received:", userId);
             queryClient.invalidateQueries(['getAttendance'])
            // queryClient.setQueryData(['getProducts'] , (oldData)=>{
            //     if(!oldData) return newProduct;
            //     return [newProduct, ...oldData];
            // });
        });
        return ()=>{
            socket.off("checkedIn");
        }
    } , [])
}

export default useCheckIn;