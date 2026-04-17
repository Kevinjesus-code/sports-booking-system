import { DSACard, DSAText } from "..";
import "./resumen-card.css";

const ResumenCard = ({ data }) => {
  return (
    <DSACard>
      <div className="resumen">
        <DSAText variant="subtitle" className="resumen-title">
          Resumen del Período
        </DSAText>

        <div className="resumen-row">
          <span>Total de Reservas</span>
          <strong>{data.totalReservas}</strong>
        </div>

        <div className="resumen-row">
          <span>Ingresos Totales</span>
          <strong>{data.ingresos}</strong>
        </div>

        <div className="resumen-row">
          <span>Promedio por Reserva</span>
          <strong>{data.promedio}</strong>
        </div>

        <div className="resumen-row">
          <span>Cancha Más Popular</span>
          <strong>{data.canchaPopular}</strong>
        </div>

        <div className="resumen-row">
          <span>Tasa de Ocupación</span>
          <strong className="green">{data.ocupacion}</strong>
        </div>
      </div>
    </DSACard>
  );
};

export default ResumenCard;