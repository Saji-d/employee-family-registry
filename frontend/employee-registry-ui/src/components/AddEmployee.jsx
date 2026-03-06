import { useState } from "react";
import API from "../services/api";

function AddEmployee({ onEmployeeAdded }) {

  const [employee, setEmployee] = useState({
    name: "",
    nid: "",
    phone: "",
    department: "",
    basicSalary: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    });
  };

  const createEmployee = async () => {

    setLoading(true);
    setErrors({});

    try {

      await API.post("/Employee", {
        ...employee,
        basicSalary: Number(employee.basicSalary)
      });

      setEmployee({
        name: "",
        nid: "",
        phone: "",
        department: "",
        basicSalary: ""
      });

      onEmployeeAdded();

    } catch (err) {

      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("Something went wrong while creating employee.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded mb-6">

      <h2 className="text-xl font-bold mb-4">Add Employee</h2>

      <div className="grid grid-cols-2 gap-4">

        {/* NAME */}
        <div>
          <input
            name="name"
            placeholder="Name"
            value={employee.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.Name && (
            <p className="text-red-500 text-sm">{errors.Name[0]}</p>
          )}
        </div>

        {/* NID */}
        <div>
          <input
            name="nid"
            placeholder="NID (10 or 17 digits)"
            value={employee.nid}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.NID && (
            <p className="text-red-500 text-sm">{errors.NID[0]}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <input
            name="phone"
            placeholder="Phone (BD format)"
            value={employee.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.Phone && (
            <p className="text-red-500 text-sm">{errors.Phone[0]}</p>
          )}
        </div>

        {/* DEPARTMENT */}
        <div>
          <input
            name="department"
            placeholder="Department"
            value={employee.department}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.Department && (
            <p className="text-red-500 text-sm">{errors.Department[0]}</p>
          )}
        </div>

        {/* SALARY */}
        <div>
          <input
            type="number"
            name="basicSalary"
            placeholder="Salary"
            value={employee.basicSalary}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.BasicSalary && (
            <p className="text-red-500 text-sm">{errors.BasicSalary[0]}</p>
          )}
        </div>

      </div>

      <button
        onClick={createEmployee}
        disabled={loading}
        className={`mt-4 px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Adding..." : "Add Employee"}
      </button>

    </div>
  );
}

export default AddEmployee;