import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';
import Loader from "../Loader/Loader";

function AddEventComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [eventData, setEventData] = useState(null);

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            fetchEvent();
        }
    }, [id]);

    const fetchEvent = async () => {
        setLoading(true);
        try {
            const response = await apiRequest(`/event/${id}`, "GET", null, true);
            if (response.success) {
                setEventData(response.data.data);
            } else {
                toast.error(response?.message || "Failed to fetch event details");
                navigate('/manage-events');
            }
        } catch (error) {
            toast.error("An error occurred while fetching event details");
        } finally {
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            title: eventData?.title || '',
            eventDate: eventData?.eventDate ? new Date(eventData.eventDate).toISOString().split('T')[0] : '',
            description: eventData?.description || '',
            status: eventData?.status || 'Active'
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            eventDate: Yup.date().required("Event Date is required"),
            status: Yup.string().oneOf(['Active', 'Inactive']).required("Status is required")
        }),
        onSubmit: async (values) => {
            try {
                const endpoint = isEditMode ? `/update-event/${id}` : "/create-event";
                const method = isEditMode ? "PUT" : "POST";

                const response = await apiRequest(endpoint, method, values, true);
                if (response.success) {
                    toast.success(`Event ${isEditMode ? 'updated' : 'created'} successfully`);
                    navigate('/manage-events');
                } else {
                    toast.error(response?.message || `Failed to ${isEditMode ? 'update' : 'create'} event`);
                }
            } catch (error) {
                toast.error(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the event`);
            }
        }
    });

    if (loading && !eventData) return <Loader message="Loading..." />;

    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="add-subLabel-sec">
                <div className="add-subLab">
                    <div className="add-subLabel-heading">
                        <h6 className='clPurple'>{isEditMode ? 'Edit Event' : 'Add New Event'}</h6>
                    </div>
                </div>

                <div className="add-subLabel-mainbox">
                    <div className="add-subLabel-box">
                        <form onSubmit={formik.handleSubmit} className="add-subLabels-form">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required">Event Title</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                            name="title"
                                            placeholder="Enter event title"
                                            {...formik.getFieldProps('title')}
                                        />
                                        {formik.touched.title && formik.errors.title && (
                                            <small className="text-danger">{formik.errors.title}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required">Event Date</label>
                                        <input
                                            type="date"
                                            className={`form-control ${formik.touched.eventDate && formik.errors.eventDate ? 'is-invalid' : ''}`}
                                            name="eventDate"
                                            {...formik.getFieldProps('eventDate')}
                                        />
                                        {formik.touched.eventDate && formik.errors.eventDate && (
                                            <small className="text-danger">{formik.errors.eventDate}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required">Status</label>
                                        <select
                                            className={`form-control form-select ${formik.touched.status && formik.errors.status ? 'is-invalid' : ''}`}
                                            name="status"
                                            {...formik.getFieldProps('status')}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        {formik.touched.status && formik.errors.status && (
                                            <small className="text-danger">{formik.errors.status}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            rows="4"
                                            placeholder="Enter event description"
                                            {...formik.getFieldProps('description')}
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="col-12 mt-4">
                                    <div className="form-group add-sublab-group d-flex gap-3">
                                        <button
                                            type="button"
                                            className="mainBtn bgGray clWhite"
                                            onClick={() => navigate('/manage-events')}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="mainBtn bgPurple clWhite"
                                            disabled={formik.isSubmitting}
                                        >
                                            {formik.isSubmitting ? 'Saving...' : (isEditMode ? 'Update Event' : 'Create Event')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AddEventComponent;
