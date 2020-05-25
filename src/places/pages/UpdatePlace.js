import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input/Input';
import Button from '../../shared/components/FormElements/Button/Button';
import Card from '../../shared/components/UIElements/Card/Card';
import LoadingSpinner from '../../shared/components/UIElements/Error-Loading/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/Error-Loading/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'

import './PlaceForm.css';

const UpdatePlace = () => {
  const auth = useContext(AuthContext)
  const { isLoading, error, clearError, sendRequest } = useHttpClient()
  const [loadedPlace, setLoadedPlace] = useState()

  const history = useHistory()

  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    true,
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`)
        setLoadedPlace(responseData.place)
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true,
        );
      } catch (error) {}
    }
    fetchPlace()
  }, [sendRequest, placeId, setFormData])

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner asOverlay/>
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find place.</h2>
        </Card>
      </div>
    );
  }

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
     await sendRequest(`http://localhost:5000/api/places/${placeId}`, 
        'PATCH', 
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),{
          'Content-Type' : 'application/json'
        })
      history.push(`/${auth.userId}/places`)
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {!isLoading && loadedPlace && <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
        <Input
          id='title'
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter valid title.'
          onInput={inputHandler}
          initialValue={loadedPlace.title}
          initialValid={true}
        />
        <Input
          id='description'
          element='textarea'
          type='text'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter valid description (min. 5 characters).'
          onInput={inputHandler}
          initialValue={loadedPlace.description}
          initialValid={true}
        />
        <Button type='submit' disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>}
    </React.Fragment>
  );
};

export default UpdatePlace;
