// src/components/DateFilter.js (가장 확실하고 표준적인 최종 버전)

import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

import TailButton from '../UI/TailButton'

import "react-datepicker/dist/react-datepicker.css";

// ✅ 1. 보이는 것과 기능을 하나로 합친 CustomDateInput 컴포넌트
//    이 컴포넌트가 직접 날짜 텍스트를 표시하고, 클릭 이벤트도 처리합니다.
const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div
        className="w-32 h-9 flex items-center justify-center text-center bg-white rounded-lg p-2 shadow-inner border border-gray-200 cursor-pointer"
        onClick={onClick}
        ref={ref}
    >
        {/* ✅ value가 존재하면 value를, 존재하지 않으면(빈 문자열이면) placeholder를 표시합니다. */}
        {value || placeholder}
    </div>
));


const CustomCalendarIcon = forwardRef(({ onClick }, ref) => (
    <button
        onClick={onClick}
        ref={ref}
        className="p-2 cursor-pointer"
        aria-label="날짜 범위 선택"
    >
        <Calendar className="text-gray-500 w-5 h-5" />
    </button>
));

export default function DateFilter({
    startDate,
    endDate,
    onDateChange,
    onPresetClick,
    activePreset,
    dailyTotals,
    highlightDates
}) {
    const presets = ['전체', '1주일', '1개월', '3개월'];
    const renderDayContents = (day, date) => {
    // ✅ 데이터 소스와 동일한 'yyyy-MM-dd' 형식으로 키를 만듭니다.
    const dateString = format(date, 'yyyy-MM-dd'); 
    const total = dailyTotals[dateString];

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            <span>{day}</span>
            {total && (
                <span className="daily-total text-kalani-gold">
                    {total.toLocaleString()}
                </span>
            )}
        </div>
    );
}

    return (
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 p-4 bg-white/50 rounded-xl mt-4">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className='flex gap-2 items-center'> {/* ✅ items-center 추가 */}
                    {presets.map(preset => (
                        <TailButton
                            key={preset}
                            onClick={() => onPresetClick(preset)}
                            className={`px-4 py-2 text-sm font-semibold rounded-sm transition-all duration-200 ${activePreset === preset
                                ? 'bg-kalani-gold text-white border-kalani-gold'
                                : ''
                                }`}
                        >
                            {preset}
                        </TailButton>
                    ))}

                    {/* ✅ 2. 모든 트릭을 제거하고, 가장 단순하고 확실한 구조로 변경 */}
                    <div className="flex items-center justify-center">
                        {/* 시작일 DatePicker */}
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => onDateChange(date, endDate)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            locale={ko}
                            dateFormat="yyyy. MM. dd" // ✅ 이 형식에 맞춰 날짜가 CustomDateInput의 'value'로 전달됩니다.
                            placeholderText="시작일"    // ✅ 날짜가 없을 때 'value' 대신 이 텍스트가 전달됩니다.
                            customInput={<CustomDateInput />}
                            maxDate={new Date()} 
                        />

                        <span className='mx-2'>-</span>

                        {/* 종료일 DatePicker */}
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => onDateChange(startDate, date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            locale={ko}
                            dateFormat="yyyy. MM. dd"
                            placeholderText="종료일"
                            customInput={<CustomDateInput />}
                            maxDate={new Date()} 
                        />
                    </div>
                </div>
            </div>
            {/* 이 부분은 그대로 유지 */}
            <div>
                <DatePicker
                    // ✅ 1. "시각화 전용" 달력을 위한 className 추가
                    calendarClassName="visual-only-calendar"
                    onSelect={() => { }} // 날짜를 선택해도 아무 일도 일어나지 않게 함
                    shouldCloseOnSelect={false} // 날짜를 선택해도 달력이 닫히지 않게 함
                    // --- 기존 기능은 그대로 유지 ---
                    locale={ko}
                    selected={null} // 특정 날짜가 선택된 것처럼 보이지 않게 함
                    startDate={startDate}
                    endDate={endDate}
                    customInput={<CustomCalendarIcon />}
                    renderDayContents={renderDayContents}
                    popperPlacement="bottom-end"
                    highlightDates={highlightDates} // 날짜 강조 표시
                // selectsRange prop은 선택 기능이 없으므로 제거해도 무방합니다.
                />
            </div>
        </div>
    );
}