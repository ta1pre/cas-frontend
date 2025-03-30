// 
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchReservationDetail } from "../api/useFetchReservationDetail";
import { fetchCastOptions } from "../api/useFetchCastOptions";
import { fetchFilteredCourses, CourseResponse } from "../api/useFetchCastCourses"; 
import { sendReservationEdit, ReservationEditRequest } from "../api/useSendReservationEdit";
import { fetchStationSuggest } from "../api/useFetchStation";
import { useCastUser } from "@/app/p/cast/hooks/useCastUser";
import { ReservationStatus } from "../types/reserveTypes";
import { 
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Checkbox,
  FormControlLabel,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EventIcon from '@mui/icons-material/Event'; 

interface ReserveEditFormProps {
  reservationId: number;
  onCancel: () => void;
}

interface CustomOption {
  name: string;
  price: number;
}

interface AvailableOption {
  option_id: number;
  option_name: string;
  option_price: number;
}

interface ReservationOption {
  option_id: number;
  name: string;
  price: number;
  is_custom: boolean;
}

interface Station {
  id: number;
  name: string;
  line_name?: string;
}

interface ReservationDetail {
  reservation_id: number;
  start_time: string;
  end_time: string;
  status: ReservationStatus;
  station_name?: string;
  station_id?: number;
  location?: string;
  duration_minutes: number;
  reservation_note?: string;
  options?: ReservationOption[];
  course_id: number;
  course_name?: string;
  traffic_fee?: number; 
  [key: string]: any;
}

interface FormData {
  reservationId: number;
  courseId: number;
  castId: number;
  stationId: number;
  location: string;
  startTime: string;
  endTime: string;
  reservationNote: string;
  status: string;
  transportationFee: number; 
}

export default function ReserveEditForm({ reservationId, onCancel }: ReserveEditFormProps) {
  const router = useRouter();
  const user = useCastUser();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [detail, setDetail] = useState<ReservationDetail | null>(null);
  const [startTime, setStartTime] = useState("");
  const [note, setNote] = useState("");
  const [transportationFee, setTransportationFee] = useState<number>(0); 
  
  const [stationInput, setStationInput] = useState("");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  
  const [availableOptions, setAvailableOptions] = useState<AvailableOption[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);
  
  const [newCustomName, setNewCustomName] = useState("");
  const [newCustomPrice, setNewCustomPrice] = useState("");

  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    reservationId: reservationId,
    courseId: 0,
    castId: user?.user_id || 0,
    stationId: 0,
    location: "",
    startTime: new Date().toISOString(),
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
    reservationNote: "",
    status: "pending",
    transportationFee: 0, 
  });

  // 
  const searchStations = async (query: string) => {
    if (query.length > 0) {
      try {
        const data = await fetchStationSuggest(query);
        setStations(data);
      } catch (error) {
        console.error('駅名検索エラー:', error);
        setStations([]);
      }
    } else {
      setStations([]);
    }
  };

  // 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 
        if (!user || !user.user_id) {
          console.log('ユーザー情報が見つかりませんでした。');
          return;
        }
        
        try {
          // 
          const detailData = await fetchReservationDetail(reservationId, user.user_id);
          setDetail(detailData);
          
          setStartTime(formatDateTimeForInput(detailData.start_time));
          setNote(detailData.reservation_note || "");
          setTransportationFee(detailData.traffic_fee || 0); 
          
          if (detailData.station_id) {
            setSelectedStation({
              id: detailData.station_id,
              name: detailData.station_name || ""
            });
          }
          
          if (detailData.options && detailData.options.length > 0) {
            const selectedIds: number[] = [];
            const customs: CustomOption[] = [];
            
            detailData.options.forEach((opt: { option_id: number; name: string; price: number; is_custom: boolean; }) => {
              if (opt.is_custom) {
                customs.push({
                  name: opt.name,
                  price: opt.price
                });
              } else {
                selectedIds.push(opt.option_id);
              }
            });
            
            setSelectedOptionIds(selectedIds);
            setCustomOptions(customs);
          }
          
          setFormData({
            reservationId: reservationId,
            courseId: detailData.course_id,
            castId: user.user_id,
            stationId: detailData.station_id || 0,
            location: detailData.location || "",
            startTime: detailData.start_time,
            endTime: detailData.end_time,
            reservationNote: detailData.reservation_note || "",
            status: detailData.status || "pending",
            transportationFee: detailData.traffic_fee || 0, 
          });
        } catch (detailError: any) {
          // 404エラーの場合、メッセージを表示して新規予約として扱う
          if (detailError.response && detailError.response.status === 404) {
            console.warn('予約情報が見つかりませんでした。新規予約として扱います。');
            // toast.warning('予約情報が見つかりませんでした。');
            
            // デフォルト値を設定
            setFormData({
              reservationId: reservationId,
              courseId: 0,
              castId: user.user_id,
              stationId: 0,
              location: "",
              startTime: new Date().toISOString(),
              endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
              reservationNote: "",
              status: "pending",
              transportationFee: 0, 
            });
          } else {
            console.error('予約情報取得エラー:', detailError);
            // toast.error('予約情報取得エラー。');
          }
        }
        
        try {
          const optionsData = await fetchCastOptions(reservationId, user.user_id);
          if (optionsData && optionsData.available_options) {
            setAvailableOptions(optionsData.available_options);
          } else {
            setAvailableOptions([]);
          }
        } catch (optError) {
          console.error("オプション取得エラー:", optError);
          setAvailableOptions([]);
        }
        
        try {
          setLoadingCourses(true);
          const coursesData = await fetchFilteredCourses(user.user_id);
          if (coursesData) {
            setCourses(coursesData);
            console.log("コース情報:", coursesData);
            if (formData.courseId) {
              const selectedCourse = coursesData.find(course => course.id === formData.courseId);
              if (selectedCourse) {
                setSelectedCourseId(formData.courseId);
                setSelectedCourse(selectedCourse);
              }
            }
          } else {
            setCourses([]);
          }
        } catch (error) {
          console.error("コース情報取得エラー:", error);
          setCourses([]);
        } finally {
          setLoadingCourses(false);
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
        setErrorMessage("データ取得エラー。");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reservationId, user?.user_id]);

  const formatDateTimeForInput = (isoString: string) => {
    if (!isoString) return "";
    return isoString.substring(0, 16);
  };

  const toggleOption = (optionId: number) => {
    setSelectedOptionIds(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const addCustomOption = () => {
    if (newCustomName && newCustomPrice) {
      const price = parseInt(newCustomPrice);
      if (!isNaN(price) && price > 0) {
        setCustomOptions([...customOptions, { name: newCustomName, price }]);
        setNewCustomName("");
        setNewCustomPrice("");
      }
    }
  };

  const removeCustomOption = (index: number) => {
    setCustomOptions(customOptions.filter((_, i) => i !== index));
  };

  const customOptionsRef = React.useRef<CustomOption[]>([]);
  
  useEffect(() => {
    customOptionsRef.current = customOptions;
  }, [customOptions]);

  // 
  const handleCourseChange = (courseId: number) => {
    setSelectedCourseId(courseId);
    
    // 
    const course = courses.find(c => c.id === courseId);
    setSelectedCourse(course || null);
    
    // 
    if (course && startTime) {
      const startDate = new Date(startTime);
      const newEndDate = new Date(startDate.getTime() + (course.duration_minutes * 60000));
      // 
    }
  };
  
  // 
  useEffect(() => {
    if (startTime && selectedCourse) {
      // 
      const startDate = new Date(startTime);
      const newEndDate = new Date(startDate.getTime() + (selectedCourse.duration_minutes * 60000));
      // 
    }
  }, [startTime, selectedCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const currentCustomOptions = customOptionsRef.current;
      
      // 
      const startDate = new Date(startTime);
      const endDate = new Date(startDate.getTime() + (selectedCourse?.duration_minutes || 0) * 60000);
      
      const requestData: ReservationEditRequest = {
        reservation_id: reservationId,
        cast_id: user.user_id,
        course_id: selectedCourseId || (detail?.course_id || 0), // 
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        location: selectedStation ? String(selectedStation.id) : detail?.location || "",
        reservation_note: note || "",
        status: "waiting_user_confirm",
        option_ids: selectedOptionIds,
        custom_options: currentCustomOptions,
        transportation_fee: transportationFee, 
      };

      const response = await sendReservationEdit(requestData);
      console.log("送信結果:", response);
      router.refresh();
      onCancel();
    } catch (error) {
      console.error("送信エラー:", error);
      setErrorMessage("送信エラー。");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: 'white',
      zIndex: 1000,
      overflowY: 'auto',
      p: 3
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        予約情報編集
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            mb: 3
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  開始時間
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
              {selectedCourse && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  コース時間: {selectedCourse.duration_minutes}分
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  駅名
                </Typography>
                {/* 現在の駅名を表示 */}
                {detail && detail.station_name && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      ml: 2, 
                      bgcolor: 'rgba(0,0,0,0.04)', 
                      px: 1.5, 
                      py: 0.5, 
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    現在の駅: <Typography component="span" fontWeight="bold" sx={{ ml: 0.5 }}>{detail.station_name}</Typography>
                  </Typography>
                )}
              </Box>
              <Autocomplete
                value={selectedStation}
                onChange={(_, newValue) => {
                  setSelectedStation(newValue);
                }}
                inputValue={stationInput}
                onInputChange={(_, newInputValue) => {
                  setStationInput(newInputValue);
                  searchStations(newInputValue);
                }}
                options={stations}
                getOptionLabel={(option) => {
                  if (option.line_name === "JR") {
                    return `${option.name} (JR)`;
                  }
                  return option.line_name ? `${option.name} (${option.line_name})` : option.name;
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="駅名を入力"
                    fullWidth
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1, py: 1, px: 2 }}>
                        <Typography sx={{ flex: 1, fontWeight: option.line_name === "JR" ? 'bold' : 'normal' }}>
                          {option.name}
                        </Typography>
                        {option.line_name && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              bgcolor: 'rgba(0,0,0,0.04)',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1
                            }}
                          >
                            {option.line_name}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                }}
                noOptionsText="駅名が見つかりませんでした。"
                loading={stationInput.length > 0 && stations.length === 0}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventNoteIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  メモ
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="メモを入力"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  交通費
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={transportationFee}
                onChange={(e) => setTransportationFee(Number(e.target.value))}
                placeholder="交通費を入力"
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            mb: 3
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#f06292', fontWeight: 'bold' }}>
            オプション選択
          </Typography>
          
          <Stack spacing={1}>
            {availableOptions.map((option) => (
              <FormControlLabel
                key={option.option_id}
                control={
                  <Checkbox
                    checked={selectedOptionIds.includes(option.option_id)}
                    onChange={() => toggleOption(option.option_id)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography>{option.option_name}</Typography>
                    <Typography sx={{ color: '#f06292' }}>
                      {option.option_price.toLocaleString()}円
                    </Typography>
                  </Box>
                }
                sx={{ 
                  width: '100%',
                  m: 0,
                  p: 1,
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                }}
              />
            ))}
          </Stack>
        </Paper>

        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            mb: 3
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#f06292', fontWeight: 'bold' }}>
            カスタムオプション
          </Typography>
          
          <Stack spacing={2}>
            {customOptions.map((option, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(0,0,0,0.02)'
                }}
              >
                <Typography sx={{ flex: 1 }}>
                  {option.name}
                </Typography>
                <Typography sx={{ color: '#f06292', mr: 2 }}>
                  {option.price.toLocaleString()}円
                </Typography>
                <IconButton 
                  size="small"
                  onClick={() => removeCustomOption(index)}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            ))}

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                size="small"
                value={newCustomName}
                onChange={(e) => setNewCustomName(e.target.value)}
                placeholder="オプション名"
                sx={{ flex: 2 }}
              />
              <TextField
                size="small"
                type="number"
                value={newCustomPrice}
                onChange={(e) => setNewCustomPrice(e.target.value)}
                placeholder="価格"
                inputProps={{ min: "0" }}
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                onClick={addCustomOption}
                startIcon={<AddCircleOutlineIcon />}
                sx={{ 
                  color: '#f06292',
                  borderColor: '#f06292',
                  '&:hover': {
                    borderColor: '#ec407a',
                    bgcolor: 'rgba(240, 98, 146, 0.04)'
                  }
                }}
              >
                追加
              </Button>
            </Box>
          </Stack>
        </Paper>

        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EventIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6" sx={{ color: '#f06292', fontWeight: 'bold' }}>
              コース選択
            </Typography>
          </Box>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="course-select-label">コース</InputLabel>
            <Select
              labelId="course-select-label"
              value={selectedCourseId || ""}
              onChange={(e) => handleCourseChange(Number(e.target.value))}
              label="コース"
            >
              <MenuItem value="">コースを選択してください。</MenuItem>
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.course_name} ({course.duration_minutes}分) - {course.cast_reward_points.toLocaleString()}ポイント
                </MenuItem>
              ))}
            </Select>
            {selectedCourse && (
              <FormHelperText>
                コース時間: {selectedCourse.duration_minutes}分 / ポイント: {selectedCourse.cast_reward_points.toLocaleString()}ポイント
              </FormHelperText>
            )}
          </FormControl>
          
          {selectedCourse?.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {selectedCourse.description}
            </Typography>
          )}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={submitting}
            startIcon={<CancelIcon />}
            sx={{ 
              borderRadius: 6,
              px: 4,
              py: 1
            }}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            sx={{ 
              borderRadius: 6,
              px: 4,
              py: 1,
              bgcolor: '#f06292',
              '&:hover': {
                bgcolor: '#ec407a'
              }
            }}
          >
            {submitting ? '送信中...' : '送信'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
