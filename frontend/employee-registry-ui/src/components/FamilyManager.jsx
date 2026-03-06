import { useState, useEffect } from "react";
import API from "../services/api";

function FamilyManager({ employeeId, employee, onClose, onUpdated }) {

  const [spouse, setSpouse] = useState({ name: "", nid: "" });
  const [child, setChild] = useState({ name: "", dateOfBirth: "" });

  const [spouseErrors, setSpouseErrors] = useState({});
  const [childErrors, setChildErrors] = useState({});

  const [loadingSpouse, setLoadingSpouse] = useState(false);
  const [loadingChild, setLoadingChild] = useState(false);

  const hasSpouse = employee?.spouse != null;


  // Reset form whenever employee changes
  useEffect(() => {

    setSpouse({
      name: "",
      nid: ""
    });

    setChild({
      name: "",
      dateOfBirth: ""
    });

    setSpouseErrors({});
    setChildErrors({});

  }, [employeeId]);


  const addSpouse = async () => {

    if (loadingSpouse || hasSpouse) return;

    setLoadingSpouse(true);
    setSpouseErrors({});

    const errors = {};

    if (!spouse.name)
      errors.Name = ["Spouse name is required"];

    if (!spouse.nid)
      errors.NID = ["Spouse NID is required"];

    if (Object.keys(errors).length > 0) {
      setSpouseErrors(errors);
      setLoadingSpouse(false);
      return;
    }

    try {

      await API.post(`/Employee/${employeeId}/spouse`, spouse);

      setSpouse({
        name: "",
        nid: ""
      });

      onUpdated && onUpdated();

    } catch (err) {

      if (err.response?.data?.errors)
        setSpouseErrors(err.response.data.errors);
      else
        setSpouseErrors({ General: ["Failed to add spouse"] });

    }

    setLoadingSpouse(false);
  };


  const addChild = async () => {

    if (loadingChild) return;

    setLoadingChild(true);
    setChildErrors({});

    const errors = {};

    if (!child.name)
      errors.Name = ["Child name is required"];

    if (!child.dateOfBirth)
      errors.DateOfBirth = ["Date of Birth is required"];

    if (Object.keys(errors).length > 0) {
      setChildErrors(errors);
      setLoadingChild(false);
      return;
    }

    try {

      await API.post(`/Employee/${employeeId}/children`, {
        name: child.name,
        dateOfBirth: new Date(child.dateOfBirth).toISOString()
      });

      setChild({
        name: "",
        dateOfBirth: ""
      });

      onUpdated && onUpdated();

    } catch (err) {

      if (err.response?.data?.errors)
        setChildErrors(err.response.data.errors);
      else
        setChildErrors({ General: ["Failed to add child"] });

    }

    setLoadingChild(false);
  };


  return (
    <div className="bg-white p-6 shadow rounded mt-4">

      <h2 className="text-xl font-bold mb-4">Family Management</h2>


      {/* SPOUSE SECTION */}
      <div className="mb-6">

        <h3 className="font-semibold mb-2">Add Spouse</h3>

        <input
          placeholder="Spouse Name"
          value={spouse.name}
          disabled={hasSpouse}
          onChange={(e)=>setSpouse({...spouse,name:e.target.value})}
          className="border p-2 rounded w-full mb-1"
        />

        {(spouseErrors.Name || spouseErrors["spouse.Name"]) && (
          <p className="text-red-500 text-sm">
            {(spouseErrors.Name || spouseErrors["spouse.Name"])[0]}
          </p>
        )}

        <input
          placeholder="Spouse NID"
          value={spouse.nid}
          disabled={hasSpouse}
          onChange={(e)=>setSpouse({...spouse,nid:e.target.value})}
          className="border p-2 rounded w-full mb-1"
        />

        {(spouseErrors.NID || spouseErrors["spouse.NID"]) && (
          <p className="text-red-500 text-sm">
            {(spouseErrors.NID || spouseErrors["spouse.NID"])[0]}
          </p>
        )}

        <button
          onClick={addSpouse}
          disabled={loadingSpouse || hasSpouse}
          className="bg-blue-500 text-white px-3 py-1 rounded mt-2 disabled:bg-gray-400"
        >
          {hasSpouse ? "Spouse already added" : (loadingSpouse ? "Adding..." : "Add Spouse")}
        </button>

        {hasSpouse && (
          <p className="text-yellow-500 text-sm mt-2">
            This employee already has a spouse. Only one spouse is allowed.
          </p>
        )}

        {spouseErrors.General && (
          <p className="text-red-500 text-sm mt-2">
            {spouseErrors.General[0]}
          </p>
        )}

      </div>


      {/* CHILD SECTION */}
      <div>

        <h3 className="font-semibold mb-2">Add Child</h3>

        <input
          placeholder="Child Name"
          value={child.name}
          onChange={(e)=>setChild({...child,name:e.target.value})}
          className="border p-2 rounded w-full mb-1"
        />

        {(childErrors.Name || childErrors["child.Name"]) && (
          <p className="text-red-500 text-sm">
            {(childErrors.Name || childErrors["child.Name"])[0]}
          </p>
        )}

        <input
          type="date"
          value={child.dateOfBirth}
          onChange={(e)=>setChild({...child,dateOfBirth:e.target.value})}
          onKeyDown={(e) => e.preventDefault()}
          className="border p-2 rounded w-full mb-1"
        />

        {(childErrors.DateOfBirth || childErrors["child.DateOfBirth"]) && (
          <p className="text-red-500 text-sm">
            {(childErrors.DateOfBirth || childErrors["child.DateOfBirth"])[0]}
          </p>
        )}

        <button
          onClick={addChild}
          disabled={loadingChild}
          className="bg-green-600 text-white px-3 py-1 rounded mt-2 disabled:bg-gray-400"
        >
          {loadingChild ? "Adding..." : "Add Child"}
        </button>

        {childErrors.General && (
          <p className="text-red-500 text-sm mt-1">
            {childErrors.General[0]}
          </p>
        )}

      </div>

      <button
        onClick={onClose}
        className="mt-6 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Close
      </button>

    </div>
  );
}

export default FamilyManager;