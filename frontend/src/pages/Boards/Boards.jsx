import React, { useEffect, useState, useContext } from "react";
import { BoardContext } from "../../context/BoardContext.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Board from "../BoardCard/BoardCard.jsx";
import styles from "./Boards.module.css";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { TailSpin } from 'react-loader-spinner'
import { useOutletContext } from "react-router-dom";

export default function Boards() {
  const { toggleSidebar } = useOutletContext();
  const queryClient = useQueryClient();
  let { getAllBoards, getEmployeesBoards, getUserRole, addBoard } =
    useContext(BoardContext);
  let [userRole, setUserRole] = useState(null);
  let [loading, setloading] = useState(true);
  let [Errmsg, setErrmsg] = useState("");
  let [showForm, setShowForm] = useState(false);


  const { data, error, isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: userRole == 'admin' ? getAllBoards : getEmployeesBoards,
    enabled: !!userRole,
  });
  useEffect(() => {
    console.log(data?.boards);
    let role = getUserRole();
    console.log(role);

    if (role) {
      setUserRole(role)
    }
  }, []);
  // send data to API
  const sendDataToApi = async (values, resetForm) => {
    setloading(false);
    try {
      const response = await addBoard({
        title: values.title,
        description: values.description,
      });
      console.log(response);
      setloading(true);
      toast.success("Board added successfully !");
      resetForm(); // يفضي كل الفيلدات
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      //   setSelectedFiles([]); // يفضي الصور
      //   navigate("/AddProduct");
    } catch (err) {
      setErrmsg(err?.response?.data?.message);
      console.log(err);
    }
  };

  function validate(values) {
    const myError = {};

    if (!values.title) {
      myError.title = "Title is required";
    }
    if (!values.description) {
      myError.description = "Description is required";
    }
    return myError;
  }

  let Register = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      //convert values to JSON then send to API
      sendDataToApi(values, resetForm);
      // {isChecked? <AdminLayOut/> :<MainLayOut/>}
    },
  });

  // if (isLoading) return (
  //   <div className={`${styles.bg_dark} p-0 m-0 h-100 d-flex justify-content-center align-items-center `}>
  //     <TailSpin
  //       height="80"
  //       width="80"
  //       color="#2f0df0"
  //       ariaLabel="tail-spin-loading"
  //       visible={loading}
  //     />
  //   </div>
  // )
  if (data === undefined){
    console.log("No boards found.");
    
  }
  // if (data === undefined) return (
  //   <div className=" min-vh-100 d-flex justify-content-center align-items-center"><h2 className="text-white">No boards found.</h2></div>
  // );
  // if(error) console.log(error?.response?.data?.message);
  // if (error) return <div className=" text-white"> {error?.response?.data?.message}</div>;
  return (
    <div className={`${styles.bg_dark} p-0 m-0  `}>
      <div className="pt-3 ps-4">
        <i class={`${styles.toggle_btn} fa-solid fa-bars me-3 fs-2 text-white `}
          onClick={toggleSidebar}
        ></i>
      </div>
      <div className={`${styles.iconHolder} z-1`}>
        <i
          onClick={() => setShowForm(true)}
          className="fa-solid fa-plus fs-2 rounded-5 p-1 "
        ></i>

      </div>

      {/*------------------------------ start form ---------------------------------*/}

      {showForm && (
        <div
          className={`${styles.formHolder} z-2 position-absolute top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center`}
        >
          <div
            className={`${styles.form} container   bg-dark w-50 px-3 py-5 rounded-5`}
          >
            {/* -----------------------------close form -------------------------------- */}
            <i
              onClick={() => setShowForm(false)}
              className={`${styles.closeIcon} fa-regular fa-circle-xmark text-danger fs-3 position-absolute`}
            ></i>
            <form onSubmit={Register.handleSubmit} className="my-4 text-center ">
              {/*-------------------------------------------  start  title -------------------------------*/}
              <input
                onBlur={Register.handleBlur}
                value={Register.values.title}
                onChange={Register.handleChange}
                className={` ${styles.MyInput
                  } form-control Gray-Color rounded-5 mb-3    ${Register.errors.title ? "is-invalid" : ""
                  } `}
                type="text"
                name="title"
                id="title"
                placeholder="title*"
              />
              {Register.errors.title && Register.touched.title ? (
                <div className="alert alert-danger">
                  {Register.errors.title}
                </div>
              ) : (
                ""
              )}

              {/* ----------------------------------------------- end title ------------------------------------- */}

              {/* ------------------------------------ start description -------------------------- */}

              <input
                onBlur={Register.handleBlur}
                value={Register.values.description}
                onChange={Register.handleChange}
                className={` ${styles.MyInput
                  } form-control Gray-Color rounded-5    ${Register.errors.description ? "is-invalid" : ""
                  } `}
                type="text"
                name="description"
                id="description"
                placeholder="description*"
              />
              {Register.errors.description && Register.touched.description ? (
                <div className="alert alert-danger">
                  {Register.errors.description}
                </div>
              ) : (
                ""
              )}

              {/* ------------------------------------------ end description ---------------------------- */}

              {Errmsg ? <div className="alert alert-danger">{Errmsg}</div> : ""}
              <button
                disabled={!(Register.dirty && Register.isValid)}
                type="submit"
                className={`btn mt-3 form-control rounded-5 ${Register.dirty && Register.isValid
                  ? "bg-success text-white"
                  : "bg-secondary text-light"
                  }`}  
              >
                {loading ? (
                  "Submit"
                ) : (
                  <i className="fa fa-spinner fa-spin main-color"></i>
                )}
              </button>
              {/* <label ><input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} /> admin</label> */}
            </form>
          </div>
        </div>
      )}
   
      {/*------------------------------ end form ---------------------------------*/}
      {
        isLoading && (
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

      }
      {
        error&&(
          <div className=" text-white d-flex justify-content-center align-items-center "> <h2>{error?.response?.data?.message}</h2></div>
        )
      }
         {/* {
        // d-flex justify-content-center align-items-center
        data===undefined && <div className=" "><h2 className="text-white">No boards found.</h2></div>
      } */}
      <div className="container py-2">
        <div className="row">
          {data?.boards?.map((item) => (
            <Board item={item} key={item._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
