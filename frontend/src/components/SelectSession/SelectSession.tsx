import { useEffect, useMemo, useState } from 'react';
import styles from './SelectSession.module.scss';
import clsx from "clsx";

export type ScheduleSession = {
    id: string;
    day: string;
    time: string;
};

export type DaySchedule = {
    [key: string]: ScheduleSession;
};

export type HallSessions = {
    [key: string]: DaySchedule;
};

export type SelectSessionProps = {
    sessions: ScheduleSession[];
    selected: string | null;
    onSelect: (session: string) => void;
};

function groupSessions(data: ScheduleSession[]) {
    return data.reduce<HallSessions>((a, c) => {
        if (!a[c.day]) a[c.day] = {};
        a[c.day][c.time] = c;
        return a;
    }, {});
}

function dayTimeKey(day: string, time: string) {
    return [day, time].join(':');
}

export function SelectSession({ sessions, selected = null, onSelect }: SelectSessionProps) {
    const data = useMemo(() => groupSessions(sessions), [sessions]);
    const days = useMemo(() => Object.keys(data), [data]);
    const selectedSession = sessions.find((session) => session.id === selected) ?? null;
    const [selectedDay, setSelectedDay] = useState<string | null>(selectedSession?.day ?? days[0] ?? null);

    useEffect(() => {
        if (!selectedDay || !days.includes(selectedDay)) {
            setSelectedDay(selectedSession?.day ?? days[0] ?? null);
        }
    }, [days, selectedDay, selectedSession]);

    const handleSelectDay = (day: string) => {
        setSelectedDay(day);

        if (selectedSession?.day === day) {
            return;
        }

        const firstTime = Object.keys(data[day] ?? {})[0];
        if (!firstTime) {
            return;
        }

        onSelect(data[day][firstTime].id);
    };

    useEffect(() => {
        if (!selectedSession?.day || selectedSession.day === selectedDay) {
            return;
        }

        if (!selectedDay || !days.includes(selectedDay)) {
            setSelectedDay(days[0] ?? null);
        }
    }, [days, selectedDay, selectedSession]);

    const visibleSessions = selectedDay ? Object.keys(data[selectedDay] ?? {}) : [];

    return (
        <div className={styles.schedule}>
            <div className={styles.days}>
                {days.map((day) => <button
                    key={day}
                    type="button"
                    className={clsx(styles.dayButton, {
                        [styles.dayButton_active]: selectedDay === day,
                    })}
                    onClick={() => handleSelectDay(day)}
                >
                    {day}
                </button>)}
            </div>

            <div className={styles.times}>
                {visibleSessions.map((time) => <button
                    key={dayTimeKey(selectedDay ?? '', time)}
                    type="button"
                    className={clsx(styles.time, {
                        [styles.time_active]: selected === data[selectedDay!][time].id
                    })}
                    onClick={() => onSelect(data[selectedDay!][time].id)}
                >
                    {time}
                </button>)}
            </div>
        </div>
    );
}
