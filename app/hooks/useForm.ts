import { useEffect, useState, useMemo, FormEvent, ChangeEvent } from 'react';
import { formatRut, cleanRut, validateRut } from 'rutlib';

export const useForm = ( initialForm = {}, formValidations:any = {} ) => {
  
    const [ formState, setFormState ]:any = useState( initialForm );
    const [ formValidation, setFormValidation ]:any = useState({});

    useEffect(() => {
        
        createValidators();
    
    }, [ formState ]);

    useEffect(()=> {
        setFormState( initialForm );
    },[  ])

    const isFormValid = useMemo(()=> {
        
        for (const formValue of Object.keys( formValidation )) {
            if( formValidation[formValue] !== null) return false;
        }
        return true;
    }, [ formValidation ])
    

    const onInputChange = (e:FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        
        setFormState({
            ...formState,
            [ name ]: value
        });
    }

    const OnChangeCheck = (event: ChangeEvent<HTMLInputElement> )=> {


        const { name , checked } = event.target;
        setFormState({
            ...formState,
            [ name ]: checked
        });
    }

    const onInputValidRut = (e:FormEvent<HTMLInputElement>)=> {
        const { name, value } = e.currentTarget;
        let withoutdots = formatRut(value, false);
        let cleanrut = cleanRut(withoutdots);
        
        setFormState({
            ...formState,
            [name]: withoutdots
        });

    }

   

    const onInputChangeOnlyNum = ({ target }:any) => {

        const { name, value } = target;
        const inputValue = target.value;
        const numbersOnly = inputValue.replace(/[^0-9]/g, '');
        setFormState({
            ...formState,
            [ name ]: numbersOnly
        });
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }

    const createValidators = ()=> {

        const formCheckedValues:any = {};

        for (const formField of Object.keys( formValidations )) {

            const [ fn, errorMessage ] = formValidations[formField];

            formCheckedValues[`${ formField }Valid`] = fn( formState[formField] ) ? null : errorMessage;
            setFormValidation( formCheckedValues );
            
        }


    }

    return {
        ...formState,
        formState,
        onInputChange,
        OnChangeCheck,
        onInputChangeOnlyNum,
        onResetForm,
        ...formValidation,
        isFormValid,
        onInputValidRut
    }
}
