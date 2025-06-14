"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress,
  Box,
  TableSortLabel,
  Button,
} from "@mui/material";
import { fetchAPI } from "@/services/auth/axiosInterceptor";
import {
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";

const STATUS_OPTIONS = ["pending", "approved", "rejected"] as const;

type StatusOption = typeof STATUS_OPTIONS[number];

interface CastItem {
  id: number;
  nick_name?: string | null;
  status: string;
}

interface CastListResponse {
  total: number;
  items: CastItem[];
}

export default function AdminCastListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageQuery = parseInt(searchParams.get("page") || "0", 10);
  const pageSizeQuery = parseInt(searchParams.get("size") || "20", 10);
  const sortByQuery = (searchParams.get("sort_by") as keyof CastItem) || "id";
  const sortDirQuery = (searchParams.get("sort_dir") as "asc" | "desc") || "asc";

  const [page, setPage] = useState(pageQuery);
  const [pageSize, setPageSize] = useState(pageSizeQuery);
  const [orderBy, setOrderBy] = useState<keyof CastItem>(sortByQuery);
  const [order, setOrder] = useState<"asc" | "desc">(sortDirQuery);

  const [data, setData] = useState<CastItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogReason, setDialogReason] = useState("");
  const [targetCast, setTargetCast] = useState<CastItem | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<StatusOption | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async (p = page, size = pageSize, ob = orderBy, od = order) => {
    setLoading(true);
    try {
      const res: CastListResponse = await fetchAPI(
        `/api/v1/admin/cast/list?page=${p + 1}&page_size=${size}&sort_by=${ob}&sort_dir=${od}`,
        {},
        "GET"
      );
      if (res) {
        console.log("[CastList] ids", res.items.map((i) => i.id));
        setData(res.items || []);
        setTotal(res.total || 0);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (e) {
      console.error("❌ キャスト一覧取得に失敗", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageQuery, pageSizeQuery, sortByQuery, sortDirQuery);
  }, [pageQuery, pageSizeQuery, sortByQuery, sortDirQuery]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    router.push(
      `/p/admin/cast?page=${newPage}&size=${pageSize}&sort_by=${orderBy}&sort_dir=${order}`
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(0);
    router.push(
      `/p/admin/cast?page=0&size=${newSize}&sort_by=${orderBy}&sort_dir=${order}`
    );
  };

  const handleStatusUpdate = async (
    castId: number,
    newStatus: StatusOption,
    reason?: string
  ) => {
    try {
      await fetchAPI(
        `/api/v1/admin/cast/${castId}/identity-verification/status`,
        {
          status: newStatus,
          ...(reason !== undefined ? { rejection_reason: reason } : {}),
        },
        "PUT"
      );
      fetchData();
    } catch (e) {
      console.error("❌ ステータス更新失敗", e);
    }
  };

  const handleSelectChange = (
    cast: CastItem,
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = event.target.value as StatusOption;
    if (value === "rejected") {
      setTargetCast(cast);
      setDialogOpen(true);
    } else {
      setConfirmStatus(value);
      setTargetCast(cast);
      setConfirmOpen(true);
    }
  };

  const handleConfirmSubmit = () => {
    if (targetCast && confirmStatus) {
      handleStatusUpdate(targetCast.id, confirmStatus);
    }
    setConfirmOpen(false);
    setTargetCast(null);
    setConfirmStatus(null);
  };

  const handleRejectSubmit = () => {
    if (targetCast) {
      handleStatusUpdate(targetCast.id, "rejected", dialogReason);
    }
    setDialogReason("");
    setDialogOpen(false);
    setTargetCast(null);
  };

  const handleRequestSort = (property: keyof CastItem) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(property);
    router.push(
      `/p/admin/cast?page=${page}&size=${pageSize}&sort_by=${property}&sort_dir=${newOrder}`
    );
    fetchData(page, pageSize, property, newOrder);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        キャスト一覧
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === "id" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "id"}
                    direction={orderBy === "id" ? order : "asc"}
                    onClick={() => handleRequestSort("id")}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "nick_name" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "nick_name"}
                    direction={orderBy === "nick_name" ? order : "asc"}
                    onClick={() => handleRequestSort("nick_name")}
                  >
                    ニックネーム
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === "status" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "status"}
                    direction={orderBy === "status" ? order : "asc"}
                    onClick={() => handleRequestSort("status")}
                  >
                    本人確認ステータス
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  画像確認
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((cast) => (
                <TableRow key={`${cast.id}-${order}-${orderBy}`} hover>
                  <TableCell>{cast.id}</TableCell>
                  <TableCell>{cast.nick_name || "-"}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={cast.status}
                      onChange={(e) => handleSelectChange(cast, e as any)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => router.push(`/p/admin/cast/${cast.id}/identity`)}
                    >
                      確認
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </>
      )}
    
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>却下理由を入力</DialogTitle>
        <DialogContent>
          <DialogContentText>
            却下理由を入力して下さい。
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            minRows={2}
            value={dialogReason}
            onChange={(e) => setDialogReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>キャンセル</Button>
          <Button variant="contained" color="error" onClick={handleRejectSubmit}>
            却下する
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>ステータス変更確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmStatus && targetCast
              ? `キャストID ${targetCast.id} のステータスを「${confirmStatus}」に変更してよろしいですか？`
              : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>キャンセル</Button>
          <Button variant="contained" onClick={handleConfirmSubmit}>
            変更する
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
