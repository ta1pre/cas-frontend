"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Box,
    Typography,
    Divider
} from "@mui/material";

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

interface RuleEditDialogProps {
    open: boolean;
    rule: PointRule | null;
    onClose: () => void;
    onSave: (ruleId: number, updateData: any) => void;
}

export default function RuleEditDialog({ open, rule, onClose, onSave }: RuleEditDialogProps) {
    const [formData, setFormData] = useState({
        rule_name: "",
        rule_description: "",
        point_value: 0,
        is_addition: true,
        is_active: true
    });

    // ダイアログが開かれた時にフォームデータを設定
    useEffect(() => {
        if (rule) {
            setFormData({
                rule_name: rule.rule_name,
                rule_description: rule.rule_description || "",
                point_value: rule.point_value,
                is_addition: rule.is_addition,
                is_active: rule.is_active
            });
        }
    }, [rule]);

    const handleSave = () => {
        if (!rule) return;
        
        // 更新データを準備
        const updateData = {
            rule_name: formData.rule_name,
            rule_description: formData.rule_description || null,
            point_value: formData.point_value,
            is_addition: formData.is_addition,
            is_active: formData.is_active
        };

        onSave(rule.id, updateData);
    };

    const handleClose = () => {
        onClose();
        // フォームをリセット
        setFormData({
            rule_name: "",
            rule_description: "",
            point_value: 0,
            is_addition: true,
            is_active: true
        });
    };

    if (!rule) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                ポイントルール編集
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    {/* 基本情報 */}
                    <Typography variant="h6" gutterBottom>
                        基本情報
                    </Typography>
                    
                    <TextField
                        fullWidth
                        label="ルール名"
                        value={formData.rule_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, rule_name: e.target.value }))}
                        margin="normal"
                        required
                    />
                    
                    <TextField
                        fullWidth
                        label="説明"
                        value={formData.rule_description}
                        onChange={(e) => setFormData(prev => ({ ...prev, rule_description: e.target.value }))}
                        margin="normal"
                        multiline
                        rows={3}
                    />

                    <Divider sx={{ my: 3 }} />

                    {/* ポイント設定 */}
                    <Typography variant="h6" gutterBottom>
                        ポイント設定
                    </Typography>
                    
                    <TextField
                        fullWidth
                        label="ポイント値"
                        type="number"
                        value={formData.point_value}
                        onChange={(e) => setFormData(prev => ({ ...prev, point_value: Number(e.target.value) }))}
                        margin="normal"
                        required
                        inputProps={{ min: 0 }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.is_addition}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_addition: e.target.checked }))}
                            />
                        }
                        label={`ポイント${formData.is_addition ? '付与' : '減算'}`}
                        sx={{ mt: 2 }}
                    />

                    <Divider sx={{ my: 3 }} />

                    {/* ステータス設定 */}
                    <Typography variant="h6" gutterBottom>
                        ステータス
                    </Typography>
                    
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.is_active}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            />
                        }
                        label={`ルール${formData.is_active ? '有効' : '無効'}`}
                    />

                    <Divider sx={{ my: 3 }} />

                    {/* 読み取り専用情報 */}
                    <Typography variant="h6" gutterBottom>
                        システム情報（変更不可）
                    </Typography>
                    
                    <TextField
                        fullWidth
                        label="イベントタイプ"
                        value={rule.event_type}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                        disabled
                    />
                    
                    <TextField
                        fullWidth
                        label="対象ユーザータイプ"
                        value={rule.target_user_type}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                        disabled
                    />
                    
                    <TextField
                        fullWidth
                        label="ポイントタイプ"
                        value={rule.point_type}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                        disabled
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    キャンセル
                </Button>
                <Button 
                    onClick={handleSave} 
                    variant="contained"
                    disabled={!formData.rule_name.trim()}
                >
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    );
}