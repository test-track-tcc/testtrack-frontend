import { getItem } from "../../utils/authStorage";

function SimpleHeader() {
  const storedUser = localStorage.getItem("userData");
  const userData = storedUser ? JSON.parse(storedUser) : null;

  return (
    <>
      <header className="simple-header">
        <h1>TestTrack</h1>
        {userData && <p>Olá, {userData?.name ?? "Usuário"}</p>}
      </header>
    </>
  )
}

export default SimpleHeader
