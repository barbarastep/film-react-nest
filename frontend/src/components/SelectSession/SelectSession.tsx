import styles from './SelectSession.module.scss';
import clsx from "clsx";
import {useEffect, useMemo, useState} from "react";

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
    const selectedDayBySession = useMemo(() => {
        if (!selected) return null;
        const session = sessions.find((item) => item.id === selected);
        return session?.day ?? null;
    }, [selected, sessions]);
    const [activeDay, setActiveDay] = useState<string>('');

    useEffect(() => {
        if (days.length === 0) {
            setActiveDay('');
            return;
        }

        setActiveDay((currentDay) => {
            // Keep user's day choice while it exists in current schedule
            if (currentDay && data[currentDay]) {
                return currentDay;
            }

            if (selectedDayBySession && data[selectedDayBySession]) {
                return selectedDayBySession;
            }

            return days[0];
        });
    }, [data, days, selectedDayBySession]);

    const sessionsByDay = activeDay ? data[activeDay] : null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        const id = String(target.dataset.id);
        const time = String(target.dataset.time);
        if (id && time) {
            onSelect(id);
        }
    }

    return (
        <form className={styles.schedule} name="schedule" onSubmit={handleSubmit}>
            <div className={styles.days}>
                {days.map((day) => <button
                    key={day}
                    type="button"
                    className={clsx(styles.dayButton, {
                        [styles.place_active]: day === activeDay
                    })}
                    onClick={() => setActiveDay(day)}
                >
                    {day}
                </button>)}
            </div>
            <div className={styles.times}>
                {sessionsByDay && Object.keys(sessionsByDay).map(time => <button
                    key={dayTimeKey(activeDay, time)}
                    className={clsx(styles.time, {
                        [styles.place_active]: selected === sessionsByDay[time].id
                    })}
                    data-id={sessionsByDay[time].id}
                    data-time={time}
                >
                    {time}
                </button>)}
            </div>
        </form>
    );
}
