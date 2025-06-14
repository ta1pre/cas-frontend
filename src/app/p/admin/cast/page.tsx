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
} from "@mui/material";
import { fetchAPI } from "@/services/auth/axiosInterceptor";

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
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((cast) => (
                <TableRow key={`${cast.id}-${order}-${orderBy}`} hover>
                  <TableCell>{cast.id}</TableCell>
                  <TableCell>{cast.nick_name || "-"}</TableCell>
                  <TableCell>{cast.status}</TableCell>
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
    </Container>
  );
}
