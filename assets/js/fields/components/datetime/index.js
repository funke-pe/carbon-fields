/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Flatpickr from 'react-flatpickr';
import {
	compose,
	withHandlers,
	withState,
	withProps,
	setStatic
} from 'recompose';

/**
 * The internal dependencies.
 */
import Field from 'fields/components/field';
import withStore from 'fields/decorators/with-store';
import withSetup from 'fields/decorators/with-setup';
import { TYPE_DATE, TYPE_DATETIME, TYPE_TIME } from 'fields/constants';

/**
 * Render an input with a datepicker.
 *
 * @param  {Object}        props
 * @param  {String}        props.name
 * @param  {Object}        props.field
 * @param  {Object}        props.options
 * @param  {String}        props.buttonText
 * @return {React.Element}
 */
export const DateTimeField = ({
	name,
	field,
	options,
	buttonText
}) => {
	return <Field field={field}>
		<Flatpickr options={options} className="carbon-field-group-holder">
			<input
				type="hidden"
				name={name}
				value={field.value}
				disabled={!field.ui.is_visible} />

			<input
				type="text"
				className="regular-text carbon-field-group-input"
				defaultValue={field.value}
				data-input
				{...field.attributes} />

			<button
				type="button"
				className="button"
				data-toggle>
					{buttonText}
			</button>
		</Flatpickr>
	</Field>;
};

/**
 * Validate the props.
 *
 * @type {Object}
 */
DateTimeField.propTypes = {
	name: PropTypes.string,
	field: PropTypes.shape({
		id: PropTypes.string,
		value: PropTypes.string,
		attributes: PropTypes.object,
	}),
	options: PropTypes.object,
	buttonText: PropTypes.string,
};

/**
 * The enhancer.
 *
 * @type {Function}
 */
export const enhance = compose(
	/**
	 * Connect to the Redux store.
	 */
	withStore(),

	/**
	 * Attach the setup hooks.
	 */
	withSetup(),

	/**
	 * Pass some handlers to the component.
	 */
	withHandlers({
		handleChange: ({ field, updateField }) => ([ selectedDate ], selectedDateStr, instance) => {
			instance._selectedDateStr = selectedDateStr;

			const value = selectedDateStr
				? instance.formatDate(selectedDate, field.storage_format)
				: '';

			if (value !== field.value) {
				updateField(field.id, {
					value
				});
			}
		},

		handleClose: () => (selectedDates, selectedDateStr, instance) => {
			const { config, _selectedDateStr } = instance;
			const { value } = instance._input;

			if (value) {
				if (_selectedDateStr && value !== _selectedDateStr) {
					instance.setDate(value, true);
				}
			} else {
				instance.clear();
			}
		}
	}),

	/**
	 * Pass some props to the component.
	 */
	withProps(({ field, handleChange, handleClose }) => {
		const buttonText = field.type === TYPE_TIME
			? carbonFieldsL10n.field.selectTime
			: carbonFieldsL10n.field.selectDate;

		const options = {
			...field.picker_options,
			wrap: true,
			onChange: handleChange,
			onClose: handleClose
		};

		return {
			options,
			buttonText,
		};
	}),
);

export default setStatic('type', [
	TYPE_DATE,
	TYPE_DATETIME,
	TYPE_TIME
])(enhance(DateTimeField));
