// 
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCastUser } from "@/app/p/cast/hooks/useCastUser";
import { fetchAPI } from "@/services/auth/axiosInterceptor";
import { SelectChangeEvent } from "@mui/material/Select";
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
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  InputLabel,
  FormHelperText,
  ListSubheader,
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
  reservationId?: number; // 予約IDまたは予約オブジェクト全体のどちらかが必要
  reservation?: any; // 予約データオブジェクト（オプショナル）
  onCancel: () => void; // キャンセル時のコールバック
  onSuccess?: () => void; // 成功時のコールバック（オプショナル）
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
  status: string;
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

import { fetchReservationDetail } from "../api/useFetchReservationDetail";
import { fetchCastOptions } from "../api/useFetchCastOptions";
import { fetchFilteredCourses, CourseResponse, courseTypeNames, groupCoursesByType } from "../api/useFetchCastCourses"; 
import { fetchStationSuggest } from "../api/useFetchStation";

export default function ReserveEditForm({ reservationId, reservation, onCancel, onSuccess }: ReserveEditFormProps) {
  const router = useRouter();
  const user = useCastUser();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [detail, setDetail] = useState<ReservationDetail | null>(null);
  const [startTime, setStartTime] = useState("");
  const [note, setNote] = useState("");
  const [transportationFee, setTransportationFee] = useState(String(detail?.traffic_fee || 0)); 
  
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
    reservationId: reservationId || (reservation?.reservation_id || 0),
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
        
        let detailData;
        if (reservation) {
          detailData = reservation;
          setDetail(detailData);
        } else if (reservationId) {
          detailData = await fetchReservationDetail(reservationId, user.user_id);
          setDetail(detailData);
        } else {
          console.error('予約IDまたは予約データが見つかりませんでした。');
          return;
        }
        
        // 
        setStartTime(formatDateTimeForInput(detailData?.start_time));
        setNote(detailData?.reservation_note || "");
        setTransportationFee(String(detailData?.traffic_fee || 0)); 
        
        // 
        if (detailData?.course_id) {
          setSelectedCourseId(detailData.course_id);
          console.log("予約詳細からコースIDを設定:", detailData.course_id);
        }
        
        if (detailData?.station_id) {
          setSelectedStation({
            id: detailData.station_id,
            name: detailData.station_name || ""
          });
        }
        
        if (detailData?.options && detailData.options.length > 0) {
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
        
        // 
        setFormData({
          reservationId: reservationId || (detailData?.reservation_id || 0),
          courseId: detailData?.course_id,
          castId: user.user_id,
          stationId: detailData?.station_id || 0,
          location: detailData?.location || "",
          startTime: detailData?.start_time,
          endTime: detailData?.end_time,
          reservationNote: detailData?.reservation_note || "",
          status: detailData?.status || "pending",
          transportationFee: detailData?.traffic_fee || 0, 
        });
        
        try {
          const optionsData = await fetchCastOptions(reservationId || (reservation?.reservation_id || 0), user.user_id);
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
          // fetchCastCourses の代わりに fetchFilteredCourses を使用
          const coursesData = await fetchFilteredCourses(user.user_id);
          if (coursesData) {
            setCourses(coursesData);
            console.log("コース情報:", coursesData);
            
            // 予約詳細からコースIDを設定した場合、コース情報取得後に再度確認する
            if (selectedCourseId) {
              const initialCourse = coursesData.find(course => course.id === selectedCourseId);
              if (initialCourse) {
                setSelectedCourse(initialCourse);
                console.log("コース情報取得後にコースを設定:", initialCourse);
              } else {
                console.warn(`コースID ${selectedCourseId} が取得したコース一覧に見つかりません。`);
              }
            } else if (detailData && detailData.course_id) {
              // 予約詳細にコースIDがある場合、コース情報取得後に再度確認する
              const initialCourse = coursesData.find(course => course.id === detailData.course_id);
              if (initialCourse) {
                setSelectedCourseId(detailData.course_id);
                setSelectedCourse(initialCourse);
                console.log("予約詳細からコースを設定:", initialCourse);
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
  }, [reservationId, reservation, user?.user_id]);

  const formatDateTimeForInput = (isoString: string | undefined) => {
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

  // コース選択のハンドラー
  const handleCourseChange = (event: SelectChangeEvent<number | string>) => {
    const courseId = Number(event.target.value);
    setSelectedCourseId(courseId);
    
    // 
    console.log(`🔄 コース選択変更: courseId=${courseId}`);

    // 選択されたコースの詳細情報を取得
    const selectedCourse = courses.find((course) => course.id === courseId);
    
    if (selectedCourse) {
      console.log(`✅ 選択コース情報: ID=${selectedCourse.id}, 名前=${selectedCourse.course_name}, ポイント=${selectedCourse.cast_reward_points}`);
      
      // ポイント値の検証
      if (selectedCourse.cast_reward_points === undefined || selectedCourse.cast_reward_points === null) {
        console.warn(`⚠️ 警告: 選択コースID=${selectedCourse.id}のポイント値が未定義でせん`);
      } else if (selectedCourse.cast_reward_points === 0) {
        console.warn(`⚠️ 警告: 選択コースID=${selectedCourse.id}のポイント値が0です`);
      }

      setSelectedCourse(selectedCourse);
      
      // 予約データの更新
      const updatedFormData = {
        ...formData,
        courseId: courseId,
      };
      
      // 終了時間の計算
      if (startTime && selectedCourse.duration_minutes) {
        const startDate = new Date(startTime);
        const endDate = new Date(startDate.getTime() + (selectedCourse.duration_minutes * 60000));
        updatedFormData.endTime = endDate.toISOString();
        console.log(`⏱️ 終了時間計算: 開始=${startDate.toLocaleString()}, 終了=${endDate.toLocaleString()}`);
      }
      
      // 予約データを更新
      setFormData(updatedFormData);
      
      // オプションポイントの計算
      const optionPointsTotal = customOptions.reduce((sum, option) => sum + option.price, 0);
      
      // 合計ポイントの再計算
      const newTotalPoints = (
        (selectedCourse.cast_reward_points || 0) +
        (optionPointsTotal || 0) +
        (Number(formData.transportationFee) || 0)
      );
      
      console.log(`💰 ポイント計算: コース=${selectedCourse.cast_reward_points || 0}, オプション=${optionPointsTotal || 0}, 交通費=${Number(formData.transportationFee) || 0}, 合計=${newTotalPoints}`);
    } else {
      console.error(`❌ エラー: コースID=${courseId}の情報が見つかりません`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const currentCustomOptions = customOptionsRef.current;
      
      // 
      const startDate = new Date(startTime);
      const endDate = new Date(startDate.getTime() + (selectedCourse?.duration_minutes || 0) * 60000);
      
      const requestData = {
        reservation_id: reservationId || (reservation?.reservation_id || 0),
        cast_id: user.user_id,
        course_id: selectedCourseId || (detail?.course_id || 0), // 
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        location: selectedStation ? String(selectedStation.id) : detail?.location || "",
        reservation_note: note || "",
        status: "waiting_user_confirm",
        option_ids: selectedOptionIds,
        custom_options: currentCustomOptions,
        transportation_fee: Number(transportationFee) || 0, 
      };

      const response = await fetchReservationDetail(reservationId || (reservation?.reservation_id || 0), user.user_id);
      console.log("送信結果:", response);
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
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
              {/* 交通費入力をテキストフィールドからセレクトボックスに変更 */}
              <FormControl fullWidth>
                <Select
                  value={transportationFee}
                  onChange={(e) => setTransportationFee(e.target.value)}
                  displayEmpty
                  sx={{ 
                    borderRadius: 1,
                    '& .MuiSelect-select': { py: 1.5 }
                  }}
                >
                  <MenuItem value="0">0円</MenuItem>
                  <MenuItem value="1000">1,000円</MenuItem>
                  <MenuItem value="2000">2,000円</MenuItem>
                  <MenuItem value="3000">3,000円</MenuItem>
                  <MenuItem value="4000">4,000円</MenuItem>
                  <MenuItem value="5000">5,000円</MenuItem>
                </Select>
              </FormControl>
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
            <Select<number | string>
              labelId="course-select-label"
              value={selectedCourseId || ""}
              onChange={handleCourseChange}
              label="コース"
            >
              <MenuItem value="">コースを選択してください。</MenuItem>
              {Object.entries(groupCoursesByType(courses)).map(([typeId, typeCourses]) => [
                <ListSubheader key={`type-${typeId}`}>
                  {courseTypeNames[parseInt(typeId)] || `コースタイプ ${typeId}`}
                </ListSubheader>,
                ...typeCourses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.course_name} ({course.duration_minutes}分) - {course.cast_reward_points.toLocaleString()}ポイント
                  </MenuItem>
                ))
              ]).flat()}
            </Select>
            {selectedCourse && (
              <FormHelperText>
                コース時間: {selectedCourse.duration_minutes}分 / ポイント: {selectedCourse.cast_reward_points.toLocaleString()}ポイント
                {selectedCourse.cast_reward_points === 0 && (
                  <Typography component="span" color="error" sx={{ ml: 1 }}>
                    ※このコースのポイントは0です
                  </Typography>
                )}
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
