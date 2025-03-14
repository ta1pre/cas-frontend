import ReservationCard from "./ReservationCard";
import { ReservationListItem } from "../api/types";

interface Props {
  reservations: ReservationListItem[];
  onSelect: (reservation: ReservationListItem) => void;
}

export default function ReservationList({ reservations, onSelect }: Props) {
  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.reservation_id} reservation={reservation} onClick={() => onSelect(reservation)} />
      ))}
    </div>
  );
}
