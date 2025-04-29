import React, { useState, useEffect } from "react";
import "../../App.css";
import { useAuthContext } from "../onboarding/authProvider";

const UserSettings = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_id, user_id } = useAuthContext();

  // State for users data
  const [users, setUsers] = useState([]);

  // State for modal form
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [invitedUser, setInvitedUser] = useState(false);

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
  const handleSave =  () => {
    const url = `${baseURL}/organizations/edituser/${org_id}/${user_id}/`;
    const options =  {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedUser),
    };
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          console.error("Error saving user:", response.statusText);
          throw new Error("Failed to edit user");
        }
          // Update local state
      setUsers((prev) =>
        prev.map((user) => (user.default_id === editedUser.id ? editedUser : user))
      );
      setSelectedUser(null);
      })
      .catch((error) => {
        console.error("Error saving user:", error);
      });


  };

  // Cancel edits
  const handleCancel = () => {
    setEditedUser(null);
    setSelectedUser(null);
    setInvitedUser(false);
  };


  // invite user
  const [userData, setUserData] = useState({
    email: null,
    username:null,
    role: "Driver",
    phone: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevAsset) => ({
      ...prevAsset,
      [name]: value,
    }));
  };

  const handleInvite = (e) => {
    // Define the URL for the POST request
    const url = `${baseURL}/organizations/users/${org_id}/${user_id}/`;
    const data = {
      email: userData.email,
      username:userData.username,
      role: userData.role,
      phone: userData.phone
    };
    const options = {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Specify the content type of the request body
      },
      body: JSON.stringify(data), // Convert data to JSON string for the request body
    };
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to invite user confirm user email");
        }
        console.log("user invited successfully");
        setInvitedUser(false);
      })
      .catch((error) => {
        console.error("Error inviting user:", error);
      });
  };

  return (
    <div style={{ padding: "5px", maxWidth: "1000px", margin: "0 auto" }}>
    
      <div style={{ display:"flex", alignItems: "center",}}>
<div style={{padding: "10px 20px",}} > Select the permissions for your team members </div>

<button
          type="button"
          onClick={() => {
            setInvitedUser(true);
          }}
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


{invitedUser && (
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
          <h3>Invite new User</h3>
          <form>
            <div style={{ marginBottom: "10px" }}>
              <label>Name: </label>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                style={{ width: "100%", padding: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Email: </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                style={{ width: "100%", padding: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
            <label>Role: </label>
            <select
              value={userData.role}
              name="role"
              onChange={handleChange}
              style={{ width: "100%", padding: "5px" }}
            >
              <option value="driver">Driver</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Phone: </label>
              <input
                type="text"
                name="phone"
                onChange={handleChange}
                style={{ width: "100%", padding: "5px" }}
              />
            </div>
 
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={handleInvite}
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




    </div>
  );
};

export default UserSettings;
