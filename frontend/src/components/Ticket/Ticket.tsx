import styles from './Ticket.module.scss';
import clsx from "clsx";

export type TicketProps = {
    film: string;
    place: string;
    session: string;
    price: string;
    onDelete: () => void;
    className?: string;
};

export function Ticket({ film, place, session, price, className, onDelete}: TicketProps) {
    return (
        <div className={clsx(styles.ticket, className)}>
            <div className={styles.info}>
                <span className={styles.film}>{film}</span>
                <strong className={styles.place}>{place}</strong>
                <span className={styles.session}>{session}</span>
            </div>
            <div>
                <strong className={styles.price}>{price}</strong>
                <span>С учетом НДС</span>
            </div>
            <button onClick={onDelete} className={styles.delete} aria-label="delete"></button>
        </div>
    );
}
