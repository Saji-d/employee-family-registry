import { useEffect, useState } from "react";
import API from "../services/api";
import AddEmployee from "../components/AddEmployee";
import FamilyManager from "../components/FamilyManager";
import EditEmployee from "../components/EditEmployee";

function Employees() {

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [role, setRole] = useState("admin");


  const fetchEmployees = async () => {
    const res = await API.get("/Employee");
    setEmployees(res.data);
  };


  useEffect(() => {
    fetchEmployees();
  }, []);


  // Debounced Search
  useEffect(() => {

    const delay = setTimeout(() => {

      if (search === "") {
        fetchEmployees();
      } else {
        searchEmployees();
      }

    }, 400);

    return () => clearTimeout(delay);

  }, [search]);


  const searchEmployees = async () => {

    const res = await API.get(`/Employee/search?query=${search}`);

    setEmployees(res.data);

  };


  const deleteEmployee = async (id) => {

    if (!window.confirm("Delete this employee?")) return;

    await API.delete(`/Employee/${id}`);

    fetchEmployees();

  };


const exportEmployeesPDF = () => {

  let url = "http://localhost:5026/api/Employee/export/pdf";

  if (search && search.trim() !== "") {
    url += `?query=${encodeURIComponent(search)}`;
  }

  window.open(url);

};


  const exportEmployeeCV = (id) => {

    window.open(`http://localhost:5026/api/Employee/${id}/export/cv`);

  };


  const selectedEmployeeData =
    employees.find(e => e.id === selectedEmployee);


  return (

    <div className="p-8 space-y-8">


      {/* ROLE SELECTOR */}
      <div className="flex items-center gap-4">

        <span className="text-gray-300 font-semibold">
          Role:
        </span>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded border border-gray-600"
        >
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>

        {role === "viewer" && (
          <span className="text-yellow-400 text-sm">
            (Viewer mode – read only)
          </span>
        )}

      </div>


      {/* ADD EMPLOYEE */}
      {role === "admin" && (

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">

          <AddEmployee onEmployeeAdded={fetchEmployees} />

        </div>

      )}


      {/* EMPLOYEE REGISTRY */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6 text-white">
          Employee Registry
        </h1>


        {/* SEARCH */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">

          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-600 bg-gray-900 text-white p-2 rounded w-64"
          />

          <button
            onClick={exportEmployeesPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            Export PDF
          </button>

        </div>


        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm text-left text-gray-300">

            <thead className="text-xs uppercase bg-gray-700 text-gray-200">

              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Salary</th>
                <th className="p-3">Family</th>
                <th className="p-3">Actions</th>
              </tr>

            </thead>


            <tbody>

              {employees.map((emp) => (

                <tr
                  key={emp.id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >

                  <td className="p-3 text-white font-medium">
                    {emp.name}
                  </td>

                  <td className="p-3">
                    {emp.department}
                  </td>

                  <td className="p-3">
                    {emp.phone}
                  </td>

                  <td className="p-3">
                    {emp.basicSalary}
                  </td>

                  <td className="p-3 text-sm">

                    <div>
                      {emp.spouse
                        ? `Spouse: ${emp.spouse.name}`
                        : "No spouse"}
                    </div>

                    <div>
                      Children: {emp.children ? emp.children.length : 0}
                    </div>

                  </td>


                  <td className="p-3 flex flex-wrap gap-2">

                    <button
                      onClick={() => exportEmployeeCV(emp.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                    >
                      CV
                    </button>


                    {/* ADMIN ONLY */}
                    {role === "admin" && (

                      <>

                        <button
                          onClick={() => setEditingEmployee(emp)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => setSelectedEmployee(emp.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Family
                        </button>

                        <button
                          onClick={() => deleteEmployee(emp.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* FAMILY MANAGER */}
      {selectedEmployee && role === "admin" && (

        <FamilyManager
          employeeId={selectedEmployee}
          employee={selectedEmployeeData}
          onClose={() => setSelectedEmployee(null)}
          onUpdated={fetchEmployees}
        />

      )}


      {/* UPDATE EMPLOYEE PANEL */}
      {editingEmployee && (

        <EditEmployee
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onUpdated={fetchEmployees}
        />

      )}

    </div>

  );

}

export default Employees;