import { use, useEffect } from "react";
import socket from "./socket";
import { toast } from "react-toastify";
import useCheckIn from "./events/useCheckIn.event.js";
export default function useSocketEvents() {

  // ✅ CALL HOOK HERE (top level)
useCheckIn();
  useEffect(() => {
    socket.on("connect",()=>{
  console.log("connected:",socket.id)
 })
    // socket.on("product-added-to-cart", (data) => {
    //   toast.dark("A product was added to cart");
    // });

    // socket.on("product-stock-updated", (data) => {
    //   console.log("Updated stock:", data);

    //   data.products.forEach((product) => {
    //     console.log(
    //       `Product ${product._id} new quantity: ${product.countInStock}`
    //     );
    //   });
    // });

    return () => {
    //   socket.off("product-added-to-cart");
    //   socket.off("product-stock-updated"); // ✅ ADD THIS
    //   socket.off("product-updated");
    };
  }, []);
}