"use client";

import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
    Button,
    Chip,
    Box,
    Alert,
    CircularProgress,
    TableSortLabel,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import RuleEditDialog from "./components/RuleEditDialog";
import { fetchAPI } from "@/services/auth/axiosInterceptor";

interface PointRule {
    id: number;
    rule_name: string;
    rule_description: string | null;
    event_type: string;
    target_user_type: string;
    transaction_type: string;
    point_type: string;
    point_value: number;
    is_addition: boolean;
    is_active: boolean;
    created_at: string;
}

type Order = 'asc' | 'desc';
type OrderBy = keyof PointRule;

export default function PointRulesPage() {
    const [rules, setRules] = useState<PointRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingRule, setEditingRule] = useState<PointRule | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<OrderBy>('id');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    // ルール一覧を取得
    const fetchRules = async () => {
        try {
            setLoading(true);
            const response = await fetchAPI("/api/v1/points/admin/rules", {}, "GET");
            setRules(response || []);
            setError(null);
        } catch (err: any) {
            console.error("ルール取得エラー:", err);
            setError("ルール一覧の取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    // ON/OFF切り替え
    const toggleRuleStatus = async (ruleId: number) => {
        try {
            await fetchAPI(`/api/v1/points/admin/rules/${ruleId}/toggle`, {}, "PATCH");
            await fetchRules(); // リストを再取得
        } catch (err: any) {
            console.error("ステータス切り替えエラー:", err);
            setError("ステータスの切り替えに失敗しました");
        }
    };

    // ルール更新
    const updateRule = async (ruleId: number, updateData: any) => {
        try {
            await fetchAPI(`/api/v1/points/admin/rules/${ruleId}`, updateData, "PUT");
            await fetchRules(); // リストを再取得
            setEditDialogOpen(false);
            setEditingRule(null);
        } catch (err: any) {
            console.error("ルール更新エラー:", err);
            setError("ルールの更新に失敗しました");
        }
    };

    // 編集ダイアログを開く
    const openEditDialog = (rule: PointRule) => {
        setEditingRule(rule);
        setEditDialogOpen(true);
    };

    // ページ読み込み時にルール一覧取得
    useEffect(() => {
        fetchRules();
    }, []);

    // ソート処理
    const handleRequestSort = (property: OrderBy) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // フィルターとソート関数
    const filteredAndSortedRules = React.useMemo(() => {
        // まずフィルタリング
        let filtered = rules;
        if (statusFilter === 'active') {
            filtered = rules.filter(rule => rule.is_active);
        } else if (statusFilter === 'inactive') {
            filtered = rules.filter(rule => !rule.is_active);
        }
        
        // 次にソート
        const comparator = (a: PointRule, b: PointRule) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];
            
            if (bValue === null || bValue === undefined) return -1;
            if (aValue === null || aValue === undefined) return 1;
            
            if (bValue < aValue) {
                return order === 'desc' ? -1 : 1;
            }
            if (bValue > aValue) {
                return order === 'desc' ? 1 : -1;
            }
            return 0;
        };
        
        return [...filtered].sort(comparator);
    }, [rules, order, orderBy, statusFilter]);

    // ポイント表示用フォーマット
    const formatPoints = (value: number, isAddition: boolean) => {
        const sign = isAddition ? "+" : "-";
        return `${sign}${Math.floor(value)}`;
    };

    // ステータス表示用
    const getStatusChip = (isActive: boolean) => {
        return (
            <Chip
                label={isActive ? "🟢 ON" : "⚫ OFF"}
                color={isActive ? "success" : "error"}
                size="small"
                sx={{
                    fontWeight: "bold",
                    minWidth: "70px"
                }}
            />
        );
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>読み込み中...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                ポイントルール管理
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    ステータスフィルター:
                </Typography>
                <ToggleButtonGroup
                    value={statusFilter}
                    exclusive
                    onChange={(_, newFilter) => {
                        if (newFilter !== null) {
                            setStatusFilter(newFilter);
                        }
                    }}
                    size="small"
                >
                    <ToggleButton value="all">
                        すべて表示
                    </ToggleButton>
                    <ToggleButton value="active" sx={{ color: 'success.main' }}>
                        🟢 ONのみ
                    </ToggleButton>
                    <ToggleButton value="inactive" sx={{ color: 'error.main' }}>
                        ⚫ OFFのみ
                    </ToggleButton>
                </ToggleButtonGroup>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                    表示中: {filteredAndSortedRules.length}件 / 全{rules.length}件
                </Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'id'}
                                    direction={orderBy === 'id' ? order : 'asc'}
                                    onClick={() => handleRequestSort('id')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'rule_name'}
                                    direction={orderBy === 'rule_name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('rule_name')}
                                >
                                    ルール名
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>説明</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'event_type'}
                                    direction={orderBy === 'event_type' ? order : 'asc'}
                                    onClick={() => handleRequestSort('event_type')}
                                >
                                    イベント
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'target_user_type'}
                                    direction={orderBy === 'target_user_type' ? order : 'asc'}
                                    onClick={() => handleRequestSort('target_user_type')}
                                >
                                    対象
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'point_value'}
                                    direction={orderBy === 'point_value' ? order : 'asc'}
                                    onClick={() => handleRequestSort('point_value')}
                                >
                                    ポイント
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'point_type'}
                                    direction={orderBy === 'point_type' ? order : 'asc'}
                                    onClick={() => handleRequestSort('point_type')}
                                >
                                    種別
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>OFF/ON</TableCell>
                            <TableCell>ステータス</TableCell>
                            <TableCell>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAndSortedRules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell>{rule.id}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                        {rule.rule_name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {rule.rule_description || "-"}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {rule.event_type}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={rule.target_user_type} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>
                                    <Typography 
                                        variant="body2" 
                                        color={rule.is_addition ? "success.main" : "error.main"}
                                        fontWeight="medium"
                                    >
                                        {formatPoints(rule.point_value, rule.is_addition)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={rule.point_type} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={rule.is_active}
                                        onChange={() => toggleRuleStatus(rule.id)}
                                        size="medium"
                                        color="success"
                                        sx={{
                                            '& .MuiSwitch-track': {
                                                backgroundColor: rule.is_active ? '#4caf50' : '#f44336'
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    {getStatusChip(rule.is_active)}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => openEditDialog(rule)}
                                    >
                                        編集
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredAndSortedRules.length === 0 && !loading && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography color="text.secondary">
                        ポイントルールが見つかりません
                    </Typography>
                </Box>
            )}

            {/* 編集ダイアログ */}
            <RuleEditDialog
                open={editDialogOpen}
                rule={editingRule}
                onClose={() => {
                    setEditDialogOpen(false);
                    setEditingRule(null);
                }}
                onSave={updateRule}
            />
        </Container>
    );
}