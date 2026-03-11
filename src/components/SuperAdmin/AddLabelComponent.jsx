import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import Select from "react-select";
import countryList from "react-select-country-list";

function AddLabelComponent() {
    const [searchParams] = useSearchParams();
    const labelId = searchParams.get("id");
    const isEdit = !!labelId;

    const [loading, setLoading] = useState(isEdit);
    const navigate = useNavigate();
    const countryOptions = React.useMemo(() => countryList().getData(), []);

    const [users, setUsers] = useState([]);

    // Validation schema for Labels
    const validationSchema = Yup.object({
        name: Yup.string().trim().required("Name is required"),
        email: Yup.string().email("Invalid email format"),
        country: Yup.string().required("Country is required"),
        user_id: Yup.mixed().required("User is required")
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            country: "India",
            user_id: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            const payload = { ...values };

            const method = isEdit ? "PUT" : "POST";
            const endpoint = isEdit ? `/update-label/${labelId}` : "/create-label";

            try {
                const response = await apiRequest(endpoint, method, payload, true);
                if (response.success) {
                    toast.success(response.message);
                    navigate("/view-label"); // or wherever labels are managed
                } else {
                    toast.error(response.message || "Operation failed");
                }
            } catch (error) {
                console.error("Error saving label:", error);
                toast.error("An error occurred while saving label");
            }
        }
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch users with role User
                const usersResponse = await apiRequest(`/users?role=User&limit=1000`, "GET", null, true);
                if (usersResponse.success && usersResponse.data?.data) {
                    setUsers(usersResponse.data.data);
                }

                if (isEdit) {
                    const response = await apiRequest(`/all-labels?limit=1000`, "GET", null, true);
                    if (response.success && response.data?.data) {
                        const label = response.data.data.find(l => String(l.id) === String(labelId) || String(l._id) === String(labelId));
                        if (label) {
                            formik.setValues({
                                name: label.name || "",
                                email: label.email || "",
                                country: label.country || "",
                                user_id: label.user_id || ""
                            });
                        } else {
                            toast.error("Label not found in list");
                            navigate("/view-label");
                        }
                    } else {
                        toast.error("Failed to load labels");
                    }
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
                toast.error("Failed to fetch initial data");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [labelId, isEdit]);

    if (loading) return <Loader message="Loading label details..." />;

    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="add-subLabel-sec">
                <div className="add-subLab">
                    <div className="add-subLabel-heading">
                        <h6>{isEdit ? "Edit Label" : "Add Label"}</h6>
                    </div>
                </div>
                <div className="add-subLabel-mainbox">
                    <div className="add-subLabel-box">
                        <form onSubmit={formik.handleSubmit} className="add-subLabels-form" id="add-subLabels-form">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required" htmlFor="name">
                                            Name
                                        </label>
                                        <input
                                            className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Label Name"
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <small className="text-danger">{formik.errors.name}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="label@example.com"
                                        />
                                        {formik.touched.email && formik.errors.email && (
                                            <small className="text-danger">{formik.errors.email}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required" htmlFor="user_id">
                                            User
                                        </label>
                                        <Select
                                            options={users.map(u => ({ value: u.id, label: u.name }))}
                                            value={users.map(u => ({ value: u.id, label: u.name })).find(u => u.value === formik.values.user_id) || null}
                                            onChange={(val) => formik.setFieldValue("user_id", val ? val.value : "")}
                                            onBlur={() => formik.setFieldTouched("user_id", true)}
                                            placeholder="-- Choose User --"
                                            className={formik.touched.user_id && formik.errors.user_id ? 'is-invalid' : ''}
                                            classNamePrefix="react-select"
                                        />
                                        {formik.touched.user_id && formik.errors.user_id && (
                                            <small className="text-danger">{formik.errors.user_id}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required" htmlFor="country">
                                            Country
                                        </label>
                                        <Select
                                            options={countryOptions}
                                            value={countryOptions.find(c => c.label === formik.values.country) || null}
                                            onChange={(val) => formik.setFieldValue("country", val ? val.label : "")}
                                            onBlur={() => formik.setFieldTouched("country", true)}
                                            placeholder="-- Choose Country --"
                                            className={formik.touched.country && formik.errors.country ? 'is-invalid' : ''}
                                            classNamePrefix="react-select"
                                        />
                                        {formik.touched.country && formik.errors.country && (
                                            <small className="text-danger">{formik.errors.country}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="col-12 mt-3">
                                    <div className="form-group add-sublab-group">
                                        <button
                                            type="submit"
                                            className="mainBtn bgPurple clWhite"
                                            id="requestBtn"
                                            disabled={formik.isSubmitting}
                                        >
                                            {formik.isSubmitting ? "Saving..." : "Save"}
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

export default AddLabelComponent;
