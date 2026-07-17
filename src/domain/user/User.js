export class User {
  constructor({ id, nombre, apellido, email, telefono, dni, rol, activo }) {
    this.id       = id;
    this.nombre   = nombre;
    this.apellido = apellido;
    this.email    = email;
    this.telefono = telefono;
    this.dni      = dni;
    this.rol      = rol;      // "ADMIN" | "CLIENTE" | "RECEPCIONISTA"
    this.activo   = activo;
  }

  isAdmin()         { return this.rol === 'ADMIN'; }
  isCliente()       { return this.rol === 'CLIENTE'; }
  isRecepcionista() { return this.rol === 'RECEPCIONISTA'; }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellido ?? ''}`.trim();
  }
}