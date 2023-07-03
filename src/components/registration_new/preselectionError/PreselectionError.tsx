import * as React from 'react';
import { Box, Snackbar, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

interface PreselectionErrorProps {
	open?: boolean;
	errors?: Array<'tid' | 'aid' | 'cid'>;
	handleClose?(): void;
}

export const PreselectionError = ({
	open,
	errors,
	handleClose
}: PreselectionErrorProps) => {
	const { t } = useTranslation();
	return (
		<Snackbar
			open={open}
			autoHideDuration={3000}
			onClose={handleClose}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
		>
			<div>
				{errors.map((error, index) => (
					<Box
						sx={{
							backgroundColor: '#00000099',
							p: '16px',
							backdropFilter: 'blur(10px)',
							justifyContent: 'flex-start',
							mt: index !== 0 && '16px'
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'top' }}>
							<Box
								sx={{
									mr: '8px',
									backgroundColor: 'error.main',
									borderRadius: '50%',
									p: '4px',
									maxHeight: '24px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'white'
								}}
							>
								<CloseIcon
									aria-hidden="true"
									color="inherit"
									sx={{ width: '16px', height: '16px' }}
								/>
							</Box>
							<Typography
								sx={{ color: 'white', fontWeight: '600' }}
							>
								{t(`registration.errors.${error}.headline`)}
							</Typography>
						</Box>
						<Typography sx={{ mt: '8px', color: 'white' }}>
							{t(`registration.errors.${error}.subline`)}
						</Typography>
					</Box>
				))}
			</div>
		</Snackbar>
	);
};
