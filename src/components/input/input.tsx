import * as React from 'react';
import { useState, useEffect } from 'react';
import { TextField, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export interface InputProps {
	label: string;
	value: string;
	shrinkLabel?: boolean;
	onInputChange?: Function;
	startAdornment?: JSX.Element;
	endAdornment?: JSX.Element;
	isValueValid?(value: string): boolean | Promise<boolean>;
	inputType?: 'number' | 'tel' | 'text' | 'password';
	info?: string;
	errorMessage?: string;
	successMesssage?: string;
	multipleCriteria?: Array<{
		info: string;
		validation(val: string): boolean;
	}>;
}

export const Input = ({
	value,
	label,
	onInputChange,
	startAdornment,
	endAdornment,
	isValueValid,
	inputType,
	info,
	errorMessage,
	successMesssage,
	multipleCriteria
}: InputProps) => {
	const [shrink, setShrink] = useState<boolean>(value?.length > 0);
	const [wasBlurred, setWasBlurred] = useState<boolean>(false);
	const [showSuccessMessage, setShowSuccessMessage] =
		useState<boolean>(false);
	const [inputError, setInputError] = useState<boolean>(false);

	const isValid = async (val) => {
		if (isValueValid) {
			return await isValueValid(val);
		} else if (multipleCriteria) {
			return multipleCriteria.every((criteria) =>
				criteria.validation(val)
			);
		} else {
			return true;
		}
	};

	const getMultipleCriteriaDesign = (criteria) => {
		const blurredIcon = wasBlurred ? (
			<CancelIcon
				color="error"
				sx={{
					width: '12px',
					height: '12px',
					mr: '3px'
				}}
			/>
		) : (
			'•'
		);
		const icon = criteria.validation(value) ? (
			<CheckCircleIcon
				color="success"
				sx={{
					width: '12px',
					height: '12px',
					mr: '3px'
				}}
			/>
		) : (
			blurredIcon
		);
		const blurredColor = wasBlurred ? 'error.main' : 'info.light';
		const color = criteria.validation(value)
			? 'success.main'
			: blurredColor;
		return { icon, color };
	};

	return (
		<>
			<TextField
				type={inputType || 'text'}
				fullWidth
				label={label}
				sx={{
					'&[type=number]': {
						'-moz-appearance': 'textfield'
					},
					'&::-webkit-outer-spin-button': {
						'-webkit-appearance': 'none',
						'margin': 0
					},
					'&::-webkit-inner-spin-button': {
						'-webkit-appearance': 'none',
						'margin': 0
					},
					'mt': '24px',
					'& legend': {
						display: 'none'
					},
					'& label': {
						ml: 4,
						color: 'info.light'
					},
					'& label.MuiInputLabel-shrink': {
						top: '10px'
					},
					'& .MuiOutlinedInput-root': {
						'&.Mui-focused fieldset': {
							borderColor: showSuccessMessage && 'success.main'
						},
						'&:hover fieldset': {
							borderColor: showSuccessMessage && 'success.main'
						}
					},
					'& fieldset': {
						'borderWidth': showSuccessMessage && '2px',
						'borderColor': showSuccessMessage && 'success.main',
						'&:hover': {
							borderColor: showSuccessMessage && 'success.main'
						}
					},
					'& .Mui-error fieldset': {
						borderWidth: '2px'
					}
				}}
				InputLabelProps={{
					shrink: shrink
				}}
				color="info"
				InputProps={{
					startAdornment: startAdornment,
					endAdornment: endAdornment
				}}
				value={value}
				error={inputError}
				onChange={async (e) => {
					onInputChange(e.target.value);
					const valid = await isValid(e.target.value);
					if (inputError && valid) {
						setInputError(false);
						setShowSuccessMessage(
							!!successMesssage || !!multipleCriteria
						);
					} else if (showSuccessMessage && !valid) {
						setInputError(true);
						setShowSuccessMessage(false);
					}
				}}
				onFocus={() => {
					setShrink(true);
				}}
				onBlur={async () => {
					setWasBlurred(true);
					const valid = await isValid(value);
					if (value?.length === 0) {
						setShrink(false);
					} else if (!valid) {
						setInputError(true);
					}
					if ((successMesssage || multipleCriteria) && valid) {
						setShowSuccessMessage(true);
					} else {
						setShowSuccessMessage(false);
					}
				}}
			></TextField>
			{info && !inputError && !showSuccessMessage && (
				<Typography
					variant="body2"
					sx={{
						mt: '8px',
						fontSize: '12px',
						lineHeight: '16px',
						color: 'info.light'
					}}
				>
					{info}
				</Typography>
			)}
			{errorMessage && inputError && (
				<Typography
					variant="body2"
					sx={{
						mt: '8px',
						fontSize: '12px',
						lineHeight: '16px',
						color: 'error.main'
					}}
				>
					{errorMessage}
				</Typography>
			)}
			{showSuccessMessage && successMesssage && (
				<Typography
					variant="body2"
					sx={{
						mt: '8px',
						fontSize: '12px',
						lineHeight: '16px',
						color: 'success.main'
					}}
				>
					{successMesssage}
				</Typography>
			)}
			{multipleCriteria &&
				multipleCriteria.map((criteria) => {
					return (
						<Typography
							variant="body2"
							sx={{
								mt: '8px',
								fontSize: '12px',
								lineHeight: '16px',
								color: getMultipleCriteriaDesign(criteria)
									.color,
								display: 'flex',
								alignItems: 'center'
							}}
						>
							{getMultipleCriteriaDesign(criteria).icon}{' '}
							{criteria.info}
						</Typography>
					);
				})}
		</>
	);
};
