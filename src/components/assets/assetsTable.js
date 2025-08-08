/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  IconButton,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteForever } from "@mui/icons-material";

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
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow
            backgroundColor="var(--secondary-bg-color)"
            style={{ backgroundColor: "var(--secondary-bg-color)" }}
          >
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
              Reg
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
              Mileage
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
              Make
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
              Model
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
              Preview
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
              Edit
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Render a TableRowItem for each asset in the assets array */}
          {paginatedAssets.map((asset, index) => (
            <TableRow
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
              <TableCell>{asset.a_license_plate}</TableCell>
              <TableCell>{asset.a_status}</TableCell>
              <TableCell>{asset.a_mileage}</TableCell>
              <TableCell>{asset.a_make}</TableCell>
              <TableCell>
                {asset.a_model}-{asset.a_year}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleCellClick(asset.id)}>
                  {isDropdownOpen[index] ? "Close Details" : "Details"}
                </Button>
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
