import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { updateEvent, queryClient, fetchEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isPending, isError } = useQuery({
    queryKey: ['event-details', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['event-details', id] });
    // }
    onMutate: async (data) => {
      const newEvent = data.eventData
      await queryClient.cancelQueries({ queryKey: ['event-details', id] });
      const oldData = queryClient.getQueryData(['event-details', id]);
      queryClient.setQueryData(['event-details', id], newEvent);

      return { oldData };
    },

    onError: (error, variables, data, context) => {
      queryClient.setQueryData(['event-details', id], context.oldData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['event-details', id] });
    },
  });

  function handleSubmit(formData) {
    mutate({ id, eventData: formData });
    navigate(`../`);
  };

  function handleClose() {
    navigate('../');
  }

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  };

  if (isError) {
    content = <>
      <ErrorBlock title="Error loading event details" message={error.info?.message || "Failed to load events"} />
      <div className="form-actions">
        <Link to="../" className="button">
          Close
        </Link>
      </div>
    </>
  }


  if (data) {
    content = <EventForm inputData={data} onSubmit={handleSubmit}>
      <Link to="../" className="button-text">
        Cancel
      </Link>
      <button type="submit" className="button">
        Update
      </button>
    </EventForm>;
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}