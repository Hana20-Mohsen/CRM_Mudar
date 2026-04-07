import { useEffect } from "react";
import socket from "../socket.js";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
const useCheckIn = () => {
    const queryClient = useQueryClient();
    useEffect(() => {
        socket.on("checkedIn", (userId) => {
            toast.success(`User ${userId} checked in!`);
            console.log("Received on:", socket.id, userId);
            queryClient.invalidateQueries({
                queryKey: ['getAttendance'],
            });
            // queryClient.setQueryData(['getProducts'] , (oldData)=>{
            //     if(!oldData) return newProduct;
            //     return [newProduct, ...oldData];
            // });
        });
        return () => {
            socket.off("checkedIn");
        }
    }, [])
}

export default useCheckIn;