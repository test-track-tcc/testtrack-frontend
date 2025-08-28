import { Avatar } from "@mui/material";
import { getInitials } from "../../utils/getInitials";

function SimpleHeader() {
  const storedUser = localStorage.getItem("userData");
  const userData = storedUser ? JSON.parse(storedUser) : null;

  return (
    <>
      <header className="simple-header">
        <h1>TestTrack</h1>

        <div className="photo-name-user">
          {userData?.name && <p>Olá, {userData?.name ?? "Usuário"}</p>}
          <Avatar>{userData ? getInitials(userData.name) : ''}</Avatar>
        </div>
      </header>
    </>
  )
}

export default SimpleHeader
