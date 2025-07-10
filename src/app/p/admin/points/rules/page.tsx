"use client";

import { useState, useEffect } from "react";
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
    CircularProgress
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

export default function PointRulesPage() {
    const [rules, setRules] = useState<PointRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingRule, setEditingRule] = useState<PointRule | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

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

    // ポイント表示用フォーマット
    const formatPoints = (value: number, isAddition: boolean) => {
        const sign = isAddition ? "+" : "-";
        return `${sign}${Math.floor(value)}`;
    };

    // ステータス表示用
    const getStatusChip = (isActive: boolean) => {
        return (
            <Chip
                label={isActive ? "有効" : "無効"}
                color={isActive ? "success" : "default"}
                size="small"
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

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>ルール名</TableCell>
                            <TableCell>説明</TableCell>
                            <TableCell>イベント</TableCell>
                            <TableCell>対象</TableCell>
                            <TableCell>ポイント</TableCell>
                            <TableCell>種別</TableCell>
                            <TableCell>ステータス</TableCell>
                            <TableCell>ON/OFF</TableCell>
                            <TableCell>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rules.map((rule) => (
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
                                    {getStatusChip(rule.is_active)}
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={rule.is_active}
                                        onChange={() => toggleRuleStatus(rule.id)}
                                        size="small"
                                    />
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

            {rules.length === 0 && !loading && (
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