import { useState } from "react";

export const useForm = (initialForm = {}, validateForm) => {

    const [values, setValues] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { value, name, type, checked, reset } = e.target;

        setValues({
            ...values,
            [name]: type === 'checkbox' ? checked : value
        })
    }
     const reset = () => {
    setValues(initialForm); 
    setErrors({});         
  };
    const handleSubmit = async (e, submitCallback) => {
        e.preventDefault()


        if (validateForm) {
            const validationErrors = validateForm(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length === 0) {
                submitCallback()
            }
        } else {
            submitCallback()
        }
    }
    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        reset
    }
}