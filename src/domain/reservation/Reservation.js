// domain/reservation/Reservation.js
// Entidad pura — sin dependencias externas

export class Reservation {
  constructor({ id, courtId, courtName, userId, date, startTime, endTime, status, totalPrice }) {
    this.id         = id;
    this.courtId    = courtId;
    this.courtName  = courtName;
    this.userId     = userId;
    this.date       = date;         // 'YYYY-MM-DD'
    this.startTime  = startTime;    // 'HH:mm'
    this.endTime    = endTime;      // 'HH:mm'
    this.status     = status;       // 'pending' | 'confirmed' | 'cancelled'
    this.totalPrice = totalPrice;
  }

  isPending()    { return this.status === 'pending'; }
  isConfirmed()  { return this.status === 'confirmed'; }
  isCancelled()  { return this.status === 'cancelled'; }

  getFormattedDate() {
    return new Date(this.date + 'T00:00:00').toLocaleDateString('es-PE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  getDuration() {
    const [sh, sm] = this.startTime.split(':').map(Number);
    const [eh, em] = this.endTime.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm); // minutos
  }
}

// Entidad de horario disponible (slot)
export class TimeSlot {
  constructor({ id, courtId, startTime, endTime, available, price }) {
    this.id        = id;
    this.courtId   = courtId;
    this.startTime = startTime;
    this.endTime   = endTime;
    this.available = available;
    this.price     = price;
  }
}