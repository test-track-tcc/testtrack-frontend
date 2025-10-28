export type RawRole = 'ADMIN' | 'DEVELOPER' | 'MEMBER';

export const roleLabels: Record<RawRole, string> = {
    ADMIN: 'Administrador',
    DEVELOPER: 'Desenvolvedor',
    MEMBER: 'Membro',
};

export const getRoleLabel = (role?: RawRole | string): string => {
    if (!role) return 'Visitante';
    return roleLabels[role as RawRole] || role;
};

export const Permissions = {
    ADMIN: ['ADMIN'],
    DEVELOPER: ['ADMIN', 'DEVELOPER'],
    MEMBER: ['ADMIN', 'DEVELOPER', 'MEMBER'],
};

export const hasPermission = (userRole: RawRole | string, allowedRoles: RawRole[] | string[]): boolean => {
    return allowedRoles.includes(userRole as RawRole);
};
