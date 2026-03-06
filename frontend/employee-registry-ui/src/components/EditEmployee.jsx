import { useState, useEffect } from "react";
import API from "../services/api";

function EditEmployee({ employee, onClose, onUpdated }) {

  const [form, setForm] = useState({
    name: "",
    nid: "",
    phone: "",
    department: "",
    basicSalary: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (employee) {

      setForm({
        name: employee.name || "",
        nid: employee.nid || "",
        phone: employee.phone || "",
        department: employee.department || "",
        basicSalary: employee.basicSalary || ""
      });

    }

  }, [employee]);


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const updateEmployee = async () => {

    if (loading) return;

    setLoading(true);
    setErrors({});

    try {

      await API.put(`/Employee/${employee.id}`, {
        ...form,
        basicSalary: form.basicSalary ? Number(form.basicSalary) : 0
      });

      onUpdated && onUpdated();

      onClose();

    } catch (err) {

      if (err.response?.data?.errors)
        setErrors(err.response.data.errors);
      else
        setErrors({ General: ["Failed to update employee"] });

    }

    setLoading(false);

  };


  return (

    <div className="bg-gray-800 p-6 rounded-xl shadow-lg mt-6">

      <h2 className="text-xl font-bold text-white mb-4">
        Edit Employee
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 rounded bg-gray-900 text-white border border-gray-600"
        />

        <input
          name="nid"
          placeholder="NID"
          value={form.nid}
          onChange={handleChange}
          className="p-2 rounded bg-gray-900 text-white border border-gray-600"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="p-2 rounded bg-gray-900 text-white border border-gray-600"
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          className="p-2 rounded bg-gray-900 text-white border border-gray-600"
        />

        <input
          name="basicSalary"
          type="number"
          placeholder="Salary"
          value={form.basicSalary}
          onChange={handleChange}
          className="p-2 rounded bg-gray-900 text-white border border-gray-600"
        />

      </div>

      {errors.General && (
        <p className="text-red-500 text-sm mt-2">
          {errors.General[0]}
        </p>
      )}

      <div className="flex gap-3 mt-4">

        <button
          onClick={updateEmployee}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Updating..." : "Update"}
        </button>

        <button
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>

      </div>

    </div>

  );

}

export default EditEmployee;