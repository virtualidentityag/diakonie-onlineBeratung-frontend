import { useContext, useEffect, useState } from 'react';
import { apiGetConsultantAppointments } from '../../../api/apiGetConsultantAppointments';
import { UserDataContext, BookingEventsInterface } from '../../../globalState';
import { BookingsStatus } from '../../../utils/consultant';

export const useConsultantBookings = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { userData } = useContext(UserDataContext);
	const [bookings, setBookings] = useState<BookingEventsInterface[]>([]);

	useEffect(() => {
		setIsLoading(true);

		apiGetConsultantAppointments(userData.userId, BookingsStatus.ACTIVE)
			.then(setBookings)
			.catch((ex) => {
				console.error(ex);
				setBookings([]);
			})
			.finally(() => setIsLoading(false));
	}, [userData.userId]);

	return {
		bookings,
		isLoading
	};
};
