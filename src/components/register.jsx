import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { name, email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const saveFormDataLocally = (data) => {
        // Save form data to local storage or client-side database
        // For example, using localStorage:
        const savedData = JSON.parse(localStorage.getItem('formData')) || [];
        savedData.push(data);
        localStorage.setItem('formData', JSON.stringify(savedData));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/register',
                formData
            );
            console.log(response.data);
            // Show success SweetAlert2 popup
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Form submitted successfully!'
            });

            navigate('/dashboard');

            // Reset the form
            setFormData({
                name: '',
                email: '',
                password: ''
            });
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status !== 0) {
                // Show error SweetAlert2 popup
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.message ,
                    text: error.response.data['data']['email'] 
                });
            } else {
                // Save form data locally if API is not accessible
                Swal.fire({
                    icon: 'error',
                    title: 'Internet?',
                    text:
                        'You don\'t have an active internet connection. Registration will be completed once connected.'
                });
                saveFormDataLocally(formData);
            }
        }
    };

    const syncFormDataWithServer = async () => {
        const savedData = JSON.parse(localStorage.getItem('formData')) || [];

        for (const data of savedData) {
            try {
                const response = await axios.post(
                    'http://127.0.0.1:8000/api/register',
                    data
                );
                console.log(response.data);
                // Remove data from local storage after successfully sending to server
                savedData.splice(savedData.indexOf(data), 1);
                localStorage.setItem('formData', JSON.stringify(savedData));
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        // Check for internet connection when the component mounts
        const checkInternetConnection = () => {
            // You can use any method to check internet connection here
            // For example, checking if the navigator is online
            if (navigator.onLine) {
                // Sync the form data with the server
                syncFormDataWithServer();
            }
        };

        // Listen for the online event to trigger the sync function
        window.addEventListener('online', checkInternetConnection);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('online', checkInternetConnection);
        };
    }, []);



    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign up
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            name
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
