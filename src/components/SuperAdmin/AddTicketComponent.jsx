import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import Loader from '../Loader/Loader';

const AddTicketComponent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const editor = useRef(null);

    const editorConfig = useMemo(() => ({
        readonly: false,
        height: 300,
        placeholder: 'Start writing...',
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        hidePoweredByJodit: true,
        statusbar: false
    }), []);

    const [isLoading, setIsLoading] = useState(isEdit);

    const validationSchema = Yup.object({
        name: Yup.string().trim().required("Name is required"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
        department: Yup.string().required("Department is required"),
        priority: Yup.string().required("Priority is required"),
        subject: Yup.string().trim().required("Subject is required"),
        message: Yup.string().trim().required("Message is required"),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            department: '',
            priority: 'Low',
            subject: '',
            message: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                let response;
                if (isEdit) {
                    response = await apiRequest(`/update-ticket/${id}`, "PUT", values, true);
                } else {
                    response = await apiRequest("/create-ticket", "POST", values, true);
                }

                if (response.success) {
                    toast.success(isEdit ? "Ticket updated successfully" : "Ticket created successfully");
                    navigate('/view-ticket');
                } else {
                    toast.error(response?.data?.message || (isEdit ? "Failed to update ticket" : "Failed to create ticket"));
                }
            } catch (error) {
                console.error(isEdit ? "Update Ticket caught error:" : "Create Ticket caught error:", error);
                toast.error(isEdit ? "An error occurred while updating the ticket." : "An error occurred while creating the ticket.");
            }
        }
    });

    const fetchTicket = async () => {
        try {
            const response = await apiRequest(`/ticket/${id}`, "GET", null, true);
            if (response.success && response.data && response.data.data) {
                const ticketData = response.data.data;
                formik.setValues({
                    name: ticketData.name || '',
                    email: ticketData.email || '',
                    department: ticketData.department || '',
                    priority: ticketData.priority || 'Low',
                    subject: ticketData.subject || '',
                    message: ticketData.message || ''
                });
            } else {
                toast.error("Failed to parse ticket details");
                navigate('/view-ticket');
            }
        } catch (error) {
            console.error("Fetch ticket error:", error);
            toast.error("Failed to fetch ticket details");
            navigate('/view-ticket');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isEdit) {
            fetchTicket();
        }
    }, [isEdit, id]);

    return (
        <section className="right-sidebar" id="sidebarRight">
            {isLoading && <Loader message='Loading Ticket...' variant="success" />}
            <div className="Audio-main-sec">
                <div className="title-sec text-center mb-3" >
                    <h5 className='clPurple'>
                        {isEdit ? 'Update Ticket Request' : 'Create New Ticket Request'}
                    </h5>
                </div>

                <div className="add-NewsLetter-form-sec" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label" style={{ fontSize: '0.9rem', color: '#555' }}>Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control hover-border-light"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className="text-danger mt-1" style={{ fontSize: '13px' }}>{formik.errors.name}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label" style={{ fontSize: '0.9rem', color: '#555' }}>Email <span className="text-danger">*</span></label>
                                <input
                                    type="email"
                                    className="form-control hover-border-light"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-danger mt-1" style={{ fontSize: '13px' }}>{formik.errors.email}</div>
                                )}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label" style={{ fontSize: '0.9rem', color: '#555' }}>Department <span className="text-danger">*</span></label>
                                <select
                                    className="form-select hover-border-light"
                                    name="department"
                                    value={formik.values.department}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">Select Department</option>
                                    <option value="Payment">Payment</option>
                                    <option value="Legal">Legal</option>
                                    <option value="Operational">Operational</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Youtube">Youtube</option>
                                </select>
                                {formik.touched.department && formik.errors.department && (
                                    <div className="text-danger mt-1" style={{ fontSize: '13px' }}>{formik.errors.department}</div>
                                )}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label" style={{ fontSize: '0.9rem', color: '#555' }}>Priority <span className="text-danger">*</span></label>
                                <select
                                    className="form-select hover-border-light"
                                    name="priority"
                                    value={formik.values.priority}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                </select>
                                {formik.touched.priority && formik.errors.priority && (
                                    <div className="text-danger mt-1" style={{ fontSize: '13px' }}>{formik.errors.priority}</div>
                                )}
                            </div>
                        </div>
                        <label className="form-label" style={{ fontSize: '0.9rem', color: '#555' }}>Subject <span className="text-danger">*</span></label>
                        <div className="mb-3 mt-2">
                            <input
                                type="text"
                                className="form-control hover-border-light"
                                name="subject"
                                value={formik.values.subject}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.subject && formik.errors.subject && (
                                <div className="text-danger mt-1" style={{ fontSize: '13px' }}>{formik.errors.subject}</div>
                            )}
                        </div>
                        <label className="form-label" style={{ fontSize: '0.9rem', color: '#555' }}>Message <span className="text-danger">*</span></label>
                        <div className="mb-4">
                            <JoditEditor
                                ref={editor}
                                value={formik.values.message}
                                config={editorConfig}
                                onBlur={(newContent) => {
                                    formik.setFieldTouched('message', true);
                                    formik.setFieldValue('message', newContent);
                                }}
                            />
                            {formik.touched.message && formik.errors.message && (
                                <div className="text-danger mt-1" style={{ fontSize: '13px' }}>{formik.errors.message}</div>
                            )}
                        </div>

                        <div className="mt-4 d-flex gap-3">
                            <button
                                type="button"
                                className="mainBtn bgGray clWhite"
                                onClick={() => navigate('/view-ticket')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="mainBtn bgPurple clWhite px-4 py-2"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? 'Saving...' : (isEdit ? 'Update Ticket' : 'Save Ticket')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Some CSS specific to this form */}
            <style>{`
                .hover-border-light:focus {
                    border-color: #20c997;
                    box-shadow: 0 0 0 0.2rem rgba(32, 201, 151, 0.25);
                }
            `}</style>
        </section>
    );
};

export default AddTicketComponent;
