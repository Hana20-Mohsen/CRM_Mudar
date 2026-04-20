import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft, faList, faTag, faClock, faTrash, faTimes, faSave, faImage, faPaperclip, faExternalLinkAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import styles from './styles.module.css'
const TaskDetailModal = ({ isOpen, onClose, task, onUpdate, onDelete }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ ...task });
    const [userName, setUserName] = useState(null);
    const [showImageInput, setShowImageInput] = useState(false);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const { getUserById } = useContext(AuthContext);

    const API_URL = import.meta.env.VITE_API_URL;
    const getUserNameMutation = useMutation({
        mutationFn: (userId) => getUserById(userId),
        onSuccess: (data) => {
            setUserName(data?.user?.name)
            queryClient.invalidateQueries(["lists", list.boardId]);

            //   setIsAddingTask(false);
            //   setTaskTitle("");
        },
    });

    useEffect(() => {
        setFormData({ ...task });
        setShowImageInput(false);
        setShowLinkInput(false);
        setSelectedFile(null);
        console.log(task?.userId);
        getUserNameMutation.mutate(task?.userId)
        console.log(task);



    }, [task, userName]);

    if (!isOpen || !task) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            setSelectedFile(file);
            // Create preview URL
            setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
        }
    };

    const handleSave = () => {
        if (selectedFile) {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== 'image' && key !== '_id' && key !== '__v') {
                    data.append(key, formData[key] || '');
                    console.log("key", key, "formData", formData[key])
                }
                console.log("key", key, "formData", formData[key])
            });
            data.append('image', selectedFile);
            onUpdate(task._id, data);
        } else {
            onUpdate(task._id, formData);
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            onDelete(task._id);
            onClose();
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('blob:') || imagePath.startsWith('http')) {
            return imagePath;
        }
        return `${API_URL}/uploads/${imagePath}`;
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content bg-light shadow-lg border-0">

                    {/* Cover Image */}
                    {formData.image && (
                        <div className="position-relative w-100" style={{ height: '160px', overflow: 'hidden', borderTopLeftRadius: '0.3rem', borderTopRightRadius: '0.3rem' }}>
                            <img src={getImageUrl(formData.image)} alt="Cover" className="w-100 h-100 object-fit-cover" />
                            <button
                                className="btn btn-sm btn-light position-absolute top-0 end-0 m-2"
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, image: '' }));
                                    setSelectedFile(null);
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} /> Remove Cover
                            </button>
                        </div>
                    )}

                    {/* Header (Title) */}
                    <div className="modal-header border-0 pb-0">
                        <div className="d-flex align-items-center w-100 gap-2">
                            <FontAwesomeIcon icon={faList} className="text-muted" />
                            <div className="w-100">
                                <input
                                    type="text"
                                    className="form-control fw-bold fs-5 border-0 bg-transparent shadow-none px-1"
                                    name="title"
                                    value={formData.title || ''}
                                    onChange={handleChange}
                                    placeholder="Task Title"
                                />

                                <span className="text-muted small ms-1">Task : <strong className='text-warning'>{formData.status}</strong></span>
                                <h5 className="text-muted small ms-1">Employee : <strong className='text-success'>{userName}</strong></h5>
                            </div>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body pt-4">
                        <div className="container-fluid">
                            <div className="row">

                                {/* Main Content Area */}
                                <div className="col-md-9">

                                    {/* Attachments Section */}
                                    {(formData.linkReference || showLinkInput) && (
                                        <div className="mb-4">
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <FontAwesomeIcon icon={faPaperclip} className="text-muted" />
                                                <h6 className="fw-bold mb-0">Attachments</h6>
                                            </div>

                                            {formData.linkReference && (
                                                <div className="card mb-2">
                                                    <div className="card-body p-2 d-flex align-items-center gap-3">
                                                        <div className="bg-light rounded p-3 text-muted">
                                                            <FontAwesomeIcon icon={faExternalLinkAlt} size="lg" />
                                                        </div>
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <div className="fw-bold text-truncate">Link Reference</div>
                                                            <a href={formData.linkReference} target="_blank" rel="noopener noreferrer" className="small text-primary text-decoration-none text-truncate d-block">
                                                                {formData.linkReference}
                                                            </a>
                                                        </div>
                                                        <button className="btn btn-sm btn-light" onClick={() => setFormData(prev => ({ ...prev, linkReference: '' }))}>
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {showLinkInput && (
                                                <div className="input-group mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Paste link URL here..."
                                                        name="linkReference"
                                                        value={formData.linkReference || ''}
                                                        onChange={handleChange}
                                                        autoFocus
                                                    />
                                                    <button className="btn btn-outline-secondary" onClick={() => setShowLinkInput(false)}>Done</button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Image Input Section (if toggled) */}
                                    {showImageInput && (
                                        <div className="mb-4">
                                            <h6 className="fw-bold mb-2">Add Cover Image</h6>
                                            <div className="d-flex gap-2 mb-2">
                                                <button className="btn btn-outline-primary btn-sm" onClick={() => fileInputRef.current.click()}>
                                                    <FontAwesomeIcon icon={faUpload} className="me-2" /> Upload from Computer
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                                {/* <input
            onBlur={Register.handleBlur}
            onChange={handleFileChange}
            className={` ${styles.MyInput} form-control  rounded-5     ${
              Register.errors.images ? "is-invalid" : ""
            } `}
            
          /> */}
                                            </div>
                                            <div className="text-center text-muted small my-2">- OR -</div>
                                            <div className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Paste image URL here..."
                                                    name="image"
                                                    value={formData.image || ''}
                                                    onChange={handleChange}
                                                    autoFocus
                                                />
                                                <button className="btn btn-outline-secondary" onClick={() => setShowImageInput(false)}>Done</button>
                                            </div>
                                        </div>
                                    )}


                                    {/* Description Section */}
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <FontAwesomeIcon icon={faAlignLeft} className="text-muted" />
                                            <h6 className="fw-bold mb-0">Description</h6>
                                        </div>
                                        <textarea
                                            className="form-control bg-white border-0 shadow-sm"
                                            rows="6"
                                            name="description"
                                            value={formData.description || ''}
                                            onChange={handleChange}
                                            placeholder="Add a more detailed description..."
                                        ></textarea>
                                    </div>

                                    <div className={`d-flex gap-2`}>
                                        <button className={`btn btn-primary  ${styles.btn_main}`} onClick={handleSave}>
                                            <FontAwesomeIcon icon={faSave} className={`me-2 `} />
                                            Save Changes
                                        </button>
                                    </div>

                                </div>

                                {/* Sidebar (Meta & Actions) */}
                                <div className="col-md-3">
                                    <div className="mb-3">
                                        <label className="text-uppercase text-muted fw-bold small mb-1">Add to card</label>
                                        <button className="btn btn-light btn-sm w-100 text-start mb-1" onClick={() => setShowImageInput(!showImageInput)}>
                                            <FontAwesomeIcon icon={faImage} className="me-2 text-muted" style={{ width: '20px' }} /> Cover
                                        </button>
                                        <button className="btn btn-light btn-sm w-100 text-start" onClick={() => setShowLinkInput(!showLinkInput)}>
                                            <FontAwesomeIcon icon={faPaperclip} className="me-2 text-muted" style={{ width: '20px' }} /> Attachment
                                        </button>
                                    </div>

                                    <div className="mb-3">
                                        <label className="text-uppercase text-muted fw-bold small mb-1">Status</label>
                                        <select
                                            className="form-select form-select-sm"
                                            name="status"
                                            value={formData.status || 'Pending'}
                                            onChange={handleChange}
                                        >
                                            <option hidden>{task?.status}</option>
                                            <option value="pending">Pending</option>
                                            <option value="in progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="text-uppercase text-muted fw-bold small mb-1">Priority</label>
                                        <select
                                            className="form-select form-select-sm"
                                            name="priority"
                                            value={formData.priority || 'Medium'}
                                            onChange={handleChange}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-uppercase text-muted fw-bold small mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-sm"
                                            name="dueDate"
                                            value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <hr />

                                    <button className="btn btn-outline-danger w-100 btn-sm" onClick={handleDelete}>
                                        <FontAwesomeIcon icon={faTrash} className="me-2" />
                                        Delete Task
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
