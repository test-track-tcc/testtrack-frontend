import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Typography,
  Button,
  Box,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
// Certifique-se que o caminho para seu serviço está correto
import { NotificationService } from '../../../services/NotificationService'; 

// O tipo de Notificação que esperamos do Backend
interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  link?: string;
  actionId?: string; // O ID do convite (OrganizationUser ID)
}

// As props que o componente espera (o ID do usuário logado)
interface NotificationBellProps {
  authUserId: string | undefined;
}

export const NotificationBell = ({ authUserId }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  /**
   * Busca as notificações no backend
   */
  const fetchNotifications = async () => {
    // Só busca se o ID do usuário existir
    if (!authUserId) {
      console.warn('NotificationBell: authUserId não fornecido, não buscando notificações.');
      return;
    }

    setIsLoading(true);
    try {
      // Passa o authUserId para a chamada da API
      const data = await NotificationService.getNotifications(authUserId);
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao buscar notificações', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Busca notificações quando o componente monta ou o usuário muda
  useEffect(() => {
    fetchNotifications();
    // Opcional: Adicionar polling para atualizar a cada minuto
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [authUserId]); // Depende do authUserId

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Chamado quando o usuário clica em "Aceitar" em um convite
   */
  const handleAcceptInvite = async (notification: Notification) => {
    if (!notification.actionId || !authUserId) {
      console.warn("Não foi possível aceitar: actionId ou authUserId faltando.");
      return;
    }

    try {
      await NotificationService.acceptOrganizationInvite(notification.actionId, authUserId);

      await NotificationService.markNotificationAsRead(notification.id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error('Erro ao aceitar convite', error);
    }
  };

  /**
   * Chamado quando o usuário clica em uma notificação normal (ex: falha de teste)
   */
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.link) return; // Não faz nada se não tiver link

    // Marca como lida (se ainda não estiver)
    if (!notification.read) {
      try {
        await NotificationService.markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
        );
      } catch (error) {
        console.error('Erro ao marcar notificação como lida', error);
      }
    }

    // Navega para o link da notificação
    navigate(notification.link);
    handleClose();
  };

  // --- RENDERIZAÇÃO ---

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ sx: { minWidth: 350, maxWidth: 400 } }}
      >
        <Typography variant="h6" sx={{ px: 2, py: 1 }}>
          Notificações
        </Typography>

        {isLoading && <CircularProgress sx={{ mx: 'auto', display: 'block' }} />}

        {!isLoading && notifications.length === 0 && (
          <MenuItem disabled>Nenhuma notificação</MenuItem>
        )}

        {!isLoading &&
          notifications.map((notification) => {
            // Caso 1: É um convite para organização (e ainda não foi lido/aceito)
            if (notification.type === 'ORGANIZATION_INVITE' && !notification.read) {
              return (
                <MenuItem key={notification.id} divider sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {notification.message}
                  </Typography>
                  <Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAcceptInvite(notification)}
                    >
                      Aceitar
                    </Button>
                    {/* (Opcional) Botão de Rejeitar */}
                  </Box>
                </MenuItem>
              );
            }

            // Caso 2: Notificação normal (clicável)
            return (
              <MenuItem
                key={notification.id}
                selected={!notification.read} // Destaca não lidas
                onClick={() => handleNotificationClick(notification)}
                disabled={!notification.link} // Desabilita se não tiver link
              >
                {notification.message}
              </MenuItem>
            );
          })}
      </Menu>
    </>
  );
};