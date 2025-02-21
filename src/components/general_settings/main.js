import React, { useState, useEffect } from "react";
import  "../../App.css";
import { useAuthContext } from '../onboarding/authProvider';

const OrganizationForm = () => {
  const baseURL = process.env.REACT_APP_BASE_URL
  const { user_id, org_id} = useAuthContext();
  // State to hold organization details fetched from backend
  const [organization, setOrganization] = useState({
    logo: "",
    name: "",
    email: "",
    phone: "",
    language: "English",
    country: "USA",
    currency: "USD",

  });

  // State to manage editable fields
  const [editingField, setEditingField] = useState(null);
  const [editedOrganization, setEditedOrganization] = useState({});


  useEffect(() => {
    const fetchOrganization = async () => {
      if (user_id) {
        try {
          const response = await fetch(`${baseURL}/organizations/${org_id}`);
          if (response.ok) {
            const data = await response.json();
            // Assuming data is an array with one item
            if (Array.isArray(data) && data.length > 0) {
              setOrganization(data[0]);
              setEditedOrganization(data[0]); // Initialize edited fields
            } else {
              console.error('Error: Organization data is not an array or is empty');
            }
          } else {
            console.error('Error fetching organization:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching organization:', error);
        }
      }
    };
    fetchOrganization();
  },[ baseURL, org_id, user_id]);

  const handleFieldChange = (field, value) => {
    const updatedOrg = {
      ...editedOrganization,
      [field]: value,
    };
    setEditedOrganization(updatedOrg);
  };


  const handleSave = (field) => {
    setOrganization(editedOrganization);
    setEditingField(null); // Exit edit mode for the field
  };

  return(
  <div style={{ padding: "5px", maxWidth: "100%", margin: "0 auto" }}>
  <form>
    {/* Logo */}
    <div
  style={{
    paddingBottom: "20px",
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
    borderBottom: "solid 0.75px gray",
  }}
>
  {/* Label Section */}
  <div style={{ flex: 1, fontWeight: "light"  }}>Logo</div>

  {/* Display or Edit Mode Section */}
  <div style={{ flex: 2 }}>
    {editingField === "logo" ? (
      // Edit Mode: Show Input and Save/Cancel Buttons
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          value={editedOrganization.org_logo_url}
          onChange={(e) => handleFieldChange("logo", e.target.value)}
          style={{
            flex: 1,
            padding: "5px",
          }}
        />
        <button
          type="button"
          onClick={() => handleSave("logo")}
          style={{
            padding: "5px 10px",
            backgroundColor: "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            // Cancel changes: Reset the edited field and exit edit mode
            setEditedOrganization((prev) => ({ ...prev, logo: organization.org_logo_url }));
            setEditingField(null);
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Cancel
        </button>
      </div>
    ) : (
      // View Mode: Show Image and Edit Button
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img
          src={organization.org_logo_url}
          alt="Logo"
          style={{
            width: "100px",
            height: "auto",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
        <button
          type="button"
          onClick={() => setEditingField("logo")}
          style={{
            padding: "5px 10px",
            backgroundColor: "var(--faded-primary-color)" ,
            color: "black",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Edit
        </button>
      </div>
    )}
  </div>
</div>


    {/* Name */}
    <div style={{ paddingBottom: "20px",
    marginTop: "15px", display: "flex", alignItems: "center", borderBottom: "solid 0.75px gray" }}>
  
  <div style={{ flex: 1, fontWeight: "light"  }}>Name</div>

  <div style={{ flex: 2 }}>
    {editingField === "name" ? (
      // Edit Mode: Show Input and Save Button
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          value={editedOrganization.org_name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          style={{ flex: 1, padding: "5px" }}
        />
        <button
          type="button"
          onClick={() => handleSave("name")}
          style={{
            padding: "5px 10px",
             backgroundColor: "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            setEditedOrganization((prev) => ({ ...prev, name: organization.org_name }));
            setEditingField(null);
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Cancel
        </button>

      </div>
    ) : (
      // View Mode: Show Field Value and Edit Button
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, flex: 1 }}>{organization.org_name}</p>
        <button
          type="button"
          onClick={() => setEditingField("name")}
          style={{
            padding: "5px 10px",
           backgroundColor: "var( --faded-primary-color)",
            color: "black",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Edit
        </button>
      </div>
    )}
  </div>

</div>


    {/* Email */}
    <div
  style={{
    paddingBottom: "20px",
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
    borderBottom: "solid 0.75px gray",
  }}
>
  {/* Label Section */}
  <div style={{ flex: 1, fontWeight: "light"  }}>Email</div>

  {/* Display or Edit Mode Section */}
  <div style={{ flex: 2 }}>
    {editingField === "email" ? (
      // Edit Mode: Show Input and Save/Cancel Buttons
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="email"
          value={editedOrganization.org_email}
          onChange={(e) => handleFieldChange("email", e.target.value)}
          style={{
            flex: 1,
            padding: "5px",
          }}
        />
        <button
          type="button"
          onClick={() => handleSave("email")}
          style={{
            padding: "5px 10px",
            backgroundColor: "var(--primary-color)",
            color: "black",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            // Cancel changes: Reset the edited field and exit edit mode
            setEditedOrganization((prev) => ({
              ...prev,
              email: organization.org_email,
            }));
            setEditingField(null);
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Cancel
        </button>
      </div>
    ) : (
      // View Mode: Show Field Value and Edit Button
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0, flex: 1 }}>{organization.org_email}</p>
        <button
          type="button"
          onClick={() => setEditingField("email")}
          style={{
            padding: "5px 10px",
           backgroundColor: "var( --faded-primary-color)",
            color: "black",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Edit
        </button>
      </div>
    )}
  </div>
</div>


    {/* Phone */}
    <div
  style={{
    paddingBottom: "20px",
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
    borderBottom: "solid 0.75px gray",
  }}
>
  {/* Label Section */}
  <div style={{ flex: 1, fontWeight: "light"  }}>Phone</div>

  {/* Display or Edit Mode Section */}
  <div style={{ flex: 2 }}>
    {editingField === "phone" ? (
      // Edit Mode: Show Input and Save/Cancel Buttons
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="text"
          value={editedOrganization.org_phone}
          onChange={(e) => handleFieldChange("phone", e.target.value)}
          style={{
            flex: 1,
            padding: "5px",
          }}
        />
        <button
          type="button"
          onClick={() => handleSave("phone")}
          style={{
            padding: "5px 10px",
             backgroundColor: "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            // Cancel changes: Reset the edited field and exit edit mode
            setEditedOrganization((prev) => ({
              ...prev,
              phone: organization.org_phone,
            }));
            setEditingField(null);
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Cancel
        </button>
      </div>
    ) : (
      // View Mode: Show Field Value and Edit Button
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0, flex: 1 }}>{organization.org_phone}</p>
        <button
          type="button"
          onClick={() => setEditingField("phone")}
          style={{
            padding: "5px 10px",
           backgroundColor: "var( --faded-primary-color)",
            color: "black",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Edit
        </button>
      </div>
    )}
  </div>
</div>

<div
  style={{
    paddingBottom: "20px",
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
    borderBottom: "solid 0.75px gray",
  }}
>   <h3>Preferences</h3>  </div>

   

    {/* Language */}
<div
  style={{
    paddingBottom: "20px",
    marginTop: "15px",
    display: "flex",
    alignItems: "center",
    borderBottom: "solid 0.75px gray",
  }}
>
  {/* Label Section */}
  <div style={{ flex: 1, fontWeight: "light" }}>Language</div>

  {/* Display or Edit Mode Section */}
  <div style={{ flex: 2 }}>
    {editingField === "language" ? (
      // Edit Mode: Show Dropdown and Save/Cancel Buttons
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

        <select
          value={editedOrganization.org_lang}
          onChange={(e) => handleFieldChange("language", e.target.value)}
          style={{
            flex: 1,
            padding: "5px",
          }}
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
        </select>
        <button
          type="button"
          onClick={() => handleSave("language")}
          style={{
            padding: "5px 10px",
             backgroundColor: "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            // Cancel changes: Reset the edited field and exit edit mode
            setEditedOrganization((prev) => ({
              ...prev,
              language: organization.org_lang,
            }));
            setEditingField(null);
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Cancel
        </button>
      </div>
    ) : (
      // View Mode: Show Field Value and Edit Button
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0, flex: 1 }}>{organization.org_lang}</p>
        <button
          type="button"
          onClick={() => setEditingField("language")}
          style={{
            padding: "5px 10px",
           backgroundColor: "var( --faded-primary-color)",
            color: "black",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Edit
        </button>
      </div>
    )}
  </div>
</div>

    {/* Country */}
    <div
  style={{
    paddingBottom: "30px",
    display: "flex",
    alignItems: "center",
    borderBottom: "solid 0.75px gray",
  }}
>
  {/* Label Section */}
  <div style={{ flex: 1, fontWeight: "light"  }}>Country</div>

  {/* Display or Edit Mode Section */}
  <div style={{ flex: 2 }}>
    {editingField === "country" ? (
      // Edit Mode: Show Dropdown and Save/Cancel Buttons
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <select
          value={editedOrganization.org_country}
          onChange={(e) => handleFieldChange("country", e.target.value)}
          style={{
            flex: 1,
            padding: "5px",
          }}
        >
          <option value="USA">Kenya</option>
          <option value="Canada">Ghana</option>
          <option value="UK">Other</option>
        </select>
        <button
          type="button"
          onClick={() => handleSave("country")}
          style={{
            padding: "5px 10px",
            backgroundColor: "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            // Cancel changes: Reset the edited field and exit edit mode
            setEditedOrganization((prev) => ({
              ...prev,
              country: organization.org_country,
            }));
            setEditingField(null);
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Cancel
        </button>
      </div>
    ) : (
      // View Mode: Show Field Value and Edit Button
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0, flex: 1 }}>{organization.org_country}</p>
        <button
          type="button"
          onClick={() => setEditingField("country")}
          style={{
            padding: "5px 10px",
           backgroundColor: "var(--faded-primary-color)",
            color: "black",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Edit
        </button>
      </div>
    )}
  </div>
</div>


    {/* Currency */}
    <div
  style={{
    paddingBottom: "20px",
    marginTop: "15px",
    marginBottom: "50px",
    display: "flex",
    alignItems: "center",
    borderBottom: "solid 0.75px gray",
  }}
>
  {/* Label Section */}
  <div style={{ flex: 1, fontWeight: "light"  }}>Currency</div>

  {/* Display or Edit Mode Section */}
  <div style={{ flex: 2 }}>
    {editingField === "currency" ? (
      // Edit Mode: Show Dropdown and Save/Cancel Buttons
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <select
          value={editedOrganization.org_currency}
          onChange={(e) => handleFieldChange("currency", e.target.value)}
          style={{
            flex: 1,
            padding: "5px",
          }}
        >
          <option value="USD">Kes</option>
          <option value="EUR">Cedis</option>
          <option value="GBP">Usd</option>
        </select>
        <button
          type="button"
          onClick={() => handleSave("currency")}
          style={{
            padding: "5px 10px",
             backgroundColor: "var(--primary-color)",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            // Cancel changes: Reset the edited field and exit edit mode
            setEditedOrganization((prev) => ({
              ...prev,
              currency: organization.org_currency,
            }));
            setEditingField(null);
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Cancel
        </button>
      </div>
    ) : (
      // View Mode: Show Field Value and Edit Button
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0, flex: 1 }}>{organization.org_currency}</p>
        <button
          type="button"
          onClick={() => setEditingField("currency")}
          style={{
            padding: "5px 10px",
           backgroundColor: "var( --faded-primary-color)",
            color: "black",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Edit
        </button>
      </div>
    )}
  </div>
</div>

  </form>
</div>
);
};

export default OrganizationForm;
