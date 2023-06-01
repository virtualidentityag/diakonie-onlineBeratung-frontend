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
	startAdornment?: React.JSX.Element;
	endAdornment?: React.JSX.Element;
	isValueValid?(value: string): boolean;
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
	shrinkLabel = false,
	errorMessage,
	successMesssage,
	multipleCriteria
}: InputProps) => {
	const [shrink, setShrink] = useState<boolean>(shrinkLabel || false);
	const [wasBlurred, setWasBlurred] = useState<boolean>(false);
	const [showSuccessMessage, setShowSuccessMessage] =
		useState<boolean>(false);
	const [inputError, setInputError] = useState<boolean>(false);

	const isValid = (val) => {
		if (isValueValid) {
			return isValueValid(val);
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

	useEffect(() => {
		console.log(shrinkLabel);
		setShrink(shrinkLabel);
	}, [shrinkLabel]);

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
				onChange={(e) => {
					onInputChange(e.target.value);
					if (inputError && isValid(e.target.value)) {
						setInputError(false);
						setShowSuccessMessage(
							!!successMesssage || !!multipleCriteria
						);
					} else if (showSuccessMessage && !isValid(e.target.value)) {
						setInputError(true);
						setShowSuccessMessage(false);
					}
				}}
				onFocus={() => {
					setShrink(true);
				}}
				onBlur={() => {
					setWasBlurred(true);
					if (value.length === 0) {
						setShrink(false);
					} else if (!isValid(value)) {
						setInputError(true);
					}
					if (
						(successMesssage || multipleCriteria) &&
						isValid(value)
					) {
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
