import React, { useContext, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { BoardContext } from "../../context/BoardContext";
import styles from './BoardCard.module.css';

export default function Board({ item }) {
  const { deleteBoardByItsId, updateBoard } = useContext(BoardContext);
  const [menuOptions, setMenuOptions] = useState(false);
  const [isDeleteBoard, setDeletedBoard] = useState(false);
  const [isUpdateBoard, setUpdateBoard] = useState(false);
  const [editData, setEditData] = useState({
    title: item.title,
    description: item.description,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteBoardMutation = useMutation({
    mutationFn: () => deleteBoardByItsId(item._id),
    // onSuccess: async () => {
    //   setDeletedBoard(false)
    //   await queryClient.invalidateQueries({ queryKey: ["boards"] });
    //   onClose();
    // },
      onSuccess: () => {
    queryClient.setQueryData(["boards"], (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        boards: oldData.boards.filter(
          (board) => board._id !== item._id
        ),
      };
    });
  },
  });
  const updateBoardMutation = useMutation({
    mutationFn: (updatedData) => updateBoard(item._id, updatedData),
    onSuccess: async () => {
      setUpdateBoard(false);
      await queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.refetchQueries({ queryKey: ["boards"] });
      onClose();
    },
  });

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };



  return (
    <>

      {/* onClick={()=>navigate("/boards/" + item._id)} */}


      <div className={`col-lg-4 col-sm-4 rounded-4 pt-5 `} >
        <div className={`${styles.product} text-white cursor-pointer rounded-3 gray-border my-3 w-100 h-100 pt-5 ps-1 position-relative`}>
          <i className={`fa-solid fa-ellipsis-vertical  position-absolute fs-4 ${styles.threeDots}`} onClick={() => setMenuOptions(!menuOptions)}></i>
          {/* --------- start list options menu ---------- */}
          {
            menuOptions && (
              <div className={`${styles.optionsCard} bg-white position-absolute z-1 w-75 rounded-2`}>
                <h6 className={`${styles.optionsItems} ${styles.firstItem}  text-dark`} onClick={() => {
                  setDeletedBoard(true)
                }}>Delete</h6>
                <div className={`${styles.divider}`}></div>
                <h6 className={`${styles.optionsItems} text-dark`} onClick={() => {
                  setUpdateBoard(true)
                  setMenuOptions(!menuOptions)
                }}>EDIT</h6>
              </div>
            )
          }

          {/*---------------------------- start delete list ----------------------- */}
          {
            isDeleteBoard && (
              <div className={`${styles.deleteCheckHolder} z-2 position-fixed start-0 end-0 top-0 bottom-0 d-flex justify-content-center align-items-center`} >
                <div className={`${styles.formHolder}  p-5 bg-light  rounded-3`}>
                  <h5 className="text-center mb-4 text-dark">Are You Sure ?  </h5>
                  <div className="d-flex justify-content-center">
                    <button className={`py-2 px-2 px-md-5  rounded-3 border-0 me-2 bg-danger text-white`} onClick={() => deleteBoardMutation.mutate()}>Delete</button>
                    <button className={`py-2 px-2 px-md-5 rounded-3 border-1  me-2`} onClick={() => setDeletedBoard(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )
          }
          {/*---------------------------- end delete list ----------------------- */}
          {/* -------------------------start edit lists ---------------- */}
          {
            isUpdateBoard && (
              <div className={`${styles.deleteCheckHolder}  z-2 position-fixed start-0 end-0 top-0 bottom-0 d-flex justify-content-center align-items-center`}>

                <div className={`${styles.formHolder} p-4 bg-light rounded-3 w-50`}>
                  <h4 className="mb-3 text-center">Edit Board</h4>

                  <input
                    type="text"
                    name="title"
                    className="form-control mb-3"
                    placeholder="Board Title"
                    value={editData.title}
                    onChange={handleEditChange}
                  />

                  <textarea
                    name="description"
                    className="form-control mb-3"
                    placeholder="Board Description"
                    value={editData.description}
                    onChange={handleEditChange}
                  />

                  <div className="text-center">
                    <button
                      className="btn btn-primary px-4 me-2"
                      onClick={() => updateBoardMutation.mutate(editData)}
                    >
                      Save
                    </button>

                    <button
                      className="btn btn-secondary px-4"
                      onClick={() => setUpdateBoard(false)}
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              </div>
            )
          }


          {/* ------------------------- end edit lists ---------------------- */}

          {/* --------- end list options menu ---------- */}
          {/* start link to product details */}
          <Link className="un-underline text-white text-decoration-none" to={"/boards/" + item._id}>
            {/* <span className='main-color'>{item.category.name}</span> */}
            <h3 className="my-2 fw-bold ">
              {item.title}
              {/* {item.description.split(" ").slice(0, 2).join(" ")} */}
            </h3>
            <h5 className="my-2 fw-bold fs-6">
              {item.description}
              {/* {item.description.split(" ").slice(0, 2).join(" ")} */}
            </h5>

          </Link>
          {/* end link to product details */}

        </div>
      </div>
    </>
  )
}