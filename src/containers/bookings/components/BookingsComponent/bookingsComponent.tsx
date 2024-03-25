import React, { useContext, useEffect, useState } from 'react';
import {
	AUTHORITIES,
	hasUserAuthority,
	UserDataContext,
	BookingEventUiInterface
} from '../../../../globalState';
import { Loading } from '../../../../components/app/Loading';
import { BookingsStatus } from '../../../../utils/consultant';
import { apiGetAskerSessionList } from '../../../../api';
import { NoBookingsBooked } from '../NoBookings/noBookingsBooked';
import { Event } from '../Event/event';

interface BookingsComponentProps {
	bookingEventsData: BookingEventUiInterface[];
	isLoading: boolean;
	bookingStatus: BookingsStatus;
}

export const BookingsComponent: React.FC<BookingsComponentProps> = ({
	bookingEventsData,
	isLoading,
	bookingStatus
}) => {
	const { userData } = useContext(UserDataContext);
	const [sessions, setSessions] = useState(null);

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);

	useEffect(() => {
		if (!isConsultant) {
			apiGetAskerSessionList().then(({ sessions }) => {
				setSessions(sessions);
			});
		}
	}, [isConsultant]);

	const bookingsToShow = () => {
		return (
			<>
				{bookingEventsData.length === 0 ? (
					<NoBookingsBooked sessions={sessions} />
				) : (
					bookingEventsData?.map((event) => (
						<Event
							key={event.id}
							event={event}
							bookingStatus={bookingStatus}
						/>
					))
				)}
			</>
		);
	};

	return <>{isLoading ? <Loading /> : bookingsToShow()}</>;
};
