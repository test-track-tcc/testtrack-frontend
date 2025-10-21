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
import { NotificationService } from '../../../services/NotificationService'; 

interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  link?: string;
  actionId?: string;
}

interface NotificationBellProps {
  authUserId: string | undefined;
}

export const NotificationBell = ({ authUserId }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    if (!authUserId) {
      console.warn('NotificationBell: authUserId não fornecido, não buscando notificações.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await NotificationService.getNotifications(authUserId);
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao buscar notificações', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [authUserId]); 

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.link) return;

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

    navigate(notification.link);
    handleClose();
  };


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
        MenuListProps={{ sx: { minWidth: 350, maxWidth: 600 } }}
      >
        <Typography variant="h6" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
          Notificações
        </Typography>

        {isLoading && <CircularProgress sx={{ mx: 'auto', display: 'block' }} />}

        {!isLoading && notifications.length === 0 && (
          <MenuItem disabled>Nenhuma notificação</MenuItem>
        )}

        {!isLoading &&
          notifications.map((notification) => {
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
                  </Box>
                </MenuItem>
              );
            }

            return (
              <MenuItem
                key={notification.id}
                selected={!notification.read}
                onClick={() => handleNotificationClick(notification)}
                disabled={!notification.link}
              >
                {notification.message}
              </MenuItem>
            );
          })}
      </Menu>
    </>
  );
};