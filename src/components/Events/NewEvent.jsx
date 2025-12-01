import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent } from '../../util/http.js';
import { queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {

  const navigate = useNavigate();

  const { mutate, isPending, error, isError, reset } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/events');
    }
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }
  function handleClose() {
    navigate('../');
    reset();
  }

  return (
    <Modal onClose={handleClose}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && (<span>Sending data...</span>)}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>

      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={error.info?.message || 'An unexpected error occurred. Please try again later.'}
        />
      )}
    </Modal>
  );
}