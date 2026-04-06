import styles from './SelectPlaces.module.scss';
import clsx from "clsx";

export type SelectedPlace = {
    row: number;
    seat: number;
};

export type HallSize = {
    rows: number;
    seats: number;
};

export type SelectPlacesProps = {
    hall: HallSize;
    taken: string[];
    selected: SelectedPlace[];
    onSelect: (selected: string) => void;
};

const getSeatKey = (row: number, seat: number) => {
    return [row, seat].join(':');
}

const createArray = (length: number, shift: number = 0): number[] => {
    return Array.from({ length }, (_, i) => i + shift);
}

export function SelectPlaces({ hall, taken, selected, onSelect }: SelectPlacesProps) {
    const selectedSeats = new Set(
        selected.map((place) => getSeatKey(place.row, place.seat))
    );

    return (
        <div className={styles.places}>
            <div className={styles.screen}>ЭКРАН</div>
            {createArray(hall.rows, 1).map(row => <div
                key={row}
                className={styles.row}
            >
                <div className={styles.label}>Ряд {row}</div>
                <div className={styles.seats}>
                    {createArray(hall.seats, 1).map(seat => {
                        const seatKey = getSeatKey(row, seat);
                        return (<button
                            key={seatKey}
                            type="button"
                            className={clsx(styles.seat, {
                                [styles.seat_active]: selectedSeats.has(seatKey),
                            })}
                            onClick={() => onSelect(seatKey)}
                            disabled={taken.includes(seatKey)}
                        >
                            {seat}
                        </button>)
                    })}
                </div>
            </div>)}
        </div>
    );
}
