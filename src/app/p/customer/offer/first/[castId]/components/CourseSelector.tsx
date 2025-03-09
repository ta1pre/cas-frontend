"use client";

import { useState, useEffect } from "react";
import { fetchCourses, Course } from "../api/fetchCourses";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
    castId: number;
    onSelectCourse: (course: Course | null) => void;
}

export default function CourseSelector({ castId, onSelectCourse }: Props) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCourses() {
            const data = await fetchCourses(castId);
            if (data && data.length > 0) {
                setCourses(data);
                onSelectCourse(null); // ✅ 初期値を未選択に設定
            }
            setLoading(false);
        }
        loadCourses();
    }, [castId]);

    const handleCourseSelect = (course: Course) => {
        setSelectedCourse(course);
        onSelectCourse(course);
    };

    return (
        <Box className="w-full bg-white rounded-lg shadow">
            {/* ✅ タイトル部分（帯付き） */}
            <Box className="px-4 py-2 rounded-t-lg" sx={{ backgroundColor: "#fce7f3", borderBottom: "2px solid #ec4899" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ec4899" }}>
                    コース選択
                </Typography>
            </Box>

            {/* ✅ 説明文（統一） */}
            <p className="text-sm px-4 text-gray-600 mt-2">
                ※ 基本は90分ですが、短/長時間の調整も可能です。
                ご希望があれば、メッセージ欄にご記入ください。
            </p>

            {loading ? (
                <CircularProgress size={24} className="mt-2" />
            ) : courses.length === 0 ? (
                <Typography className="mt-2">利用可能なコースがありません。</Typography>
            ) : (
                <Box className="p-4">
                    {courses.map((course) => (
                        <Button
                            key={course.course_name}
                            fullWidth
                            sx={{
                                py: 2,
                                my: 1,
                                fontSize: "1rem",
                                fontWeight: "bold",
                                backgroundColor: selectedCourse?.course_name === course.course_name ? "#ec4899" : "#e5e7eb",
                                color: selectedCourse?.course_name === course.course_name ? "#fff" : "#696969",
                                "&:hover": {
                                    backgroundColor: selectedCourse?.course_name === course.course_name ? "#db2777" : "#d1d5db",
                                },
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                            onClick={() => handleCourseSelect(course)}
                        >
                            {/* ✅ 種別の幅を統一 */}
                            <span style={{ width: "6em", display: "inline-block", textAlign: "left" }}>
                                {course.course_name}
                            </span>

                            {/* ✅ 料金と時間（カンマ区切り適用） */}
                            <span style={{ flexGrow: 1, textAlign: "right" }}>
                                {`（${course.duration}分 / ${course.cost.toLocaleString()}pt ）`}
                            </span>

                            {/* ✅ チェックマークのスペース確保（ズレ防止） */}
                            <span style={{ width: "1.5em", display: "inline-block", textAlign: "right" }}>
                                {selectedCourse?.course_name === course.course_name ? <CheckIcon /> : " "}
                            </span>
                        </Button>
                    ))}
                </Box>
            )}
        </Box>
    );
}
