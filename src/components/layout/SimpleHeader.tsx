import React, { useState } from "react";
import { Avatar, Menu, MenuItem, Divider, ListItemIcon, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import { getInitials } from "../../utils/getInitials";
import { useAuth } from "../../functions/AuthFunctions";

function SimpleHeader() {
  const storedUser = localStorage.getItem("userData");
  const userData = storedUser ? JSON.parse(storedUser) : null;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const { handleLogout } = useAuth();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    alert("Editar conta");
    handleMenuClose();
  };

  const handleDelete = () => {
    alert("Apagar conta");
    handleMenuClose();
  };

  return (
    <header className="simple-header">
      <h1 className="title-header-link">
        <a href={userData ? "/organization" : "/login"}>
          TestTrack
        </a>
      </h1>

      {userData && (
        <div className="photo-name-user" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {userData.name && <p>Olá, {userData.name}</p>}
          <Avatar
            sx={{ cursor: "pointer" }}
            onClick={handleMenuOpen}
          >
            {userData.avatarUrl ? (
              <img src={userData.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
            ) : (
              getInitials(userData.name)
            )}
          </Avatar>
        </div>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Cabeçalho */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography fontWeight="bold">{userData?.name}</Typography>
          <Typography color="text.secondary">{userData?.email}</Typography>
        </Box>

        <Divider />

        {/* Ações */}
        <MenuItem onClick={handleEdit}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Editar conta
        </MenuItem>
        <MenuItem onClick={handleDelete} >
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          Apagar conta
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </header>
  );
}

export default SimpleHeader;
