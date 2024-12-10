import React, { useState, useEffect } from "react";
import "../../App.css";
import { useAuthContext } from "../onboarding/authProvider";
import { UserButton } from "@clerk/clerk-react";

const UserSettings = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_id, user_id } = useAuthContext();

  // State for users data
  const [users, setUsers] = useState([]);

  // State for modal form
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);

  useEffect(() => {
    // Fetch users data
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseURL}/organizations/users/${org_id}/${user_id}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (user_id) fetchUsers();
  }, [baseURL,org_id, user_id]);

  // Handle form input change
  const handleFieldChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  // Save changes
  const handleSave = async () => {
    try {
      const response = await fetch(`${baseURL}/users/${editedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });
      if (response.ok) {
        // Update local state
        setUsers((prev) =>
          prev.map((user) => (user.default_id === editedUser.id ? editedUser : user))
        );
        setSelectedUser(null);
      } else {
        console.error("Error saving user:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Cancel edits
  const handleCancel = () => {
    setEditedUser(null);
    setSelectedUser(null);
  };

  return (
    <div style={{ padding: "5px", maxWidth: "1000px", margin: "0 auto" }}>
    
      <div style={{ display:"flex", alignItems: "center",}}>
<div style={{padding: "10px 20px",}} > Select the permissions for your team members </div>
<button
          type="button"
          style={{
            padding: "10px 15px",
            backgroundColor: "var(--primary-color)" ,
            color: "White",
            border: "none",
            borderRadius: "20px",
          }}
        >
          Invite user
        </button>

      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ marginBottom:"30px", backgroundColor:"gray" }}>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.default_id} 
            style={{ borderBottom: "1px solid lightgray",
            paddingBottom:"15px",
             marginTop:"15px"
              }}>
              <td><UserButton/></td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.phone}</td>
              <td>{user.status}</td>
              <td>
                <button
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                  }}
                  onClick={() => {
                    setSelectedUser(user);
                    setEditedUser({ ...user });
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <h3>Edit User</h3>
          <form>
            <div style={{ marginBottom: "10px" }}>
              <label>Name: </label>
              <input
                type="text"
                value={editedUser.username}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Email: </label>
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Role: </label>
              <input
                type="text"
                value={editedUser.role}
                onChange={(e) => handleFieldChange("role", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Phone: </label>
              <input
                type="text"
                value={editedUser.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Status: </label>
              <select
                value={editedUser.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: "10px",
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={handleCancel}
        />
      )}
    </div>
  );
};

export default UserSettings;
