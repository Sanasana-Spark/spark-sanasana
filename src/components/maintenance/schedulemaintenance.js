import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Paper,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useAuthContext } from "../onboarding/authProvider";

const AddAssetForm = ({ onSubmit, onCancel, open }) => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { user_id, org_id } = useAuthContext();
  const [assetOptions, setAssetOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (org_id && user_id) {
      const apiUrl = `${baseURL}/assets/${org_id}/${user_id}`;
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setAssetOptions(data.assets || []); // Ensure we set an empty array if assets is undefined
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [baseURL, org_id, user_id, open]); // Empty dependency array ensures this effect runs only once when the component mounts

  //   const classes = useStyles();
  const [maitenance, setMaitenance] = useState({
    m_status: "pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaitenance((prevAsset) => ({
      ...prevAsset,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    onSubmit(maitenance);
    // Optionally, you can reset the form after submission
    setMaitenance({
      m_status: "pending"
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMaitenance({
          ...maitenance,
            "m_attachment": {
                name: file.name,
                type: file.type,
                size: file.size,
                data: reader.result.split(",")[1], // Extract the base64 string
          }, // base64 string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Schedule Maintenance</DialogTitle>
      <DialogContent>
        <Paper className={"classes.paper"}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl required sx={{ width: "225px" }}>
                  <InputLabel id="asset-label">Vehicle</InputLabel>
                  <Select
                    labelId="asset-label"
                    id="assigned-vehicle-select"
                    label="Assigned Vehicle"
                    name="m_asset_id"
                    value={maitenance.m_asset_id}
                    onChange={handleChange}
                  >
                    {assetOptions && assetOptions.length > 0
                      ? assetOptions.map((asset) => (
                          <MenuItem key={asset.id} value={asset.id}>
                            {asset.a_license_plate} - {asset.a_status}
                          </MenuItem>
                        ))
                      : loading && (
                          <MenuItem disabled>Loading Vehicle...</MenuItem>
                        )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl
                  required
                  sx={{ width: "225px" }}
                  variant="outlined"
                >
                  <TextField
                    select
                    label="Type"
                    name="m_type"
                    value={maitenance.m_type}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    <MenuItem value="preventative"> preventative </MenuItem>
                    <MenuItem value="corrective"> corrective</MenuItem>
                    <MenuItem value="servicing"> Genral servicing</MenuItem>
                    <MenuItem value="other"> Other </MenuItem>
                  </TextField>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Description"
                  name="m_description"
                  value={maitenance.m_description}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ width: "225px" }}
                  required
                  id="status-label"
                  label="Date"
                  name="m_date"
                  type="date"
                  value={maitenance.m_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Estimated Cost"
                  name="m_estimated_cost"
                  value={maitenance.m_estimated_cost}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>

              {/* <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Total Cost"
                  name="m_total_cost"
                  value={maitenance.m_total_cost}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid> */}

              <Grid item xs={12} sm={6}>
                <FormControl
                  required
                  sx={{ width: "225px" }}
                  variant="outlined"
                >
                  <TextField
                    select
                    label="Insurance coverage"
                    name="m_insurance_coverage"
                    value={maitenance.m_insurance_coverage}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    <MenuItem value="fully">fully</MenuItem>
                    <MenuItem value="partial">partial</MenuItem>
                    <MenuItem value="none">none</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel>Attachment </FormLabel>
                  <input
                    accept="application/pdf, image/*"
                    type="file"
                    onChange={handleFileChange}
                    name="o_attachment1"
                  />
                </FormControl>
              </Grid>
            </Grid>
            <DialogActions>
            <Button variant="contained" color="primary" 
           onClick={() => { onCancel(); setSaving(false); }}

            >
                Cancel
              </Button>
              <Button type="submit" variant="contained" 
              sx={{ backgroundColor: "var(--secondary-color)", color: "white" }}
              
               disabled={saving} 
              >
                {saving ? "submitting..." : "Submit"} 
              </Button>
              
            </DialogActions>
          </form>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

AddAssetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddAssetForm;
