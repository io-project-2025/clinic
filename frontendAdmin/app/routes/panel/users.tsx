import * as React from "react";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

export async function clientLoader({ request }: LoaderFunctionArgs) {
  const users = [
    { id: 2, email: "user@clinic.com", role: "user" },
    { id: 3, email: "doctor@clinic.com", role: "doctor" },
  ];
  return { users };
}

type User = {
  id: number;
  email: string;
  role: string;
};

function UsersFilter({
  roles,
  roleFilter,
  setRoleFilter,
  emailFilter,
  setEmailFilter,
}: {
  roles: string[];
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  emailFilter: string;
  setEmailFilter: (email: string) => void;
}) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel id="role-filter-label">Rola</InputLabel>
          <Select
            labelId="role-filter-label"
            value={roleFilter}
            label="Rola"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">Wszystkie</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          variant="outlined"
        />
      </Box>
    </Paper>
  );
}

function UsersTable({
  users,
  onChangePassword,
}: {
  users: User[];
  onChangePassword: (user: User) => void;
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
          >
            <TableCell sx={{ fontWeight: "bold", color: "#b71c1c" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#b71c1c" }}>Rola</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "#b71c1c" }}>
              Akcje
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => onChangePassword(user)}
                >
                  Zmień hasło
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                Brak użytkowników spełniających kryteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ChangePasswordDialog({
  open,
  user,
  newPassword,
  setNewPassword,
  onClose,
  onSubmit,
}: {
  open: boolean;
  user: User | null;
  newPassword: string;
  setNewPassword: (pw: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Zmień hasło</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Użytkownik: <b>{user?.email}</b>
        </Typography>
        <TextField
          label="Nowe hasło"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!newPassword}
        >
          Zmień
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SuccessSnackbar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2500}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="success" sx={{ width: "100%" }}>
        Hasło zostało zmienione (mock)!
      </Alert>
    </Snackbar>
  );
}

export default function UsersList() {
  const { users } = useLoaderData() as { users: User[] };
  const [roleFilter, setRoleFilter] = React.useState<string>("");
  const [emailFilter, setEmailFilter] = React.useState<string>("");

  const [openModal, setOpenModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [newPassword, setNewPassword] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const roles = Array.from(new Set(users.map((u: User) => u.role)));

  const filteredUsers = users.filter(
    (user: User) =>
      (roleFilter === "" || user.role === roleFilter) &&
      user.email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setNewPassword("");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
    setNewPassword("");
  };

  const handlePasswordChange = async () => {
    // Mock wysyłki do backendu
    await new Promise((resolve) => setTimeout(resolve, 500));
    setOpenModal(false);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Lista użytkowników
      </Typography>
      <UsersFilter
        roles={roles}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        emailFilter={emailFilter}
        setEmailFilter={setEmailFilter}
      />
      <UsersTable users={filteredUsers} onChangePassword={handleOpenModal} />
      <ChangePasswordDialog
        open={openModal}
        user={selectedUser}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        onClose={handleCloseModal}
        onSubmit={handlePasswordChange}
      />
      <SuccessSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} />
    </Box>
  );
}