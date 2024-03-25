import React, { useContext, useEffect, useState } from 'react';
import '../booking.styles';
import {
	BookingEventsInterface,
	BookingEventUiInterface,
	UserDataContext
} from '../../../../globalState';
import { apiGetConsultantAppointments } from '../../../../api/apiGetConsultantAppointments';
import { BookingsStatus } from '../../../../utils/consultant';
import { BookingsComponent } from '../BookingsComponent/bookingsComponent';
import { transformBookingData } from '../../../../utils/transformBookingData';

export const BookingEventsExpired: React.FC = () => {
	const { userData } = useContext(UserDataContext);
	const [isLoading, setIsLoading] = useState(true);
	const [bookingEventsData, setBookingEventsData] = useState<
		BookingEventUiInterface[]
	>([] as BookingEventUiInterface[]);

	useEffect(() => {
		apiGetConsultantAppointments(userData.userId, BookingsStatus.EXPIRED)
			.then((bookings) => {
				transformData(bookings);
			})
			.finally(() => {
				setIsLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const transformData = (bookings: BookingEventsInterface[]) => {
		const bookingEvents = transformBookingData(bookings);
		setBookingEventsData(bookingEvents);
	};

	return (
		<>
			{bookingEventsData && (
				<BookingsComponent
					bookingEventsData={bookingEventsData}
					isLoading={isLoading}
					bookingStatus={BookingsStatus.EXPIRED}
				/>
			)}
		</>
	);
};
