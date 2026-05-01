import { DSACard, DSAText } from "..";
import styles from "./resumen-card.module.css";

const ResumenCard = ({ data }) => {
  return (
    <DSACard>
      <div className={styles["resumen"]}>
        <DSAText variant="subtitle" className={styles["resumen-title"]}>
          Resumen del Período
        </DSAText>

        <div className={styles["resumen-row"]}>
          <span>Total de Reservas</span>
          <strong>{data.totalReservas}</strong>
        </div>

        <div className={styles["resumen-row"]}>
          <span>Ingresos Totales</span>
          <strong>{data.ingresos}</strong>
        </div>

        <div className={styles["resumen-row"]}>
          <span>Promedio por Reserva</span>
          <strong>{data.promedio}</strong>
        </div>

        <div className={styles["resumen-row"]}>
          <span>Cancha Más Popular</span>
          <strong>{data.canchaPopular}</strong>
        </div>

        <div className={styles["resumen-row"]}>
          <span>Tasa de Ocupación</span>
          <strong className={styles["green"]}>{data.ocupacion}</strong>
        </div>
      </div>
    </DSACard>
  );
};

export default ResumenCard;