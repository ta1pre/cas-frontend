"use client";

import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText, Divider } from "@mui/material";
import useCourseSelection, { Course, courseTypeNames } from "@/hooks/pricing_cal/useCourseSelection";

interface Props {
    castId: number;
    onSelectCourse: (course: Course | null) => void;
}

export default function CourseSelector({ castId, onSelectCourse }: Props) {
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [isClient, setIsClient] = useState(false);
    
    // クライアントサイドでのみレンダリングされるようにする
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    // 新しいフックを使用
    const { 
        courses, 
        loading, 
        error, 
        groupCoursesByType,
        findCourseById 
    } = useCourseSelection(castId);

    const handleCourseChange = (event: any) => {
        const courseId = event.target.value;
        setSelectedCourseId(courseId);
        
        if (courseId === "") {
            onSelectCourse(null);
            return;
        }
        
        const selectedCourse = findCourseById(courseId);
        onSelectCourse(selectedCourse);
    };

    // クライアントサイドでのみグループ化を実行
    const groupedCourses = isClient ? groupCoursesByType() : {};

    // サーバーサイドレンダリング時は最小限の内容を返す
    if (!isClient) {
        return (
            <Box className="w-full bg-white rounded-lg shadow mb-4">
                <Box className="px-4 py-2 rounded-t-lg" sx={{ backgroundColor: "#fce7f3", borderBottom: "2px solid #ec4899" }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ec4899" }}>
                        コース選択
                    </Typography>
                </Box>
                <Box className="p-4">
                    <Typography variant="body2" className="text-gray-600 mb-3">
                        ※ 時間の長さによって料金が変わります。ご希望の時間を選択してください。
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box className="w-full bg-white rounded-lg shadow mb-4">
            {/* タイトル部分（帯付き） */}
            <Box className="px-4 py-2 rounded-t-lg" sx={{ backgroundColor: "#fce7f3", borderBottom: "2px solid #ec4899" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ec4899" }}>
                    コース選択
                </Typography>
            </Box>

            {/* 説明文（統一） */}
            <Box className="p-4">
                <Typography variant="body2" className="text-gray-600 mb-3">
                    ※ 時間の長さによって料金が変わります。ご希望の時間を選択してください。
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" my={2}>
                        <CircularProgress size={24} />
                    </Box>
                ) : error ? (
                    <Typography className="mt-2 text-red-500">{error}</Typography>
                ) : courses.length === 0 ? (
                    <Typography className="mt-2">利用可能なコースがありません。</Typography>
                ) : (
                    <FormControl fullWidth>
                        <InputLabel id="course-select-label">コースを選択</InputLabel>
                        <Select
                            labelId="course-select-label"
                            id="course-select"
                            value={selectedCourseId}
                            label="コースを選択"
                            onChange={handleCourseChange}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ec4899',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ec4899',
                                },
                            }}
                        >
                            <MenuItem value=""><em>選択してください</em></MenuItem>
                            
                            {/* コースタイプごとにグループ化して表示 */}
                            {Object.keys(groupedCourses).map((typeKey) => {
                                const courseType = parseInt(typeKey);
                                const typeCourses = groupedCourses[courseType];
                                
                                return [
                                    // コースタイプの見出し
                                    <MenuItem 
                                        key={`type-${courseType}`} 
                                        disabled 
                                        sx={{ 
                                            opacity: 1, 
                                            fontWeight: 'bold',
                                            backgroundColor: courseType === 1 ? '#e6f7ff' : '#fff0f6',
                                            color: courseType === 1 ? '#1890ff' : '#eb2f96',
                                        }}
                                    >
                                        {courseTypeNames[courseType] || `コースタイプ ${courseType}`}
                                    </MenuItem>,
                                    
                                    // そのタイプのコース一覧
                                    ...typeCourses.map((course) => {
                                        // コースIDを生成
                                        const courseId = `${course.course_name}-${course.duration}-${course.course_type}`;
                                        // コストを表示（APIから返されたcostを使用）
                                        const displayCost = course.cost;
                                        
                                        return (
                                            <MenuItem 
                                                key={courseId} 
                                                value={courseId}
                                                sx={{
                                                    paddingLeft: '24px',
                                                    color: courseType === 1 ? '#0050b3' : '#c41d7f',
                                                }}
                                            >
                                                {`${course.course_name} (${course.duration}分 / ${displayCost.toLocaleString()}pt)`}
                                            </MenuItem>
                                        );
                                    }),
                                    
                                    // 区切り線（最後のグループ以外）
                                    parseInt(Object.keys(groupedCourses)[Object.keys(groupedCourses).length - 1]) !== courseType && 
                                        <Divider key={`divider-${courseType}`} />
                                ];
                            }).flat()}
                        </Select>
                        <FormHelperText>コースを選択すると予約リクエストが送信できます</FormHelperText>
                    </FormControl>
                )}
            </Box>
        </Box>
    );
}
