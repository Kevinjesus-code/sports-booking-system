import React, { useState } from "react";
import { DSAText } from "../../../components";
import styles from "./schedules.module.css";

const hours = [
  "08:00 - 09:00","09:00 - 10:00","10:00 - 11:00","11:00 - 12:00",
  "14:00 - 15:00","15:00 - 16:00","16:00 - 17:00","17:00 - 18:00",
  "18:00 - 19:00","19:00 - 20:00",
];

const courts = [
  { name: "Cancha A", type: "Fútbol 5"  },
  { name: "Cancha B", type: "Fútbol 7"  },
  { name: "Cancha C", type: "Voley"     },
  { name: "Cancha D", type: "Fútbol 11" },
];

const initialData = {
  "08:00 - 09:00": ["Disponible","Disponible","Bloqueado","Disponible"],
  "09:00 - 10:00": ["Disponible","Ocupado","Disponible","Disponible"],
  "10:00 - 11:00": ["Ocupado","Disponible","Disponible","Bloqueado"],
  "11:00 - 12:00": ["Disponible","Disponible","Ocupado","Disponible"],
  "14:00 - 15:00": ["Ocupado","Disponible","Disponible","Disponible"],
  "15:00 - 16:00": ["Disponible","Ocupado","Disponible","Ocupado"],
  "16:00 - 17:00": ["Disponible","Disponible","Ocupado","Disponible"],
  "17:00 - 18:00": ["Disponible","Disponible","Disponible","Disponible"],
  "18:00 - 19:00": ["Ocupado","Disponible","Disponible","Ocupado"],
  "19:00 - 20:00": ["Disponible","Disponible","Bloqueado","Disponible"],
};

const Schedule = () => {
  const [data, setData] = useState(initialData);

  const handleClick = (hour, index) => {
    if (data[hour][index] === "Ocupado") return;
    const newStatus = data[hour][index] === "Disponible" ? "Bloqueado" : "Disponible";
    const updatedRow = [...data[hour]];
    updatedRow[index] = newStatus;
    setData({ ...data, [hour]: updatedRow });
  };

  const getStatusClass = (status) => {
    if (status === "Disponible") return styles.available;
    if (status === "Ocupado")    return styles.occupied;
    if (status === "Bloqueado")  return styles.blocked;
    return "";
  };

  return (
    <div>
      <div className={styles["containerHeader"]}>
        <div className={styles["headerTopSchedule"]}>
          <div>
            <DSAText variant="title">Horarios</DSAText>
            <DSAText variant="text" color="#6B7280">
              Configura los horarios disponibles para cada cancha
            </DSAText>
          </div>
          <div className={styles["scheduleLegend"]}>
            <span className={`${styles["legendItem"]} ${styles["available"]}`}>● Disponible</span>
            <span className={`${styles["legendItem"]} ${styles["occupied"]}`}>● Ocupado</span>
            <span className={`${styles["legendItem"]} ${styles["blocked"]}`}>● Bloqueado</span>
          </div>
        </div>
      </div>

      <div className={styles["scheduleCard"]}>
        <div className={styles["scheduleGrid"]}>
          <div className={styles["scheduleHeader"]}>Hora</div>
          {courts.map((court) => (
            <div key={court.name} className={styles["scheduleHeader"]}>
              <span className={styles["courtName"]}>{court.name}</span>
              <span className={styles["courtType"]}>{court.type}</span>
            </div>
          ))}

          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className={styles["scheduleHour"]}>{hour}</div>
              {data[hour].map((status, i) => (
                <button
                  key={`${hour}-${i}`}
                  className={`${styles["scheduleCell"]} ${getStatusClass(status)}`}
                  onClick={() => handleClick(hour, i)}
                  disabled={status === "Ocupado"}
                >
                  {status}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className={styles["scheduleFooter"]}>
        <strong>Instrucciones:</strong> Haz clic en un horario disponible para
        bloquearlo o desbloquearlo. Los horarios ocupados no se pueden modificar
        hasta que finalice la reserva.
      </div>
    </div>
  );
};

export default Schedule;