/* eslint-disable react/prop-types */
import React, { useState} from "react";
import {
  TableContainer,
  Button,
  TablePagination,
  IconButton,
  Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteForever } from "@mui/icons-material";
import Badge from "../ui/Badge";

const AssetsTable = ({
  assets,
  onViewUnitsClick,
  onEditClick,
  onNewAssetClick,
  onDeleteClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(
    Array(assets.length).fill(false)
  );
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;


  const statusBadge = (s) => {
    if (s === 'active')  return <Badge type="green" dot>Active</Badge>
    if (s === 'idle')    return <Badge type="amber" dot>Idle</Badge>
    if (s === 'alert')   return <Badge type="red"   dot>Alert</Badge>
    if (s === 'service') return <Badge type="neutral">🔧 Service</Badge>
    return <Badge>{s}</Badge>
  }
  const handleCellClick = (rowIndex) => {
    setIsDropdownOpen((prevState) => {
      const newDropdowns = [...prevState];
      newDropdowns[rowIndex] = !newDropdowns[rowIndex];
      return newDropdowns;
    });
    onViewUnitsClick(rowIndex);
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedAssets = assets.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );
  return (
    <TableContainer component={Paper}>
      <table className="data-table">
        <thead>
            <tr><th>Reg</th><th>Status</th><th>Odometer</th><th>Driver</th><th>Last service</th><th> Actions</th><th>Edit</th></tr>
          </thead>

  
        <tbody>
          {/* Render a TableRowItem for each asset in the assets array */}
          {paginatedAssets.map((asset, index) => (
            <tr
              key={asset.id}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--secondary-bg-color)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--main-bg-color)")
              }
              sx={{ border: "none" }}
              onClick={(e) => {
                e.stopPropagation();
                onNewAssetClick(asset);
              }}
            >
              <td><div className="vtag"><div className="vico">🚐</div><div><div className="vname">{asset.a_license_plate}</div><div className="vid">{asset.a_year} {asset.a_make}</div></div></div></td>
                
              <td>{statusBadge(asset.a_status)}</td>
              <td style={{fontFamily:'var(--mono)',fontSize:12}} >{asset.a_mileage} KM</td>
              <td>{asset.a_status}</td>
              <td>{asset.a_status}</td>
              <td>
                <Button onClick={() => handleCellClick(asset.id)}>
                  {isDropdownOpen[index] ? "Close Details" : "view details"}
                </Button>
              </td>
              <td>
                <IconButton
                  onClick={() => onEditClick(asset.id)}
                  style={{ marginLeft: "10px" }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => onDeleteClick(asset.id)}
                  style={{ marginLeft: "10px" }}
                >
                  <DeleteForever sx={{ color: "red" }} />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Component */}
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={assets.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  );
};

export default AssetsTable;
