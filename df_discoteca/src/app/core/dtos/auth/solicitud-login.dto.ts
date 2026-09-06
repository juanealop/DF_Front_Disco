import { RoleSistema } from '../../models/role-sistema.model';

// Espejo de SolicitudLogin del backend (com.DF.back.shared.security.dto.SolicitudLogin).
export interface SolicitudLogin {
  email: string;
  password: string;
  role: RoleSistema;
}
