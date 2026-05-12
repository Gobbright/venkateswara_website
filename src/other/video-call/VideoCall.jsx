import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  Video,
} from "lucide-react";

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

const callOptions = [
  {
    id: "whatsapp",
    title: "WhatsApp Video",
    text: "Quick shopping support through WhatsApp video call.",
    icon: MessageCircle,
  },
  {
    id: "meet",
    title: "Google Meet / Zoom",
    text: "Schedule a guided video call with a meeting link.",
    icon: Video,
  },
];

const formatDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateValue) => {
  if (!dateValue) {
    return "Select date";
  }

  const [year, month, day] = dateValue.split("-");
  return `${day} - ${month} - ${year}`;
};

const parseDateValue = (dateValue) => {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const VideoCall = () => {
  const todayDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(todayDate.getDate() + 1);

  const today = formatDateValue(todayDate);
  const tomorrow = formatDateValue(tomorrowDate);
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => parseDateValue(today));
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [selectedOption, setSelectedOption] = useState("whatsapp");
  const selectedCall = callOptions.find((option) => option.id === selectedOption);
  const calendarYear = calendarMonth.getFullYear();
  const calendarMonthIndex = calendarMonth.getMonth();
  const monthStart = new Date(calendarYear, calendarMonthIndex, 1);
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(monthStart.getDate() - monthStart.getDay());

  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return date;
  });

  const selectDate = (dateValue) => {
    setSelectedDate(dateValue);
    setCalendarMonth(parseDateValue(dateValue));
  };

  const moveCalendarMonth = (amount) => {
    setCalendarMonth((current) => {
      const next = new Date(current);
      next.setMonth(current.getMonth() + amount);
      return next;
    });
  };

  return (
    <section className="min-h-screen bg-[#FAF0E6] px-5 py-8 text-[#1a0a00] md:px-16 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D9F0F2] to-[#FFF1E6] px-6 py-9 text-center shadow-[0_6px_24px_rgba(77,167,175,0.16)] md:px-14 md:py-10">
          <span className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-base font-semibold text-orange-600">
            Video Shopping Appointment
          </span>
          <h1 className="mt-5 text-4xl font-extrabold text-gray-900 md:text-5xl">
            Schedule Your Video Call
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-600">
            Pick a date, choose a time between 10:00 AM and 6:00 PM, and select how you want to connect with our shopping team.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <CalendarDays size={22} className="text-orange-600" />
                  Select Date
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Today", value: today },
                    { label: "Tomorrow", value: tomorrow },
                  ].map((dateOption) => (
                    <button
                      key={dateOption.value}
                      type="button"
                      onClick={() => selectDate(dateOption.value)}
                      className={`h-12 rounded-full border px-5 text-base font-semibold transition ${
                        selectedDate === dateOption.value
                          ? "border-orange-600 bg-orange-600 text-white shadow-[0_6px_16px_rgba(249,115,22,0.28)]"
                          : "border-orange-200 bg-orange-50 text-gray-800 hover:border-orange-500 hover:bg-white"
                      }`}
                    >
                      {dateOption.label}
                    </button>
                  ))}
                </div>

                <div className="mt-3 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-teal-50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-orange-600">
                    <CalendarDays size={17} />
                    Pick Other Date
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCalendarOpen((open) => !open)}
                      className="flex h-12 w-full items-center justify-between rounded-full border border-white bg-white px-5 text-base font-bold text-[#0f2742] outline-none transition hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-300"
                    >
                      <span>{formatDisplayDate(selectedDate)}</span>
                      <CalendarDays size={20} className="text-orange-600" />
                    </button>

                    {calendarOpen && (
                      <div className="absolute left-0 top-[calc(100%+10px)] z-30 w-full min-w-[290px] rounded-2xl border border-orange-200 bg-white p-4 shadow-[0_14px_34px_rgba(15,39,66,0.16)] sm:w-[330px]">
                        <div className="mb-4 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => moveCalendarMonth(-1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-orange-50 hover:text-orange-600"
                            aria-label="Previous month"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <div className="text-base font-extrabold text-gray-950">
                            {monthNames[calendarMonthIndex]}, {calendarYear}
                          </div>
                          <button
                            type="button"
                            onClick={() => moveCalendarMonth(1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-orange-50 hover:text-orange-600"
                            aria-label="Next month"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center">
                          {weekDays.map((day) => (
                            <div key={day} className="py-2 text-sm font-bold text-[#0f2742]">
                              {day}
                            </div>
                          ))}

                          {calendarDays.map((date) => {
                            const dateValue = formatDateValue(date);
                            const isSelected = selectedDate === dateValue;
                            const isCurrentMonth = date.getMonth() === calendarMonthIndex;
                            const isPast = dateValue < today;

                            return (
                              <button
                                key={dateValue}
                                type="button"
                                disabled={isPast}
                                onClick={() => {
                                  selectDate(dateValue);
                                  setCalendarOpen(false);
                                }}
                                className={`flex h-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                                  isSelected
                                    ? "bg-orange-600 text-white shadow-[0_6px_14px_rgba(249,115,22,0.3)] ring-2 ring-[#4DA7AF]"
                                    : isPast
                                    ? "cursor-not-allowed text-gray-300"
                                    : isCurrentMonth
                                    ? "text-gray-950 hover:bg-orange-100 hover:text-orange-700"
                                    : "text-gray-400 hover:bg-teal-50 hover:text-[#21747b]"
                                }`}
                              >
                                {date.getDate()}
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDate("");
                              setCalendarOpen(false);
                            }}
                            className="text-sm font-bold text-[#21747b] transition hover:text-orange-600"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              selectDate(today);
                              setCalendarOpen(false);
                            }}
                            className="text-sm font-bold text-orange-600 transition hover:text-[#21747b]"
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Clock size={22} className="text-orange-600" />
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`h-11 rounded-full border px-3 text-sm font-semibold transition ${
                        selectedTime === time
                          ? "border-orange-600 bg-orange-600 text-white shadow-[0_6px_16px_rgba(249,115,22,0.28)]"
                          : "border-orange-200 bg-orange-50 text-gray-800 hover:border-orange-500 hover:bg-white"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Choose Call Type</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {callOptions.map(({ id, title, text, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedOption(id)}
                    className={`rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ${
                      selectedOption === id
                        ? "border-orange-600 bg-gradient-to-br from-orange-50 to-teal-50"
                        : "border-orange-100 bg-white"
                    }`}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] lg:sticky lg:top-[150px] lg:self-start">
            <h2 className="text-2xl font-bold text-gray-900">Appointment Summary</h2>
            <div className="mt-6 space-y-4 text-base font-medium text-gray-700">
              <div className="flex items-center justify-between gap-4">
                <span>Date</span>
                <span className="font-bold text-gray-950">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Time</span>
                <span className="font-bold text-gray-950">{selectedTime}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Call Type</span>
                <span className="text-right font-bold text-gray-950">{selectedCall?.title}</span>
              </div>
            </div>

            <div className="my-5 border-t border-black/10" />

            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-teal-50 p-5">
              <div className="mb-2 flex items-center gap-2 font-bold text-gray-900">
                <CheckCircle2 size={20} className="text-orange-600" />
                Ready to Schedule
              </div>
              <p className="text-sm leading-6 text-gray-600">
                Our team will confirm availability and share the WhatsApp video or meeting link.
              </p>
            </div>

            <button
              type="button"
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-5 text-base font-semibold text-white transition hover:scale-[1.03] hover:bg-gradient-to-r hover:from-orange-600 hover:via-[#FFBE8A] hover:to-[#4DA7AF]"
            >
              Schedule Call
              <Video size={18} />
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default VideoCall;
