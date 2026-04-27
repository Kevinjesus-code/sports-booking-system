import { DSAButton, DSACourtsTable, DSAText } from "../../../components";
import styles from "./courts.module.css";

const Courts = () => {
  const mockCourts = [
    {
      id: 1,
      nombre: "Cancha 1",
      type: "Fútbol 5",
      state: "Disponible",
    },
    {
      id: 2,
      nombre: "Cancha 2",
      type: "Fútbol 7",
      state: "Ocupada",
    },
    {
      id: 3,
      nombre: "Cancha 3",
      type: "Tenis",
      state: "Mantenimiento",
    },
    {
      id: 4,
      nombre: "Cancha 4",
      type: "Pádel",
      state: "Disponible",
    },
  ];
  return (
    <>
      <div>
        <div className={styles.containerHeaderCourts}>
          <div>
            <DSAText variant="title">Canchas</DSAText>
            <DSAText variant="text" color={"#6B7280"}>
              Gestiona las canchas deportivas
            </DSAText>
          </div>
         <div className={styles.containerButtonCourts}>
           <DSAButton>Crear cancha</DSAButton>
         </div>
        </div>
        <div className={styles.containerReservations}>
          <DSACourtsTable data={mockCourts} />
        </div>
      </div>
    </>
  );
};
export default Courts;
