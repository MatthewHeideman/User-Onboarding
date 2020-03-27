import React,{useState, useEffect} from 'react';
import './Form.css';
import * as yup from 'yup';
import axios from 'axios';

const formSchema = yup.object().shape({
    name: yup.string().required("Name is a required field."),
    email: yup
      .string()
      .email("Must be a valid email address.")
      .required("Must include email address."),
    password: yup.string().required('Must include password.'),
    terms: yup.boolean().oneOf([true], "please agree to terms of use"),
});

function Form() {
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        terms: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        terms: "",
    });
    const [post, setPost] = useState([]);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
          setButtonDisabled(!valid);
        });
    }, [formState]);
    const formSubmit = e => {
        e.preventDefault();
        axios
          .post("https://reqres.in/api/users", formState)
          .then(res => {
            setPost(res.data);
            setUsers([
                ...users,
                res.data
            ])
            setFormState({
              name: "",
              email: "",
              password: "",
              terms: "",
            });
          })
          .catch(err => console.log(err.response));
      };
    const validateChange = e => {
        yup
          .reach(formSchema, e.target.name)
          .validate(e.target.name === "terms" ? e.target.checked : e.target.value)
    
          .then(valid => {
            setErrors({
              ...errors,
              [e.target.name]: ""
            });
          })
          .catch(err => {
            setErrors({
              ...errors,
              [e.target.name]: err.errors[0]
            });
        });
    };
    const inputChange = e => {
        e.persist();
        const newFormData = {
          ...formState,
          [e.target.name]:
            e.target.type === "checkbox" ? e.target.checked : e.target.value
        };
    
        validateChange(e);
        setFormState(newFormData);
      };
    return(
        <div>
            <form className='form' onSubmit = {formSubmit}>
                <label htmlFor='name'> 
                    Name:
                    <input type='text' name='name' id='name' value={formState.name} onChange={inputChange}/>
                    {errors.name.length > 0 ? <p className="error" data-cy = "nameError">{errors.name}</p> : null}
                </label>
                <label htmlFor='email'>
                    E-Mail:
                    <input type = 'email' name='email' id='email' value={formState.email} onChange={inputChange}/>
                    {errors.email.length > 0 ? <p className="error" data-cy = "emailError">{errors.email}</p> : null}
                </label>
                <label htmlFor='password'>
                    Password:
                    <input type = 'password' name='password' id='password' value={formState.password} onChange={inputChange}/>
                    {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
                </label>
                <label htmlFor='terms'>
                    Terms of Service:
                    <input type='checkbox' name='terms' id='terms' checked={formState.terms} onChange={inputChange}/>
                </label>
                <pre>{JSON.stringify(post, null, 2)}</pre>
                {users.map(item => {
                    return (
                        <div>
                            <p>
                                {item.name}
                            </p>
                        </div>
                    )
                })}
                <button disabled={buttonDisabled}>
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Form;