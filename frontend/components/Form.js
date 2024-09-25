import React, { useEffect, useState } from "react";
import * as yup from 'yup';

const validationErrors = {
    fullNameTooShort: 'Full name must be at least 3 characters',
    fullNameTooLong: 'Full name must be at most 20 characters',
    sizeIncorrect: 'Size must be S, M, or L'
}

const validationSchema = yup.object().shape({
    fullName: yup
        .string()
        .min(3, validationErrors.fullNameTooShort)
        .max(20, validationErrors.fullNameTooLong)
        .trim(),
    size: yup.string().oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect)
});

const toppings = [
    { topping_id: '1', text: 'Pepperoni' },
    { topping_id: '2', text: 'Green Peppers' },
    { topping_id: '3', text: 'Pineapple' },
    { topping_id: '4', text: 'Mushrooms' },
    { topping_id: '5', text: 'Ham' },
];

const initialValues = { fullName: '', size: '', toppings: [] };

export default function Form() {
    const [enabled, setEnabled] = useState(false);
    const [errors, setErrors] = useState({ fullName: "", size: "" });
    const [values, setValues] = useState(initialValues);
    const [orderComplete, setOrderComplete] = useState(false);

    useEffect(() => {
        const isValid = validationSchema.isValidSync(values);
        setEnabled(isValid);
    }, [values]);

    const validate = (key, value) => {
        yup
            .reach(validationSchema, key)
            .validate(value)
            .then(() => { setErrors({ ...errors, [key]: '' }) })
            .catch(error => {
                setErrors({ ...errors, [key]: error.errors[0] });
            });
    };

    const handleChange = (evt) => {
        const { id, value } = evt.target;
        validate(id, value);
        setValues({ ...values, [id]: value });
    };

    const handleToppings = (evt) => {
        const { name, checked } = evt.target;
        if (checked) {
            setValues({ ...values, toppings: [...values.toppings, name] });
        } else {
            setValues({ ...values, toppings: values.toppings.filter(t => t !== name) });
        }
    };

    const onSubmit = (evt) => {
        evt.preventDefault();

        setOrderComplete(true);
    };

    const formatToppings = (toppingIds) => {
        return toppingIds.map(toppingId =>
            toppings.find(t => t.topping_id === toppingId).text
        ).join(', ');
    };

    return (
        <form onSubmit={onSubmit}>
            <h2>Order Your Pizza</h2>

            {/* Conditionally render form or order confirmation */}
            {!orderComplete ? (
                <>
                    <div className="input-group">
                        <div>
                            <label htmlFor="fullName">Full Name</label>
                            <br />
                            <input
                                placeholder="Type full name"
                                id="fullName"
                                type="text"
                                value={values.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.fullName && <div className='error'>{errors.fullName}</div>}
                    </div>

                    <div className="input-group">
                        <div>
                            <label htmlFor="size">Size</label><br />
                            <select id="size" value={values.size} onChange={handleChange}>
                                <option value="">----Choose Size----</option>
                                <option value={"S"}>S</option>
                                <option value={"M"}>M</option>
                                <option value={"L"}>L</option>
                            </select>
                        </div>
                        {errors.size && <div className='error'>{errors.size}</div>}
                    </div>

                    <div className="input-group">
                        {toppings.map(({ topping_id, text }) => (
                            <label key={topping_id}>
                                <input
                                    name={topping_id}
                                    type="checkbox"
                                    onChange={handleToppings}
                                    checked={!!values.toppings.find(t => t === topping_id)}
                                />
                                {text}
                                <br />
                            </label>
                        ))}
                    </div>

                    <input type="submit" disabled={!enabled} />
                </>
            ) : (
                <div>
                    <h2>Order Completed:</h2>
                    <p>Full Name: {values.fullName}</p>
                    <p>Size: {values.size}</p>
                    <p>Toppings: {formatToppings(values.toppings)}</p>
                </div>
            )}
        </form>
    );
}
