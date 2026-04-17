import {
  DSAText,
  DSAUsersTable,
} from "../../../components";
const Users = () => {
    const data = [
  {
    id: 1,
    nombre: "Juan Pérez",
    dni: "12345678-9",
    correo: "juan.perez@gmail.com",
    telefono: "+569 1234 5678",
    rol: "Cliente",
  },
  {
    id: 2,
    nombre: "María González",
    dni: "23456789-0",
    correo: "maria.gonzalez@outlook.com",
    telefono: "+569 8765 4321",
    rol: "Cliente",
  },
  {
    id: 3,
    nombre: "Admin Principal",
    dni: "99999999-9",
    correo: "admin@sistema.com",
    telefono: "+569 9999 9999",
    rol: "Administrador",
  },
  {
    id: 4,
    nombre: "Carlos Ramírez",
    dni: "34567890-1",
    correo: "carlos.ramirez@yahoo.com",
    telefono: "+569 5555 5555",
    rol: "Cliente",
  },
  {
    id: 5,
    nombre: "Ana Martínez",
    dni: "45678901-2",
    correo: "ana.martinez@gmail.com",
    telefono: "+569 4444 4444",
    rol: "Cliente",
  },
  {
    id: 6,
    nombre: "Laura Torres",
    dni: "56789012-3",
    correo: "laura.torres@recep.com",
    telefono: "+569 3333 3333",
    rol: "Recepcionista",
  },
  {
    id: 7,
    nombre: "Diego Silva",
    dni: "67890123-4",
    correo: "diego.silva@recep.com",
    telefono: "+569 2222 2222",
    rol: "Recepcionista",
  },
  {
    id: 8,
    nombre: "Sofía Herrera",
    dni: "78901234-5",
    correo: "sofia.herrera@gmail.com",
    telefono: "+569 1111 1111",
    rol: "Cliente",
  },
  {
    id: 9,
    nombre: "Pedro Rojas",
    dni: "89012345-6",
    correo: "pedro.rojas@hotmail.com",
    telefono: "+569 7777 8888",
    rol: "Cliente",
  },
  {
    id: 10,
    nombre: "Valentina Castro",
    dni: "90123456-7",
    correo: "valentina.castro@gmail.com",
    telefono: "+569 6666 9999",
    rol: "Cliente",
  },
];
  return (
    <>
      <div>
        <div className="containerHeader">
          <DSAText variant="title">Usuarios</DSAText>
          <DSAText variant="text" color={"#6B7280"}>
            Gestiona los usuarios del sistema
          </DSAText>
        </div>
        <div className="containerReservations">
         <DSAUsersTable data={data} />
        </div>
      </div>
    </>
  );
};

export default Users;
