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
    terms: yup.boolean().oneOf([true], "please agree to terms of use"),
    password: yup.string(),
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
            setPost(res.data); // get just the form data from the REST api
            console.log("success", post);
            // reset form if successful
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
        // Reach will allow us to "reach" into the schema and test only one part.
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
            <form class='form' onSubmit = {formSubmit}>
                <label htmlFor='name'> 
                    Name:
                    <input type='text' name='name' id='name' value={formState.name} onChange={inputChange}/>
                </label>
                <label htmlFor='email'>
                    E-Mail:
                    <input type = 'email' name='email' id='email' value={formState.email} onChange={inputChange}/>
                </label>
                <label htmlFor='password'>
                    Password:
                    <input type = 'password' name='password' id='password' value={formState.password} onChange={inputChange}/>
                </label>
                <label htmlFor='terms'>
                    Terms of Service:
                    <input type='checkbox' name='terms' id='terms' checked={formState.terms} onChange={inputChange}/>
                </label>
                <button disabled={buttonDisabled}>
                    Submit
                </button>
                <pre>{JSON.stringify(post, null, 2)}</pre>
            </form>
        </div>
    )
}

export default Form;