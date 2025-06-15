"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { getMyWithdrawals } from "../api/withdrawal";

interface Withdrawal {
  id: number;
  amount: number;
  status: string;
  requested_at: string;
}

const statusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "approved":
      return "info";
    case "paid":
      return "success";
    case "rejected":
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

export default function WithdrawalHistory() {
  const [rows, setRows] = useState<Withdrawal[]>([]);

  const fetchData = async () => {
    const res = await getMyWithdrawals();
    if (Array.isArray(res)) {
      setRows(res);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (rows.length === 0) {
    return <Typography>申請履歴はありません</Typography>;
  }

  return (
    <Box className="mt-6">
      <Typography variant="h6" className="mb-2 text-pink-600 font-bold">
        申請履歴
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>日付</TableCell>
            <TableCell>金額 (円)</TableCell>
            <TableCell>ステータス</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{new Date(row.requested_at).toLocaleString()}</TableCell>
              <TableCell>{row.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Chip label={row.status} color={statusColor(row.status)} size="small" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
