import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';

export default function BirthdayPicker({ selected, onChange }) {
    return (
        <DatePicker
            selected={selected}
            onChange={onChange}
            dateFormat="yyyy-MM-dd"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            maxDate={new Date()}
            locale={ko}
            placeholderText="생년월일 선택"
            className='p-3 border border-gray-200 rounded-md focus-within:outline-kalani-gold focus-within:outline-2 w-full text-gray-700'
            renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
            }) => (
                <div className="flex justify-center gap-2 px-2 py-1">
                    {/* 연도 선택 */}
                    <select
                        value={date.getFullYear()}
                        onChange={({ target: { value } }) => changeYear(Number(value))}
                        className="rounded p-1 text-gray-500"
                    >
                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}년</option>
                        ))}
                    </select>

                    {/* 월 선택 */}
                    <select
                        value={date.getMonth()}
                        onChange={({ target: { value } }) => changeMonth(Number(value))}
                        className="rounded p-1 text-gray-500"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>{i + 1}월</option>
                        ))}
                    </select>
                </div>
            )}
        />

    );
}
