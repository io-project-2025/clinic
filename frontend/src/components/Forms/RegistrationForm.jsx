import React, { useState } from 'react';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        PESEL: '',
        phone: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

    };

    return (
        <form onSubmit={handleSubmit} className="registration-form">
            <div>
                <label htmlFor="name">Imie:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="surname">Nazwisko:</label>
                <input
                    type="text"
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="PESEL">PESEL:</label>
                <input
                    type="number"
                    id="PESEL"
                    name="PESEL"
                    value={formData.PESEL}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="phone">Numer telefonu:</label>
                <input
                    type="number"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Hasło:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Zarejestruj się</button>
        </form>
    );
};

export default RegistrationForm;